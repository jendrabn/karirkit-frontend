import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";

import ProfileForm from "@/features/account/components/profile-form";
import { MinimalSEO } from "@/components/minimal-seo";
import { seoConfig } from "@/config/seo";

export default function Profile() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profil Saya" },
      ]}
    >
      <MinimalSEO
        title={seoConfig.profile.title}
        description={seoConfig.profile.description}
        noIndex={true}
      />
      <PageHeader
        title="Profil Saya"
        subtitle="Kelola informasi profil dan akun Anda."
      />

      <div className="max-w-3xl">
        <ProfileForm />
      </div>
    </DashboardLayout>
  );
}
