import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Send,
  Briefcase,
  FolderOpen,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Star,
  ThumbsUp,
  Bookmark,
  FileStack,
} from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/api/get-dashboard-stats";
import { MinimalSEO } from "@/components/minimal-seo";
import { seoConfig } from "@/config/seo";
import type { UserUsageQuota } from "@/types/usage";

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

interface UsageItem {
  key: keyof UserUsageQuota;
  label: string;
  format?: (v: number) => string;
}

const usageItems: UsageItem[] = [
  { key: "max_cvs", label: "CV" },
  { key: "max_application_letters", label: "Surat Lamaran" },
  { key: "max_applications", label: "Lamaran" },
  { key: "max_document_storage_bytes", label: "Penyimpanan", format: formatBytes },
  { key: "max_cv_pdf_downloads", label: "Download CV PDF" },
  { key: "max_cv_docx_downloads", label: "Download CV DOCX" },
  { key: "max_letter_pdf_downloads", label: "Download Surat PDF" },
  { key: "max_letter_docx_downloads", label: "Download Surat DOCX" },
  { key: "max_cv_ai_improvements", label: "AI CV" },
  { key: "max_application_letter_ai_improvements", label: "AI Surat" },
];

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
    {
      label: "Wawancara",
      value: stats?.interview_applications ?? 0,
      icon: Calendar,
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-600",
    },
    {
      label: "Offer",
      value: stats?.offer_applications ?? 0,
      icon: Star,
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
    {
      label: "Diterima",
      value: stats?.accepted_applications ?? 0,
      icon: ThumbsUp,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      label: "Total Dokumen",
      value: stats?.total_documents ?? 0,
      icon: FileStack,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      label: "Pekerjaan Tersimpan",
      value: stats?.saved_jobs_count ?? 0,
      icon: Bookmark,
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout breadcrumbItems={[{ label: "Dashboard" }]}>
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
      <DashboardLayout breadcrumbItems={[{ label: "Dashboard" }]}>
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

  const usage = stats?.usage;

  return (
    <DashboardLayout breadcrumbItems={[{ label: "Dashboard" }]}>
      <MinimalSEO
        title={seoConfig.dashboard.title}
        description={seoConfig.dashboard.description}
        noIndex={true}
      />
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan aktivitas dan statistik lamaran Anda."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="rounded-2xl p-5">
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

      {usage && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {usageItems.map((item) => {
                const quota = usage[item.key];
                if (typeof quota === "boolean") return null;
                const { limit, used, remaining } = quota;
                const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;
                const formatValue = item.format || ((v: number) => String(v));

                return (
                  <div key={item.key} className="space-y-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatValue(used)} / {formatValue(limit)}</span>
                      <span>{formatValue(remaining)} tersisa</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
