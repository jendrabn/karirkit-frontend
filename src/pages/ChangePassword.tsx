import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChangePasswordForm from "@/features/account/components/ChangePasswordForm";
import { MinimalSEO } from "@/components/MinimalSEO";
import { seoConfig } from "@/config/seo";

export default function ChangePassword() {
  return (
    <DashboardLayout>
      <MinimalSEO
        title={seoConfig.changePassword.title}
        description={seoConfig.changePassword.description}
        noIndex={true}
      />
      <PageHeader
        title="Ubah Password"
        subtitle="Perbarui password akun Anda untuk keamanan yang lebih baik."
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Password Baru</CardTitle>
            <CardDescription>
              Pastikan password baru Anda memiliki minimal 8 karakter dan
              berbeda dari password sebelumnya.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
