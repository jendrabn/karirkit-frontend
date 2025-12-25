import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";

import ProfileForm from "@/features/account/components/ProfileForm";

import NotificationSetting from "@/features/account/components/NotificationSetting";
import { MinimalSEO } from "@/components/MinimalSEO";
import { seoConfig } from "@/config/seo";

export default function Profile() {
  return (
    <DashboardLayout>
      <MinimalSEO
        title={seoConfig.profile.title}
        description={seoConfig.profile.description}
        noIndex={true}
      />
      <PageHeader
        title="Profil Saya"
        subtitle="Kelola informasi profil dan akun Anda."
      />

      <div className="max-w-3xl space-y-6">
        {/* Profile Card */}
        <ProfileForm />

        {/* Notification Settings Card */}
        <NotificationSetting />
      </div>
    </DashboardLayout>
  );
}
