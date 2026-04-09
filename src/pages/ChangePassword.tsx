import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import ChangePasswordForm from "@/features/account/components/ChangePasswordForm";
import { MinimalSEO } from "@/components/MinimalSEO";
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
