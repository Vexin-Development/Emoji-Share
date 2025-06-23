import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Download } from "lucide-react";
import { type Emoji } from "@shared/schema";

interface EmojiCardProps {
  emoji: Emoji;
  onLike?: (id: string) => void;
  onDownload?: (id: string) => void;
  onClick?: (emoji: Emoji) => void;
}

export default function EmojiCard({ emoji, onLike, onDownload, onClick }: EmojiCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking || !onLike) return;
    
    setIsLiking(true);
    try {
      await onLike(emoji.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading || !onDownload) return;
    
    setIsDownloading(true);
    try {
      await onDownload(emoji.id);
    } finally {
      setIsDownloading(false);
    }
  };

  const imageUrl = `/api/emoji/${emoji.id}/file`;

  return (
    <Card 
      className="bg-surface border-border p-4 hover:border-primary transition-all duration-300 cursor-pointer group"
      onClick={() => onClick?.(emoji)}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={emoji.name}
          className="w-full h-16 object-cover rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Hover overlay with action buttons */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleLike}
            disabled={isLiking}
            className="text-xs"
          >
            <Heart className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-xs"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-foreground truncate mb-2">
          {emoji.name}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center">
            <Heart className="h-3 w-3 text-red-400 mr-1" />
            {emoji.likes}
          </span>
          <span className="flex items-center">
            <Download className="h-3 w-3 mr-1" />
            {emoji.downloads}
          </span>
        </div>
      </div>
    </Card>
  );
}
