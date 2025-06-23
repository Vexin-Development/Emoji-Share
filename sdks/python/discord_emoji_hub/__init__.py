"""
Discord Emoji Hub Python SDK

Official Python SDK for interacting with the Discord Emoji Hub API.
"""

from .client import EmojiHubClient, EmojiHubError
from .types import Emoji, Stats, ListEmojisOptions, UploadEmojiOptions, ListEmojisResponse

__version__ = "1.0.0"
__all__ = [
    "EmojiHubClient", 
    "EmojiHubError",
    "Emoji", 
    "Stats", 
    "ListEmojisOptions", 
    "UploadEmojiOptions", 
    "ListEmojisResponse"
]

# Convenience alias
Client = EmojiHubClient