import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, X } from "lucide-react";
import { type Emoji } from "@shared/schema";
import { useState } from "react";

interface EmojiModalProps {
  emoji: Emoji | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLike?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export default function EmojiModal({ emoji, open, onOpenChange, onLike, onDownload }: EmojiModalProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!emoji) return null;

  const handleLike = async () => {
    if (isLiking || !onLike) return;
    
    setIsLiking(true);
    try {
      await onLike(emoji.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDownload = async () => {
    if (isDownloading || !onDownload) return;
    
    setIsDownloading(true);
    try {
      await onDownload(emoji.id);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  const imageUrl = `/api/emoji/${emoji.id}/file`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {emoji.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <img 
              src={imageUrl}
              alt={emoji.name}
              className="w-32 h-32 mx-auto rounded-xl border border-border mb-4 object-cover"
            />
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleLike}
                disabled={isLiking}
                className="mr-2"
              >
                <Heart className="h-4 w-4 mr-2 text-red-400" />
                {emoji.likes}
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ID
              </label>
              <div className="font-mono text-foreground">{emoji.id}</div>
            </div>
            
            {emoji.category && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Category
                </label>
                <Badge variant="secondary">{emoji.category}</Badge>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                File Size
              </label>
              <div className="text-foreground">{formatFileSize(emoji.fileSize)}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Dimensions
              </label>
              <div className="text-foreground">{emoji.width}×{emoji.height}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Downloads
              </label>
              <div className="text-foreground">{emoji.downloads.toLocaleString()}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Uploaded
              </label>
              <div className="text-foreground">{formatDate(new Date(emoji.uploadedAt!))}</div>
            </div>
            
            {emoji.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1">
                  {emoji.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
