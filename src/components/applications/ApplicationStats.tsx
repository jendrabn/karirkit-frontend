import { useMemo } from "react";
import { 
  FileText, 
  Clock, 
  Users, 
  Award, 
  XCircle, 
  Bell, 
  AlertTriangle,
  CalendarOff
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Application, ResultStatus } from "@/types/application";
import { cn } from "@/lib/utils";

interface ApplicationStatsProps {
  applications: Application[];
  onStatClick: (filter: string, value?: string) => void;
  activeFilter?: string;
}

export function ApplicationStats({ applications, onStatClick, activeFilter }: ApplicationStatsProps) {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const total = applications.length;
    
    // Active applications (not rejected or accepted)
    const active = applications.filter(
      app => app.result_status === "pending"
    ).length;
    
    // Interview stage
    const interview = applications.filter(
      app => app.status === "user_interview" || app.status === "final_interview"
    ).length;
    
    // Offers (offering, mcu, onboarding, accepted)
    const offer = applications.filter(
      app => app.status === "offering" || app.status === "mcu" || 
             app.status === "onboarding" || app.status === "accepted"
    ).length;
    
    // Rejected
    const rejected = applications.filter(
      app => app.result_status === "failed"
    ).length;
    
    // Need follow up (follow_up_date = today)
    const needFollowUp = applications.filter(app => {
      if (!app.follow_up_date) return false;
      const followUpDate = new Date(app.follow_up_date);
      followUpDate.setHours(0, 0, 0, 0);
      return followUpDate.getTime() === today.getTime();
    }).length;
    
    // Overdue (follow_up_date < today)
    const overdue = applications.filter(app => {
      if (!app.follow_up_date) return false;
      const followUpDate = new Date(app.follow_up_date);
      followUpDate.setHours(0, 0, 0, 0);
      return followUpDate.getTime() < today.getTime() && app.result_status === "pending";
    }).length;
    
    // No follow up date
    const noFollowUp = applications.filter(
      app => !app.follow_up_date && app.result_status === "pending"
    ).length;
    
    return { total, active, interview, offer, rejected, needFollowUp, overdue, noFollowUp };
  }, [applications]);

  const statCards = [
    { 
      key: "total",
      label: "Total Lamaran", 
      value: stats.total, 
      icon: FileText, 
      color: "text-foreground"
    },
    { 
      key: "active",
      label: "Lamaran Aktif", 
      value: stats.active, 
      icon: Clock, 
      color: "text-blue-600"
    },
    { 
      key: "interview",
      label: "Interview", 
      value: stats.interview, 
      icon: Users, 
      color: "text-purple-600"
    },
    { 
      key: "offer",
      label: "Offer", 
      value: stats.offer, 
      icon: Award, 
      color: "text-primary"
    },
    { 
      key: "rejected",
      label: "Ditolak", 
      value: stats.rejected, 
      icon: XCircle, 
      color: "text-destructive"
    },
    { 
      key: "needFollowUp",
      label: "Perlu Follow-up", 
      value: stats.needFollowUp, 
      icon: Bell, 
      color: "text-amber-600"
    },
    { 
      key: "overdue",
      label: "Overdue", 
      value: stats.overdue, 
      icon: AlertTriangle, 
      color: "text-destructive",
      warning: true
    },
    { 
      key: "noFollowUp",
      label: "Tanpa Follow-up", 
      value: stats.noFollowUp, 
      icon: CalendarOff, 
      color: "text-muted-foreground"
    },
  ];

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