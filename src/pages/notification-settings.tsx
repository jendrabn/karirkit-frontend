import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import NotificationSetting from "@/features/account/components/notification-setting";
import { MinimalSEO } from "@/components/minimal-seo";
import { seoConfig } from "@/config/seo";

export default function NotificationSettings() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pengaturan Notifikasi" },
      ]}
    >
      <MinimalSEO
        title={`Pengaturan Notifikasi | ${seoConfig.appName}`}
        description="Kelola preferensi notifikasi WhatsApp dan Telegram Anda."
        noIndex={true}
      />
      <PageHeader
        title="Pengaturan Notifikasi"
        subtitle="Atur notifikasi untuk deadline lamaran, jadwal tes, interview, dan update status melalui WhatsApp atau Telegram."
      />

      <div className="max-w-3xl">
        <NotificationSetting />
      </div>
    </DashboardLayout>
  );
}
