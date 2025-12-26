import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { useUser } from "@/features/admin/users/api/get-user";
import { UserDetail } from "@/features/admin/users/components/UserDetail";
import { Spinner } from "@/components/ui/spinner";
import { MinimalSEO } from "@/components/MinimalSEO";
import { paths } from "@/config/paths";

const AdminUserShow = () => {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading } = useUser({
    id: id!,
    queryConfig: {
      enabled: !!id,
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex bg-background h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">User tidak ditemukan.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MinimalSEO
        title={user.name}
        description={`Informasi pengguna ${user.name}`}
        noIndex={true}
      />
      <PageHeader
        title="Detail User"
        subtitle="Informasi lengkap tentang pengguna."
        backButtonUrl={paths.admin.users.list.getHref()}
        showBackButton
      />

      <UserDetail user={user} />
    </DashboardLayout>
  );
};

export default AdminUserShow;
