export interface EmojiHubOptions {
  baseUrl?: string;
  timeout?: number;
}

export interface Emoji {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  category: string | null;
  tags: string[];
  likes: number;
  downloads: number;
  uploadedAt: Date;
}

export interface Stats {
  totalEmojis: number;
  totalDownloads: number;
  totalLikes: number;
  lastUploadTime: string | null;
}

export interface ListEmojisOptions {
  search?: string;
  category?: string;
  sort?: 'newest' | 'oldest' | 'most-liked' | 'most-downloaded';
  page?: number;
  limit?: number;
}

export interface UploadEmojiOptions {
  name: string;
  category?: string;
  tags?: string[];
}

export interface ListEmojisResponse {
  emojis: Emoji[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export class EmojiHubClient {
  private baseUrl: string;
  private timeout: number;

  constructor(options: EmojiHubOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://discord-emoji-hub.replit.app';
    this.timeout = options.timeout || 30000;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get platform statistics
   */
  async getStats(): Promise<Stats> {
    return this.request<Stats>('/api/stats');
  }

  /**
   * List emojis with optional filtering and pagination
   */
  async listEmojis(options: ListEmojisOptions = {}): Promise<ListEmojisResponse> {
    const params = new URLSearchParams();
    
    if (options.search) params.append('search', options.search);
    if (options.category) params.append('category', options.category);
    if (options.sort) params.append('sort', options.sort);
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());

    const query = params.toString();
    const endpoint = query ? `/api/emojis?${query}` : '/api/emojis';
    
    return this.request<ListEmojisResponse>(endpoint);
  }

  /**
   * Get a specific emoji by ID
   */
  async getEmoji(id: string): Promise<Emoji> {
    return this.request<Emoji>(`/api/emoji/${id}`);
  }

  /**
   * Upload a new emoji
   */
  async uploadEmoji(file: File | Buffer, options: UploadEmojiOptions): Promise<Emoji> {
    const formData = new FormData();
    
    if (file instanceof Buffer) {
      const blob = new Blob([file]);
      formData.append('file', blob);
    } else {
      formData.append('file', file);
    }
    
    formData.append('name', options.name);
    if (options.category) formData.append('category', options.category);
    if (options.tags) {
      options.tags.forEach(tag => formData.append('tags', tag));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Like an emoji
   */
  async likeEmoji(id: string): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/api/like/${id}`, {
      method: 'POST',
    });
  }

  /**
   * Download an emoji file
   */
  async downloadEmoji(id: string): Promise<ArrayBuffer> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/emoji/${id}/file`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Delete an emoji (admin only)
   */
  async deleteEmoji(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/emoji/${id}`, {
      method: 'DELETE',
    });
  }
}

// Default export
export default EmojiHubClient;

// Named export for convenience
export { EmojiHubClient as EmojiHub };