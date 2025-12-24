import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";

import ProfileForm from "@/features/account/components/ProfileForm";

import NotificationSetting from "@/features/account/components/NotificationSetting";

export default function Profile() {
  return (
    <DashboardLayout>
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
