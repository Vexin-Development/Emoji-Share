import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isLive?: boolean;
}

export default function StatsCard({ title, value, icon, color, isLive = true }: StatsCardProps) {
  return (
    <Card className={`bg-gradient-to-br from-${color}/20 to-${color}/5 border-${color}/30 p-6 text-center group hover:scale-105 transition-transform duration-300`}>
      <div className={`text-3xl font-mono font-bold text-${color} mb-2`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-muted-foreground text-sm">{title}</div>
      {isLive && (
        <div className={`text-xs text-${color} mt-1 flex items-center justify-center`}>
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          Live
        </div>
      )}
    </Card>
  );
}
