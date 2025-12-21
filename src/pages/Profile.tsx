import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/features/account/components/ProfileForm";

export default function Profile() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Profil Saya"
        subtitle="Kelola informasi profil dan akun Anda."
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
