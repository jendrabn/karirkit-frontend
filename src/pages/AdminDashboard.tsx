import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { Users, FileStack, BookOpen, Crown } from "lucide-react";

// Mock admin stats
const adminStats = {
  total_users: 1250,
  total_templates: 24,
  total_blogs: 45,
  premium_users: 180,
};

const adminStatCards = [
  {
    label: "Total Pengguna",
    value: adminStats.total_users,
    icon: Users,
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
  {
    label: "Pengguna Premium",
    value: adminStats.premium_users,
    icon: Crown,
    bgColor: "bg-amber-100",
    textColor: "text-amber-600",
  },
  {
    label: "Total Template",
    value: adminStats.total_templates,
    icon: FileStack,
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-600",
  },
  {
    label: "Total Blog",
    value: adminStats.total_blogs,
    icon: BookOpen,
    bgColor: "bg-pink-100",
    textColor: "text-pink-600",
  },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard Admin"
        subtitle="Ringkasan statistik dan aktivitas platform."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStatCards.map((stat, index) => (
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
    </DashboardLayout>
  );
};

export default AdminDashboard;
