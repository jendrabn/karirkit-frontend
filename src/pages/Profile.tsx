import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";

import ProfileForm from "@/features/account/components/ProfileForm";

import NotificationSetting from "@/features/account/components/NotificationSetting";
import { MinimalSEO } from "@/components/MinimalSEO";
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

      <div className="grid gap-6 max-w-3xl lg:max-w-full lg:grid-cols-2">
        <ProfileForm />
        <NotificationSetting />
      </div>
    </DashboardLayout>
  );
}
