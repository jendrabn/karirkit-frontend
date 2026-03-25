import { MinimalSEO } from "@/components/MinimalSEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { SystemSettingsForm } from "@/features/admin/system-settings/components/SystemSettingsForm";

const AdminSystemSettings = () => {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "System Settings" },
      ]}
    >
      <MinimalSEO
        title="System Settings"
        description="Kelola pengaturan sistem untuk admin."
        noIndex={true}
      />
      <PageHeader
        title="System Settings"
        subtitle="Kelola konfigurasi global aplikasi dan simpan perubahan saat sudah siap."
      />

      <div className="max-w-6xl">
        <SystemSettingsForm />
      </div>
    </DashboardLayout>
  );
};

export default AdminSystemSettings;
