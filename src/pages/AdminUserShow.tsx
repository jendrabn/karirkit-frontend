import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { useUser } from "@/features/admin/users/api/get-user";
import { UserDetail } from "@/features/admin/users/components/UserDetail";
import { Spinner } from "@/components/ui/spinner";

const AdminUserShow = () => {
  const navigate = useNavigate();
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
      <PageHeader
        title="Detail User"
        subtitle="Informasi lengkap tentang pengguna."
      />

      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <UserDetail user={user} />
    </DashboardLayout>
  );
};

export default AdminUserShow;
