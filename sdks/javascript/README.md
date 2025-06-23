# Discord Emoji Hub - JavaScript SDK

Official JavaScript/TypeScript SDK for Discord Emoji Hub API.

## Installation

```bash
npm install discord-emoji-hub
```

## Quick Start

```javascript
import { EmojiHubClient } from 'discord-emoji-hub';

const client = new EmojiHubClient({
  baseUrl: 'https://your-emoji-hub-domain.com' // Optional, defaults to main instance
});

// Get platform statistics
const stats = await client.getStats();
console.log(stats);

// List emojis
const result = await client.listEmojis({
  category: 'animated',
  limit: 50
});
console.log(result.emojis);

// Upload emoji
const file = new File([buffer], 'emoji.png', { type: 'image/png' });
const emoji = await client.uploadEmoji(file, {
  name: 'awesome_emoji',
  category: 'reaction',
  tags: ['fun', 'reaction']
});

// Download emoji
const buffer = await client.downloadEmoji('000123');
```

## API Reference

### Constructor

```typescript
new EmojiHubClient(options?: EmojiHubOptions)
```

Options:
- `baseUrl`: Base URL of the API (default: main instance)
- `timeout`: Request timeout in milliseconds (default: 30000)

### Methods

#### `getStats(): Promise<Stats>`
Get platform statistics including total emojis, downloads, likes, and last upload time.

#### `listEmojis(options?: ListEmojisOptions): Promise<ListEmojisResponse>`
List emojis with optional filtering and pagination.

Options:
- `search`: Search term for emoji names and tags
- `category`: Filter by category
- `sort`: Sort order ('newest', 'oldest', 'most-liked', 'most-downloaded')
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 24)

#### `getEmoji(id: string): Promise<Emoji>`
Get detailed information about a specific emoji.

#### `uploadEmoji(file: File | Buffer, options: UploadEmojiOptions): Promise<Emoji>`
Upload a new emoji to the platform.

Options:
- `name`: Emoji name (required)
- `category`: Emoji category
- `tags`: Array of tags

#### `likeEmoji(id: string): Promise<{ likes: number }>`
Like an emoji and get updated like count.

#### `downloadEmoji(id: string): Promise<ArrayBuffer>`
Download the raw emoji file as an ArrayBuffer.

#### `deleteEmoji(id: string): Promise<{ message: string }>`
Delete an emoji (admin only).

## Error Handling

All methods throw errors for HTTP failures or network issues:

```javascript
try {
  const emoji = await client.getEmoji('invalid-id');
} catch (error) {
  console.error('Failed to get emoji:', error.message);
}
```

## Rate Limits

The API has rate limits:
- Upload: 5 per minute
- Like: 10 per minute
- Download: 100 per minute
- General API: 60 per minute

## License

MIT