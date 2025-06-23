"""Main client for the Discord Emoji Hub SDK."""

import asyncio
from pathlib import Path
from typing import Optional, Union, BinaryIO
import httpx
from datetime import datetime

from .types import Emoji, Stats, ListEmojisOptions, UploadEmojiOptions, ListEmojisResponse


class EmojiHubError(Exception):
    """Base exception for Discord Emoji Hub SDK errors."""
    pass


class EmojiHubClient:
    """
    Async client for the Discord Emoji Hub API.
    
    Example:
        >>> client = EmojiHubClient()
        >>> stats = await client.get_stats()
        >>> print(f"Total emojis: {stats['totalEmojis']}")
    """

    def __init__(
        self,
        base_url: str = "https://discord-emoji-hub.replit.app",
        timeout: float = 30.0
    ):
        """
        Initialize the client.
        
        Args:
            base_url: Base URL for the API
            timeout: Request timeout in seconds
        """
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self._client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        """Async context manager entry."""
        await self._ensure_client()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self._client:
            await self._client.aclose()
            self._client = None

    async def _ensure_client(self):
        """Ensure HTTP client is initialized."""
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=self.timeout)

    async def _request(self, method: str, endpoint: str, **kwargs) -> dict:
        """Make an HTTP request."""
        await self._ensure_client()
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = await self._client.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise EmojiHubError(f"HTTP {e.response.status_code}: {e.response.text}")
        except httpx.RequestError as e:
            raise EmojiHubError(f"Request failed: {str(e)}")

    async def get_stats(self) -> Stats:
        """
        Get platform statistics.
        
        Returns:
            Dictionary containing platform stats
        """
        return await self._request("GET", "/api/stats")

    async def list_emojis(self, options: Optional[ListEmojisOptions] = None) -> ListEmojisResponse:
        """
        List emojis with optional filtering and pagination.
        
        Args:
            options: Filtering and pagination options
            
        Returns:
            List of emojis with pagination info
        """
        params = {}
        if options:
            if options.get('search'):
                params['search'] = options['search']
            if options.get('category'):
                params['category'] = options['category']
            if options.get('sort'):
                params['sort'] = options['sort']
            if options.get('page'):
                params['page'] = str(options['page'])
            if options.get('limit'):
                params['limit'] = str(options['limit'])

        return await self._request("GET", "/api/emojis", params=params)

    async def get_emoji(self, emoji_id: str) -> Emoji:
        """
        Get a specific emoji by ID.
        
        Args:
            emoji_id: The emoji ID
            
        Returns:
            Emoji object
        """
        return await self._request("GET", f"/api/emoji/{emoji_id}")

    async def upload_emoji(
        self, 
        file_path: Union[str, Path, BinaryIO, bytes], 
        options: UploadEmojiOptions
    ) -> Emoji:
        """
        Upload a new emoji.
        
        Args:
            file_path: Path to file, file-like object, or bytes
            options: Upload options including name and metadata
            
        Returns:
            Created emoji object
        """
        await self._ensure_client()
        
        # Prepare file data
        if isinstance(file_path, (str, Path)):
            with open(file_path, 'rb') as f:
                file_data = f.read()
            filename = Path(file_path).name
        elif isinstance(file_path, bytes):
            file_data = file_path
            filename = f"{options['name']}.png"
        else:
            file_data = file_path.read()
            filename = getattr(file_path, 'name', f"{options['name']}.png")

        # Prepare form data
        files = {'file': (filename, file_data)}
        data = {'name': options['name']}
        
        if options.get('category'):
            data['category'] = options['category']
        if options.get('tags'):
            for tag in options['tags']:
                data.setdefault('tags', []).append(tag)

        try:
            response = await self._client.post(
                f"{self.base_url}/api/upload",
                files=files,
                data=data
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise EmojiHubError(f"Upload failed: HTTP {e.response.status_code}: {e.response.text}")
        except httpx.RequestError as e:
            raise EmojiHubError(f"Upload failed: {str(e)}")

    async def like_emoji(self, emoji_id: str) -> dict:
        """
        Like an emoji.
        
        Args:
            emoji_id: The emoji ID
            
        Returns:
            Dictionary with updated like count
        """
        return await self._request("POST", f"/api/like/{emoji_id}")

    async def download_emoji(self, emoji_id: str) -> bytes:
        """
        Download an emoji file.
        
        Args:
            emoji_id: The emoji ID
            
        Returns:
            Raw file data as bytes
        """
        await self._ensure_client()
        
        try:
            response = await self._client.get(f"{self.base_url}/api/emoji/{emoji_id}/file")
            response.raise_for_status()
            return response.content
        except httpx.HTTPStatusError as e:
            raise EmojiHubError(f"Download failed: HTTP {e.response.status_code}: {e.response.text}")
        except httpx.RequestError as e:
            raise EmojiHubError(f"Download failed: {str(e)}")

    async def delete_emoji(self, emoji_id: str) -> dict:
        """
        Delete an emoji (admin only).
        
        Args:
            emoji_id: The emoji ID
            
        Returns:
            Success message
        """
        return await self._request("DELETE", f"/api/emoji/{emoji_id}")

    async def close(self):
        """Close the HTTP client."""
        if self._client:
            await self._client.aclose()
            self._client = None


# Convenience functions for one-off requests
async def get_stats(base_url: str = "https://discord-emoji-hub.replit.app") -> Stats:
    """Get platform statistics without creating a persistent client."""
    async with EmojiHubClient(base_url) as client:
        return await client.get_stats()


async def list_emojis(
    options: Optional[ListEmojisOptions] = None,
    base_url: str = "https://discord-emoji-hub.replit.app"
) -> ListEmojisResponse:
    """List emojis without creating a persistent client."""
    async with EmojiHubClient(base_url) as client:
        return await client.list_emojis(options)


async def download_emoji(
    emoji_id: str, 
    base_url: str = "https://discord-emoji-hub.replit.app"
) -> bytes:
    """Download an emoji without creating a persistent client."""
    async with EmojiHubClient(base_url) as client:
        return await client.download_emoji(emoji_id)