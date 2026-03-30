import { Link } from "react-router";
import {
  AlarmClockCheck,
  Briefcase,
  CheckCircle2,
  FileText,
  Files,
  FolderOpen,
  HardDrive,
  Loader2,
  SearchCheck,
  Send,
  Star,
  Target,
  TrendingUp,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { paths } from "@/config/paths";
import { seoConfig } from "@/config/seo";
import { useDashboardStats } from "@/features/dashboard/api/get-dashboard-stats";
import { dayjs } from "@/lib/date";
import { formatNumber } from "@/lib/utils";
import {
  formatSubscriptionStorage,
  SUBSCRIPTION_PLAN_LABELS,
} from "@/features/subscriptions/utils";

function getStorageProgress(used?: number | null, limit?: number | null) {
  if (used == null || limit == null || limit <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (used / limit) * 100));
}

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  const subscriptionPlanLabel = stats?.subscription_plan
    ? SUBSCRIPTION_PLAN_LABELS[stats.subscription_plan]
    : SUBSCRIPTION_PLAN_LABELS.free;
  const subscriptionExpiresAt = stats?.subscription_expires_at
    ? dayjs(stats.subscription_expires_at).format("DD MMM YYYY")
    : null;
  const storageProgress = getStorageProgress(
    stats?.document_storage_used,
    stats?.document_storage_limit,
  );

  const focusCards = [
    {
      label: "Total Lamaran",
      value: stats?.total_applications ?? 0,
      description: `${formatNumber(stats?.active_applications ?? 0)} aktif`,
      icon: Send,
      iconClassName: "text-primary",
      iconContainerClassName: "bg-primary/10",
    },
    {
      label: "Perlu Follow Up",
      value: stats?.needs_followup_applications ?? 0,
      description: `${formatNumber(stats?.no_followup_applications ?? 0)} belum ada tindak lanjut`,
      icon: AlarmClockCheck,
      iconClassName: "text-amber-600",
      iconContainerClassName: "bg-amber-100",
    },
    {
      label: "Terlambat",
      value: stats?.overdue_applications ?? 0,
      description: "Prioritaskan tindak lanjut hari ini",
      icon: TriangleAlert,
      iconClassName: "text-rose-600",
      iconContainerClassName: "bg-rose-100",
    },
  ];

  const pipelineCards = [
    {
      label: "Interview",
      value: stats?.interview_applications ?? 0,
      icon: SearchCheck,
      colorClassName: "text-sky-600",
      bgClassName: "bg-sky-100",
    },
    {
      label: "Offer",
      value: stats?.offer_applications ?? 0,
      icon: TrendingUp,
      colorClassName: "text-violet-600",
      bgClassName: "bg-violet-100",
    },
    {
      label: "Accepted",
      value: stats?.accepted_applications ?? 0,
      icon: CheckCircle2,
      colorClassName: "text-emerald-600",
      bgClassName: "bg-emerald-100",
    },
    {
      label: "Rejected",
      value: stats?.rejected_applications ?? 0,
      icon: XCircle,
      colorClassName: "text-red-600",
      bgClassName: "bg-red-100",
    },
  ];

  const assetCards = [
    {
      label: "CV",
      value: stats?.total_cvs ?? 0,
      icon: Briefcase,
      colorClassName: "text-indigo-600",
      bgClassName: "bg-indigo-100",
    },
    {
      label: "Surat Lamaran",
      value: stats?.total_application_letters ?? 0,
      icon: FileText,
      colorClassName: "text-cyan-600",
      bgClassName: "bg-cyan-100",
    },
    {
      label: "Portofolio",
      value: stats?.total_portfolios ?? 0,
      icon: FolderOpen,
      colorClassName: "text-orange-600",
      bgClassName: "bg-orange-100",
    },
    {
      label: "Dokumen",
      value: stats?.total_documents ?? 0,
      icon: Files,
      colorClassName: "text-fuchsia-600",
      bgClassName: "bg-fuchsia-100",
    },
    {
      label: "Lowongan Tersimpan",
      value: stats?.saved_jobs_count ?? 0,
      icon: Star,
      colorClassName: "text-yellow-600",
      bgClassName: "bg-yellow-100",
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
        <div className="flex min-h-[50vh] items-center justify-center">
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
        <div className="py-10 text-center text-destructive">
          Gagal mengambil data dashboard. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout breadcrumbItems={[{ label: "Dashboard" }]}>
      <MinimalSEO
        title={seoConfig.dashboard.title}
        description={seoConfig.dashboard.description}
        noIndex={true}
      />
      <PageHeader
        title="Dashboard"
        subtitle="Pantau progres lamaran, aset akun, dan penggunaan plan dari satu tempat."
      />

      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
          <Card className="overflow-hidden rounded-3xl border-primary/15 bg-linear-to-br from-primary/8 via-background to-background p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
                  Paket {subscriptionPlanLabel}
                </Badge>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Ringkasan plan dan penggunaan akun
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Data ini langsung berasal dari endpoint dashboard terbaru, jadi
                    status plan, unduhan, dan storage sudah sinkron tanpa request tambahan.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Berlaku Sampai
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {subscriptionExpiresAt ?? "Tidak ada batas"}
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Unduhan Hari Ini
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {formatNumber(stats?.download_today_count ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Total Unduhan
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {formatNumber(stats?.download_total_count ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md rounded-3xl border bg-background/85 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Penyimpanan Dokumen
                    </p>
                    <p className="mt-1 text-3xl font-semibold">
                      {formatSubscriptionStorage(stats?.document_storage_used ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                    <HardDrive className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <Progress value={storageProgress} className="h-2.5" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Limit</span>
                    <span className="font-medium">
                      {formatSubscriptionStorage(stats?.document_storage_limit)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sisa</span>
                    <span className="font-medium">
                      {formatSubscriptionStorage(stats?.document_storage_remaining)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to={paths.subscriptions.list.getHref()}>
                      <Target className="h-4 w-4" />
                      Kelola Langganan
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to={paths.documents.list.getHref()}>
                      <Files className="h-4 w-4" />
                      Buka Dokumen
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {focusCards.map((card) => (
              <Card key={card.label} className="rounded-3xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="mt-3 text-3xl font-semibold">
                      {formatNumber(card.value)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl p-3 ${card.iconContainerClassName}`}
                  >
                    <card.icon className={`h-5 w-5 ${card.iconClassName}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pipelineCards.map((item) => (
            <Card key={item.label} className="rounded-3xl p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`mt-2 text-3xl font-semibold ${item.colorClassName}`}>
                    {formatNumber(item.value)}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 ${item.bgClassName}`}>
                  <item.icon className={`h-5 w-5 ${item.colorClassName}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="rounded-3xl p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Aset Anda</h2>
              <p className="text-sm text-muted-foreground">
                Ringkasan konten yang sudah tersimpan di akun Anda.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to={paths.jobs.savedJobs.getHref()}>
                <Star className="h-4 w-4" />
                Lowongan Tersimpan
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {assetCards.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border bg-muted/20 p-5 transition-colors hover:bg-muted/35"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className={`mt-2 text-3xl font-semibold ${item.colorClassName}`}>
                      {formatNumber(item.value)}
                    </p>
                  </div>
                  <div className={`rounded-2xl p-3 ${item.bgClassName}`}>
                    <item.icon className={`h-5 w-5 ${item.colorClassName}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
