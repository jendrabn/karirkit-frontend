import { 
  FileText, 
  Clock, 
  Users, 
  Award, 
  XCircle, 
  Bell, 
  AlertTriangle,
  CalendarOff,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type ApplicationStats as ApplicationStatsType } from "../api/get-application-stats";

interface ApplicationStatsProps {
  stats: ApplicationStatsType;
  onStatClick: (filter: string) => void;
  activeFilter?: string;
  isLoading?: boolean;
}

export function ApplicationStats({ stats, onStatClick, activeFilter, isLoading }: ApplicationStatsProps) {
  
  const statCards = [
    { 
      key: "total",
      label: "Total Lamaran", 
      value: stats?.total_applications || 0, 
      icon: FileText, 
      color: "text-foreground"
    },
    { 
      key: "active",
      label: "Lamaran Aktif", 
      value: stats?.active_applications || 0, 
      icon: Clock, 
      color: "text-blue-600"
    },
    { 
      key: "interview",
      label: "Interview", 
      value: stats?.interview || 0, 
      icon: Users, 
      color: "text-purple-600"
    },
    { 
      key: "offer",
      label: "Offer", 
      value: stats?.offer || 0, 
      icon: Award, 
      color: "text-primary"
    },
    { 
      key: "rejected",
      label: "Ditolak", 
      value: stats?.rejected || 0, 
      icon: XCircle, 
      color: "text-destructive"
    },
    { 
      key: "needs_followup", // Changed to match API key
      label: "Perlu Follow-up", 
      value: stats?.needs_followup || 0, 
      icon: Bell, 
      color: "text-amber-600"
    },
    { 
      key: "overdue",
      label: "Overdue", 
      value: stats?.overdue || 0, 
      icon: AlertTriangle, 
      color: "text-destructive",
      warning: true
    },
    { 
      key: "no_followup", // Changed to match API key
      label: "Tanpa Follow-up", 
      value: stats?.no_followup || 0, 
      icon: CalendarOff, 
      color: "text-muted-foreground"
    },
  ];

  if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-3 h-20 bg-muted/20" />
                </Card>
            ))}
        </div>
      )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {statCards.map((stat) => (
        <Card 
          key={stat.key}
          onClick={() => onStatClick(stat.key)}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
            activeFilter === stat.key && "border-primary ring-1 ring-primary",
            stat.warning && stat.value > 0 && "border-destructive/50 bg-destructive/5"
          )}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
              <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
            </div>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
