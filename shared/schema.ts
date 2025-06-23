import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const emojis = pgTable("emojis", {
  id: text("id").primaryKey(), // 6-digit zero-padded ID
  name: text("name").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  category: text("category"),
  tags: text("tags").array().default([]),
  likes: integer("likes").default(0),
  downloads: integer("downloads").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertEmojiSchema = createInsertSchema(emojis).omit({
  id: true,
  likes: true,
  downloads: true,
  uploadedAt: true,
});

export const statsSchema = z.object({
  totalEmojis: z.number(),
  totalDownloads: z.number(),
  totalLikes: z.number(),
  lastUploadTime: z.string().nullable(),
});

export const uploadEmojiSchema = z.object({
  name: z.string().min(1).max(50),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type Emoji = typeof emojis.$inferSelect;
export type InsertEmoji = z.infer<typeof insertEmojiSchema>;
export type Stats = z.infer<typeof statsSchema>;
export type UploadEmojiRequest = z.infer<typeof uploadEmojiSchema>;
