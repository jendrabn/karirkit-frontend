import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { FileText, Send, Briefcase, FolderOpen, CheckCircle, XCircle } from "lucide-react";

// Mock stats data
const stats = {
  total_applications: 150,
  total_applications_letters: 10,
  total_cvs: 100,
  total_portfolios: 50,
  active_applications: 120,
  inactive_applications: 30,
};

const statCards = [
  {
    label: "Total Lamaran",
    value: stats.total_applications,
    icon: Send,
    bgColor: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    label: "Surat Lamaran",
    value: stats.total_applications_letters,
    icon: FileText,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    label: "Total CV",
    value: stats.total_cvs,
    icon: Briefcase,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    label: "Total Portfolio",
    value: stats.total_portfolios,
    icon: FolderOpen,
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
  },
  {
    label: "Lamaran Aktif",
    value: stats.active_applications,
    icon: CheckCircle,
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
  {
    label: "Lamaran Tidak Aktif",
    value: stats.inactive_applications,
    icon: XCircle,
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan aktivitas dan statistik lamaran Anda."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
