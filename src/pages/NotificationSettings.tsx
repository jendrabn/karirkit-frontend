import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import NotificationSetting from "@/features/account/components/NotificationSetting";
import { MinimalSEO } from "@/components/MinimalSEO";
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
        subtitle="Atur notifikasi WhatsApp dan Telegram untuk pengingat lamaran."
      />

      <div className="max-w-3xl">
        <NotificationSetting />
      </div>
    </DashboardLayout>
  );
}
