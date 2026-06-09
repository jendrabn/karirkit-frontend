import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import ChangePasswordForm from "@/features/account/components/change-password-form";
import { MinimalSEO } from "@/components/minimal-seo";
import { seoConfig } from "@/config/seo";

export default function ChangePassword() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Ubah Password" },
      ]}
    >
      <MinimalSEO
        title={seoConfig.changePassword.title}
        description={seoConfig.changePassword.description}
        noIndex={true}
      />
      <PageHeader
        title="Ubah Password"
        subtitle="Perbarui password akun Anda untuk keamanan yang lebih baik."
      />

      <div className="max-w-3xl">
        <ChangePasswordForm />
      </div>
    </DashboardLayout>
  );
}
