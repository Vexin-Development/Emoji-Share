"""Type definitions for the Discord Emoji Hub SDK."""

from datetime import datetime
from typing import Optional, List, Literal, TypedDict


class Emoji(TypedDict):
    """Represents an emoji object."""
    id: str
    name: str
    fileName: str
    filePath: str
    fileSize: int
    mimeType: str
    width: int
    height: int
    category: Optional[str]
    tags: List[str]
    likes: int
    downloads: int
    uploadedAt: datetime


class Stats(TypedDict):
    """Platform statistics."""
    totalEmojis: int
    totalDownloads: int
    totalLikes: int
    lastUploadTime: Optional[str]


class ListEmojisOptions(TypedDict, total=False):
    """Options for listing emojis."""
    search: Optional[str]
    category: Optional[str]
    sort: Optional[Literal['newest', 'oldest', 'most-liked', 'most-downloaded']]
    page: Optional[int]
    limit: Optional[int]


class UploadEmojiOptions(TypedDict, total=False):
    """Options for uploading an emoji."""
    name: str
    category: Optional[str]
    tags: Optional[List[str]]


class ListEmojisResponse(TypedDict):
    """Response from listing emojis."""
    emojis: List[Emoji]
    page: int
    limit: int
    hasMore: bool