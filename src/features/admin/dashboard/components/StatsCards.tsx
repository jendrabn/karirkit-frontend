import {
  BadgeDollarSign,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  FileStack,
  FileText,
  Layers,
  Newspaper,
  ShieldCheck,
  Tags,
  Users,
  Workflow,
} from "lucide-react";
import type { ComponentType } from "react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminDashboardStatistics } from "@/types/dashboard";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { RecentBlogsTable } from "./RecentBlogsTable";
import { RecentUsersTable } from "./RecentUsersTable";

interface StatsCardsProps {
  stats: AdminDashboardStatistics;
}

function getDistributionEntries(distribution?: Record<string, number>) {
  if (!distribution) {
    return [];
  }

  return Object.entries(distribution).sort(([, a], [, b]) => b - a);
}

function getDistributionTotal(distribution?: Record<string, number>) {
  return getDistributionEntries(distribution).reduce(
    (total, [, value]) => total + value,
    0,
  );
}

function formatDistributionLabel(label: string) {
  return label
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function SummaryCard({
  title,
  description,
  icon: Icon,
  iconClassName,
  iconContainerClassName,
  rows,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
  iconContainerClassName: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <Card className="rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <h2 className="mt-2 text-xl font-semibold">{title}</h2>
        </div>
        <div className={`rounded-2xl p-3 ${iconContainerClassName}`}>
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/15 px-4 py-3"
          >
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="text-base font-semibold">{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DistributionCard({
  title,
  description,
  distribution,
}: {
  title: string;
  description: string;
  distribution?: Record<string, number>;
}) {
  const entries = getDistributionEntries(distribution);
  const total = getDistributionTotal(distribution);

  return (
    <Card className="rounded-3xl p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            Belum ada data distribusi.
          </div>
        ) : (
          entries.map(([label, value]) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;

            return (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">
                    {formatDistributionLabel(label)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(value)} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2.5" />
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <SummaryCard
          title="Akun"
          description="Ringkasan jumlah akun di platform"
          icon={Users}
          iconClassName="text-indigo-600"
          iconContainerClassName="bg-indigo-100"
          rows={[
            { label: "Total akun", value: formatNumber(stats.total_accounts) },
            { label: "User", value: formatNumber(stats.total_users) },
            { label: "Admin", value: formatNumber(stats.total_admins) },
          ]}
        />

        <SummaryCard
          title="Konten"
          description="Blog, kategori, tag, dan template"
          icon={Newspaper}
          iconClassName="text-fuchsia-600"
          iconContainerClassName="bg-fuchsia-100"
          rows={[
            { label: "Total blog", value: formatNumber(stats.total_blogs) },
            {
              label: "Published / Draft / Arsip",
              value: `${formatNumber(stats.total_published_blogs)} / ${formatNumber(
                stats.total_draft_blogs,
              )} / ${formatNumber(stats.total_archived_blogs)}`,
            },
            {
              label: "Template",
              value: `${formatNumber(stats.total_templates)} total`,
            },
            {
              label: "CV / Surat",
              value: `${formatNumber(stats.total_cv_templates)} / ${formatNumber(
                stats.total_application_letter_templates,
              )}`,
            },
            {
              label: "Kategori / Tag",
              value: `${formatNumber(stats.total_categories)} / ${formatNumber(
                stats.total_tags,
              )}`,
            },
          ]}
        />

        <SummaryCard
          title="Job Portal"
          description="Pantau supply lowongan dan data pendukung"
          icon={BriefcaseBusiness}
          iconClassName="text-sky-600"
          iconContainerClassName="bg-sky-100"
          rows={[
            { label: "Total job", value: formatNumber(stats.total_jobs) },
            {
              label: "Published / Draft",
              value: `${formatNumber(stats.total_published_jobs)} / ${formatNumber(
                stats.total_draft_jobs,
              )}`,
            },
            {
              label: "Closed / Arsip",
              value: `${formatNumber(stats.total_closed_jobs)} / ${formatNumber(
                stats.total_archived_jobs,
              )}`,
            },
            {
              label: "Perusahaan",
              value: formatNumber(stats.total_companies),
            },
            {
              label: "Role Pekerjaan",
              value: formatNumber(stats.total_job_roles),
            },
          ]}
        />

        <SummaryCard
          title="Subscription"
          description="Monetization dan status pembayaran"
          icon={CreditCard}
          iconClassName="text-emerald-600"
          iconContainerClassName="bg-emerald-100"
          rows={[
            {
              label: "Total subscription",
              value: formatNumber(stats.total_subscriptions),
            },
            {
              label: "Pending / Paid",
              value: `${formatNumber(stats.total_pending_subscriptions)} / ${formatNumber(
                stats.total_paid_subscriptions,
              )}`,
            },
            {
              label: "Failed / Cancelled / Expired",
              value: `${formatNumber(stats.total_failed_subscriptions)} / ${formatNumber(
                stats.total_cancelled_subscriptions,
              )} / ${formatNumber(stats.total_expired_subscriptions)}`,
            },
            {
              label: "Revenue",
              value: formatCurrency(stats.total_subscription_revenue),
            },
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DistributionCard
          title="Distribusi Status User"
          description="Komposisi user berdasarkan status akun."
          distribution={stats.user_status_distribution}
        />
        <DistributionCard
          title="Distribusi Status Job"
          description="Sebaran status lowongan di job portal."
          distribution={stats.job_status_distribution}
        />
        <DistributionCard
          title="Distribusi Status Subscription"
          description="Pantau sebaran lifecycle pembayaran langganan."
          distribution={stats.subscription_status_distribution}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3">
              <BadgeDollarSign className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue Subscription</p>
              <h3 className="text-3xl font-semibold">
                {formatCurrency(stats.total_subscription_revenue)}
              </h3>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <BadgePill label="Pending" value={stats.total_pending_subscriptions} />
            <BadgePill label="Paid" value={stats.total_paid_subscriptions} />
            <BadgePill label="Failed" value={stats.total_failed_subscriptions} />
            <BadgePill
              label="Cancelled"
              value={stats.total_cancelled_subscriptions}
            />
            <BadgePill label="Expired" value={stats.total_expired_subscriptions} />
          </div>
        </Card>

        <Card className="rounded-3xl p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MiniMetric
              icon={BookOpen}
              label="Blog Aktif"
              value={stats.total_published_blogs}
              className="bg-pink-100 text-pink-700"
            />
            <MiniMetric
              icon={FileStack}
              label="Total Template"
              value={stats.total_templates}
              className="bg-cyan-100 text-cyan-700"
            />
            <MiniMetric
              icon={Building2}
              label="Perusahaan"
              value={stats.total_companies}
              className="bg-blue-100 text-blue-700"
            />
            <MiniMetric
              icon={Workflow}
              label="Role Pekerjaan"
              value={stats.total_job_roles}
              className="bg-violet-100 text-violet-700"
            />
            <MiniMetric
              icon={Layers}
              label="Kategori"
              value={stats.total_categories}
              className="bg-teal-100 text-teal-700"
            />
            <MiniMetric
              icon={Tags}
              label="Tag"
              value={stats.total_tags}
              className="bg-rose-100 text-rose-700"
            />
            <MiniMetric
              icon={FileText}
              label="Template CV"
              value={stats.total_cv_templates}
              className="bg-indigo-100 text-indigo-700"
            />
            <MiniMetric
              icon={ShieldCheck}
              label="Admin"
              value={stats.total_admins}
              className="bg-emerald-100 text-emerald-700"
            />
          </div>
        </Card>
      </div>

      {stats.recent_users?.length || stats.recent_blogs?.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <RecentUsersTable users={stats.recent_users ?? []} />
          <RecentBlogsTable blogs={stats.recent_blogs ?? []} />
        </div>
      ) : null}
    </div>
  );
};

function BadgePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-full border bg-muted/20 px-3 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>{" "}
      <span className="font-semibold">{formatNumber(value)}</span>
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="rounded-2xl border bg-muted/15 p-4">
      <div className={`inline-flex rounded-2xl p-3 ${className}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{formatNumber(value)}</p>
    </div>
  );
}
