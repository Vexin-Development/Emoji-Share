# Discord Emoji Hub - Python SDK

Official Python SDK for Discord Emoji Hub API with full async/await support.

## Installation

```bash
pip install discord-emoji-hub
```

## Quick Start

```python
import asyncio
from discord_emoji_hub import EmojiHubClient

async def main():
    # Initialize client
    client = EmojiHubClient()
    
    try:
        # Get platform statistics
        stats = await client.get_stats()
        print(f"Total emojis: {stats['totalEmojis']}")
        
        # List emojis
        result = await client.list_emojis({
            'category': 'animated',
            'limit': 50
        })
        print(f"Found {len(result['emojis'])} emojis")
        
        # Upload emoji
        emoji = await client.upload_emoji(
            'path/to/emoji.png',
            {
                'name': 'awesome_emoji',
                'category': 'reaction',
                'tags': ['fun', 'reaction']
            }
        )
        print(f"Uploaded emoji: {emoji['id']}")
        
        # Download emoji
        data = await client.download_emoji('000123')
        with open('downloaded_emoji.png', 'wb') as f:
            f.write(data)
            
    finally:
        await client.close()

# Run the async function
asyncio.run(main())
```

## Context Manager Usage

```python
async def main():
    async with EmojiHubClient() as client:
        stats = await client.get_stats()
        print(stats)
    # Client automatically closed
```

## API Reference

### Client

```python
EmojiHubClient(base_url="https://discord-emoji-hub.replit.app", timeout=30.0)
```

### Methods

#### `async get_stats() -> Stats`
Get platform statistics.

```python
stats = await client.get_stats()
print(f"Total: {stats['totalEmojis']}")
```

#### `async list_emojis(options=None) -> ListEmojisResponse`
List emojis with filtering and pagination.

```python
result = await client.list_emojis({
    'search': 'funny',
    'category': 'reaction',
    'sort': 'most-liked',
    'page': 1,
    'limit': 24
})
```

#### `async get_emoji(emoji_id: str) -> Emoji`
Get detailed emoji information.

```python
emoji = await client.get_emoji('000123')
print(emoji['name'])
```

#### `async upload_emoji(file_path, options) -> Emoji`
Upload a new emoji.

```python
# From file path
emoji = await client.upload_emoji('emoji.png', {
    'name': 'my_emoji',
    'category': 'reaction'
})

# From bytes
with open('emoji.png', 'rb') as f:
    data = f.read()
emoji = await client.upload_emoji(data, {'name': 'my_emoji'})
```

#### `async like_emoji(emoji_id: str) -> dict`
Like an emoji.

```python
result = await client.like_emoji('000123')
print(f"New like count: {result['likes']}")
```

#### `async download_emoji(emoji_id: str) -> bytes`
Download emoji file data.

```python
data = await client.download_emoji('000123')
with open('emoji.png', 'wb') as f:
    f.write(data)
```

#### `async delete_emoji(emoji_id: str) -> dict`
Delete an emoji (admin only).

```python
result = await client.delete_emoji('000123')
print(result['message'])
```

## Convenience Functions

For one-off requests without managing a client:

```python
from discord_emoji_hub import get_stats, list_emojis, download_emoji

# Get stats
stats = await get_stats()

# List emojis
emojis = await list_emojis({'limit': 10})

# Download emoji
data = await download_emoji('000123')
```

## Error Handling

```python
from discord_emoji_hub import EmojiHubClient, EmojiHubError

try:
    async with EmojiHubClient() as client:
        emoji = await client.get_emoji('invalid-id')
except EmojiHubError as e:
    print(f"API Error: {e}")
```

## Rate Limits

The API enforces rate limits:
- Upload: 5 per minute
- Like: 10 per minute  
- Download: 100 per minute
- General API: 60 per minute

## Requirements

- Python 3.8+
- httpx >= 0.25.0
- typing-extensions >= 4.0.0

## License

MIT