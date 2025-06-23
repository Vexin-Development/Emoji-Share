import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import EmojiCard from "@/components/EmojiCard";
import EmojiModal from "@/components/EmojiModal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { type Emoji } from "@shared/schema";

interface EmojiResponse {
  emojis: Emoji[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function Browse() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch emojis
  const { data, isLoading, error } = useQuery<EmojiResponse>({
    queryKey: ["/api/emojis", filters, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "24",
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });
      
      const response = await fetch(`/api/emojis?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch emojis');
      }
      return response.json();
    },
  });

  // Like emoji mutation
  const likeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/like/${id}`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch emoji data
      queryClient.invalidateQueries({ queryKey: ["/api/emojis"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to like emoji",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Download emoji
  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/emoji/${id}/file`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emoji-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Invalidate queries to update download count
      queryClient.invalidateQueries({ queryKey: ["/api/emojis"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Download started",
        description: "Emoji download has started",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download emoji",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" back to empty string for the API
    const apiValue = value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: apiValue }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleEmojiClick = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    setModalOpen(true);
  };

  const emojis = data?.emojis || [];
  const hasMore = data?.hasMore || false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-discord-gradient">
          Browse Emojis
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover thousands of community-created emojis for your Discord server.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-surface border-border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search emojis..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-12 bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="animated">Animated</SelectItem>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="reaction">Reaction</SelectItem>
                <SelectItem value="meme">Meme</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <Select
              value={filters.sort}
              onValueChange={(value) => handleFilterChange("sort", value)}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-liked">Most Liked</SelectItem>
                <SelectItem value="most-downloaded">Most Downloaded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="bg-muted rounded-lg h-16 mb-3"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="flex justify-between">
                  <div className="bg-muted rounded h-3 w-8"></div>
                  <div className="bg-muted rounded h-3 w-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-surface border-border p-8 text-center">
          <p className="text-muted-foreground">Failed to load emojis. Please try again.</p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/emojis"] })}
            className="mt-4"
          >
            Retry
          </Button>
        </Card>
      )}

      {/* Emoji Grid */}
      {!isLoading && !error && (
        <>
          {emojis.length === 0 ? (
            <Card className="bg-surface border-border p-8 text-center">
              <p className="text-muted-foreground text-lg">No emojis found.</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting your search or filters.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
              {emojis.map((emoji) => (
                <EmojiCard
                  key={emoji.id}
                  emoji={emoji}
                  onLike={(id) => likeMutation.mutate(id)}
                  onDownload={handleDownload}
                  onClick={handleEmojiClick}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {emojis.length > 0 && (
            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="bg-surface border-border"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <span className="text-muted-foreground">
                Page {currentPage}
              </span>
              
              <Button
                variant="outline"
                disabled={!hasMore}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="bg-surface border-border"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Emoji Modal */}
      <EmojiModal
        emoji={selectedEmoji}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onLike={(id) => likeMutation.mutate(id)}
        onDownload={handleDownload}
      />
    </div>
  );
}
