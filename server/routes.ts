import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { uploadEmojiSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { z } from "zod";
import sharp from "sharp";

// Rate limiting maps
const uploadRateLimit = new Map<string, number[]>();
const likeRateLimit = new Map<string, number[]>();

// WebSocket clients for real-time updates
const wsClients = new Set<WebSocket>();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 256 * 1024, // 256KB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/gif', 'image/apng'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG, GIF, and APNG files are allowed.'));
    }
  },
});

function checkRateLimit(ip: string, rateLimitMap: Map<string, number[]>, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}

function broadcastStats() {
  storage.getStats().then(stats => {
    const message = JSON.stringify({ type: 'stats', data: stats });
    wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    wsClients.add(ws);
    
    // Send initial stats
    storage.getStats().then(stats => {
      ws.send(JSON.stringify({ type: 'stats', data: stats }));
    });

    ws.on('close', () => {
      wsClients.delete(ws);
    });
  });

  // API Routes

  // Get platform statistics
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get statistics' });
    }
  });

  // Get all emojis with filtering and pagination
  app.get('/api/emojis', async (req, res) => {
    try {
      const { search, category, sort, page = '1', limit = '24' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const emojis = await storage.getAllEmojis({
        search: search as string,
        category: category as string,
        sort: sort as 'newest' | 'oldest' | 'most-liked' | 'most-downloaded',
        limit: limitNum,
        offset,
      });

      res.json({
        emojis,
        page: pageNum,
        limit: limitNum,
        hasMore: emojis.length === limitNum,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get emojis' });
    }
  });

  // Get single emoji by ID
  app.get('/api/emoji/:id', async (req, res) => {
    try {
      const emoji = await storage.getEmoji(req.params.id);
      if (!emoji) {
        return res.status(404).json({ message: 'Emoji not found' });
      }
      res.json(emoji);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get emoji' });
    }
  });

  // Upload new emoji
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Check rate limit (5 uploads per minute)
      if (!checkRateLimit(ip, uploadRateLimit, 5, 60 * 1000)) {
        return res.status(429).json({ message: 'Too many uploads. Please wait before uploading again.' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Please choose a file first.' });
      }

      // Debug: Log what we received
      console.log('Request body:', req.body);
      console.log('File info:', req.file ? { name: req.file.originalname, size: req.file.size, type: req.file.mimetype } : 'No file');

      // Parse and validate form data
      const formData = {
        name: req.body.name || '',
        category: req.body.category && req.body.category !== '' ? req.body.category : undefined,
        tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]).filter(Boolean) : undefined,
      };

      console.log('Parsed form data:', formData);

      const validation = uploadEmojiSchema.safeParse(formData);
      if (!validation.success) {
        console.error('Validation error:', validation.error.errors);
        console.error('Input data:', formData);
        return res.status(400).json({ message: 'Invalid form data', errors: validation.error.errors });
      }

      const { name, category, tags } = validation.data;

      // Check image dimensions
      const metadata = await sharp(req.file.buffer).metadata();
      
      if (metadata.width! > 250 || metadata.height! > 250) {
        return res.status(400).json({ message: 'Image dimensions must be 250×250 pixels or smaller.' });
      }

      // Generate file path based on current date
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      
      const id = await storage.getNextEmojiId();
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `${id}${fileExtension}`;
      const relativePath = `${year}/${month}/${day}/${fileName}`;
      const fullPath = path.resolve(process.cwd(), 'storage', relativePath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      
      // Save file
      await fs.writeFile(fullPath, req.file.buffer);

      // Create emoji record
      const emoji = await storage.createEmoji({
        name,
        fileName,
        filePath: relativePath,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        width: metadata.width!,
        height: metadata.height!,
        category: category || null,
        tags: tags || [],
      });

      // Broadcast updated stats
      broadcastStats();

      res.status(201).json(emoji);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload emoji' });
    }
  });

  // Like an emoji
  app.post('/api/like/:id', async (req, res) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Check rate limit (10 likes per minute)
      if (!checkRateLimit(ip, likeRateLimit, 10, 60 * 1000)) {
        return res.status(429).json({ message: 'Too many likes. Please wait before liking again.' });
      }

      const emoji = await storage.updateEmojiLikes(req.params.id);
      if (!emoji) {
        return res.status(404).json({ message: 'Emoji not found' });
      }

      // Broadcast updated stats
      broadcastStats();

      res.json({ likes: emoji.likes });
    } catch (error) {
      res.status(500).json({ message: 'Failed to like emoji' });
    }
  });

  // Download emoji file
  app.get('/api/emoji/:id/file', async (req, res) => {
    try {
      const emoji = await storage.getEmoji(req.params.id);
      if (!emoji) {
        return res.status(404).json({ message: 'Emoji not found' });
      }

      const filePath = path.resolve(process.cwd(), 'storage', emoji.filePath);
      
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ message: 'File not found' });
      }

      // Update download count
      await storage.updateEmojiDownloads(req.params.id);
      
      // Broadcast updated stats
      broadcastStats();

      res.setHeader('Content-Disposition', `attachment; filename="${emoji.fileName}"`);
      res.setHeader('Content-Type', emoji.mimeType);
      res.sendFile(filePath);
    } catch (error) {
      res.status(500).json({ message: 'Failed to download emoji' });
    }
  });

  // Delete emoji (admin only - simplified for now)
  app.delete('/api/emoji/:id', async (req, res) => {
    try {
      const emoji = await storage.getEmoji(req.params.id);
      if (!emoji) {
        return res.status(404).json({ message: 'Emoji not found' });
      }

      // Delete file
      const filePath = path.resolve(process.cwd(), 'storage', emoji.filePath);
      try {
        await fs.unlink(filePath);
      } catch {
        // File doesn't exist, continue with deletion
      }

      // Delete from storage
      await storage.deleteEmoji(req.params.id);

      // Broadcast updated stats
      broadcastStats();

      res.json({ message: 'Emoji deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete emoji' });
    }
  });

  return httpServer;
}
