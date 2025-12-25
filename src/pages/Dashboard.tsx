import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Send,
  Briefcase,
  FolderOpen,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/api/get-dashboard-stats";
import { MinimalSEO } from "@/components/MinimalSEO";
import { seoConfig } from "@/config/seo";

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  const statCards = [
    {
      label: "Total Lamaran",
      value: stats?.total_applications ?? 0,
      icon: Send,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      label: "Surat Lamaran",
      value: stats?.total_application_letters ?? 0,
      icon: FileText,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "Total CV",
      value: stats?.total_cvs ?? 0,
      icon: Briefcase,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      label: "Total Portfolio",
      value: stats?.total_portfolios ?? 0,
      icon: FolderOpen,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      label: "Lamaran Aktif",
      value: stats?.active_applications ?? 0,
      icon: CheckCircle,
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      label: "Lamaran Tidak Aktif",
      value: stats?.inactive_applications ?? 0,
      icon: XCircle,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <MinimalSEO
          title={seoConfig.dashboard.title}
          description={seoConfig.dashboard.description}
          noIndex={true}
        />
        <PageHeader
          title="Dashboard"
          subtitle="Ringkasan aktivitas dan statistik lamaran Anda."
        />
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <MinimalSEO
          title={seoConfig.dashboard.title}
          description={seoConfig.dashboard.description}
          noIndex={true}
        />
        <PageHeader
          title="Dashboard"
          subtitle="Ringkasan aktivitas dan statistik lamaran Anda."
        />
        <div className="text-center py-10 text-destructive">
          Gagal mengambil data statistik. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MinimalSEO
        title={seoConfig.dashboard.title}
        description={seoConfig.dashboard.description}
        noIndex={true}
      />
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan aktivitas dan statistik lamaran Anda."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
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
}
