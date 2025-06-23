import { type Emoji, type InsertEmoji, type Stats } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  // Emoji operations
  getEmoji(id: string): Promise<Emoji | undefined>;
  getAllEmojis(options?: {
    search?: string;
    category?: string;
    sort?: 'newest' | 'oldest' | 'most-liked' | 'most-downloaded';
    limit?: number;
    offset?: number;
  }): Promise<Emoji[]>;
  createEmoji(emoji: InsertEmoji): Promise<Emoji>;
  updateEmojiLikes(id: string): Promise<Emoji | undefined>;
  updateEmojiDownloads(id: string): Promise<Emoji | undefined>;
  deleteEmoji(id: string): Promise<boolean>;
  
  // Stats operations
  getStats(): Promise<Stats>;
  
  // Utility operations
  getNextEmojiId(): Promise<string>;
}

export class MemStorage implements IStorage {
  private emojis: Map<string, Emoji>;
  private currentId: number;
  private metadataPath: string;

  constructor() {
    this.emojis = new Map();
    this.currentId = 1;
    this.metadataPath = path.resolve(process.cwd(), 'storage', 'metadata.json');
    this.loadMetadata();
  }

  private async loadMetadata() {
    try {
      const data = await fs.readFile(this.metadataPath, 'utf-8');
      const metadata = JSON.parse(data);
      
      if (metadata.emojis) {
        for (const emoji of metadata.emojis) {
          this.emojis.set(emoji.id, emoji);
        }
      }
      
      if (metadata.currentId) {
        this.currentId = metadata.currentId;
      }
    } catch (error) {
      // File doesn't exist or is invalid, start fresh
      await this.saveMetadata();
    }
  }

  private async saveMetadata() {
    try {
      await fs.mkdir(path.dirname(this.metadataPath), { recursive: true });
      const metadata = {
        emojis: Array.from(this.emojis.values()),
        currentId: this.currentId,
        lastUpdated: new Date().toISOString(),
      };
      await fs.writeFile(this.metadataPath, JSON.stringify(metadata, null, 2));
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
  }

  async getEmoji(id: string): Promise<Emoji | undefined> {
    return this.emojis.get(id);
  }

  async getAllEmojis(options: {
    search?: string;
    category?: string;
    sort?: 'newest' | 'oldest' | 'most-liked' | 'most-downloaded';
    limit?: number;
    offset?: number;
  } = {}): Promise<Emoji[]> {
    let emojis = Array.from(this.emojis.values());

    // Apply search filter
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      emojis = emojis.filter(emoji => 
        emoji.name.toLowerCase().includes(searchLower) ||
        emoji.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (options.category) {
      emojis = emojis.filter(emoji => emoji.category === options.category);
    }

    // Apply sorting
    switch (options.sort) {
      case 'oldest':
        emojis.sort((a, b) => new Date(a.uploadedAt!).getTime() - new Date(b.uploadedAt!).getTime());
        break;
      case 'most-liked':
        emojis.sort((a, b) => b.likes - a.likes);
        break;
      case 'most-downloaded':
        emojis.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
      default:
        emojis.sort((a, b) => new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime());
        break;
    }

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    return emojis.slice(offset, offset + limit);
  }

  async createEmoji(insertEmoji: InsertEmoji): Promise<Emoji> {
    const id = await this.getNextEmojiId();
    const emoji: Emoji = {
      ...insertEmoji,
      id,
      likes: 0,
      downloads: 0,
      uploadedAt: new Date(),
    };
    
    this.emojis.set(id, emoji);
    await this.saveMetadata();
    return emoji;
  }

  async updateEmojiLikes(id: string): Promise<Emoji | undefined> {
    const emoji = this.emojis.get(id);
    if (!emoji) return undefined;
    
    emoji.likes += 1;
    this.emojis.set(id, emoji);
    await this.saveMetadata();
    return emoji;
  }

  async updateEmojiDownloads(id: string): Promise<Emoji | undefined> {
    const emoji = this.emojis.get(id);
    if (!emoji) return undefined;
    
    emoji.downloads += 1;
    this.emojis.set(id, emoji);
    await this.saveMetadata();
    return emoji;
  }

  async deleteEmoji(id: string): Promise<boolean> {
    const deleted = this.emojis.delete(id);
    if (deleted) {
      await this.saveMetadata();
    }
    return deleted;
  }

  async getStats(): Promise<Stats> {
    const emojis = Array.from(this.emojis.values());
    const totalEmojis = emojis.length;
    const totalDownloads = emojis.reduce((sum, emoji) => sum + emoji.downloads, 0);
    const totalLikes = emojis.reduce((sum, emoji) => sum + emoji.likes, 0);
    
    const lastUpload = emojis.length > 0 
      ? emojis.sort((a, b) => new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime())[0]
      : null;
    
    const lastUploadTime = lastUpload 
      ? this.getTimeAgo(new Date(lastUpload.uploadedAt!))
      : null;

    return {
      totalEmojis,
      totalDownloads,
      totalLikes,
      lastUploadTime,
    };
  }

  async getNextEmojiId(): Promise<string> {
    const id = this.currentId.toString().padStart(6, '0');
    this.currentId += 1;
    return id;
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}

export const storage = new MemStorage();
