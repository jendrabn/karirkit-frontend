import { Card } from "@/components/ui/card";
import { Users, FileStack, BookOpen, UserCheck, Layers, FileText } from "lucide-react";
import type { DashboardStatistics } from "../api/get-dashboard-stats";

interface StatsCardsProps {
  stats: DashboardStatistics;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      label: "Total Pengguna",
      value: stats.total_users,
      icon: Users,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      label: "Total Admin",
      value: stats.total_admins,
      icon: UserCheck,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      label: "Total Blog",
      value: stats.total_blogs,
      icon: BookOpen,
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
    },
    {
        label: "Blog Published",
        value: stats.total_published_blogs,
        icon: BookOpen,
        bgColor: "bg-green-100",
        textColor: "text-green-600",
    },
    {
        label: "Blog Draft",
        value: stats.total_draft_blogs,
        icon: BookOpen,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
    },
    {
      label: "Total Template",
      value: stats.total_templates,
      icon: FileStack,
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-600",
    },
    {
      label: "CV Template",
      value: stats.total_cv_templates,
      icon: FileText,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
        label: "Surat Lamaran Template",
        value: stats.total_cv_templates,
        icon: FileText,
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
      },
    {
        label: "Kategori",
        value: stats.total_categories,
        icon: Layers,
        bgColor: "bg-teal-100",
        textColor: "text-teal-600",
    },
    {
        label: "Tags",
        value: stats.total_tags,
        icon: Layers,
        bgColor: "bg-red-100",
        textColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, index) => (
        <Card key={index} className="p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>
          </div>
          <div className="mt-3">
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
