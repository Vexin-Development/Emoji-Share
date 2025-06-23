import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { CloudUpload, Search, TrendingUp, Users, Download, Heart, Clock } from "lucide-react";
import { Link } from "wouter";
import { type Stats } from "@shared/schema";

export default function Home() {
  const { stats: liveStats } = useWebSocket();
  
  // Fallback to API if WebSocket is not connected
  const { data: apiStats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    enabled: !liveStats,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });

  const stats = liveStats || apiStats;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-discord-gradient">
              Discord Emoji Hub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover, share, and download high-quality Discord emojis. 
              Built for communities, creators, and developers.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link href="/upload">
                <Button size="lg" className="discord-gradient text-white px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-300">
                  <CloudUpload className="mr-2 h-5 w-5" />
                  Upload Emoji
                </Button>
              </Link>
              <Link href="/browse">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold bg-background/10 hover:bg-background/20 border-border backdrop-blur-sm"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Card className="bg-surface/50 backdrop-blur-sm border-border p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-muted-foreground">
            <TrendingUp className="inline mr-2 h-6 w-6 text-primary" />
            Live Statistics
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Emojis"
              value={stats?.totalEmojis || 0}
              icon={<Users className="h-6 w-6" />}
              color="blue-500"
            />
            <StatsCard
              title="Downloads"
              value={stats?.totalDownloads || 0}
              icon={<Download className="h-6 w-6" />}
              color="cyan-500"
            />
            <StatsCard
              title="Total Likes"
              value={stats?.totalLikes || 0}
              icon={<Heart className="h-6 w-6" />}
              color="red-400"
            />
            <StatsCard
              title="Last Upload"
              value={stats?.lastUploadTime || "Never"}
              icon={<Clock className="h-6 w-6" />}
              color="green-400"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
