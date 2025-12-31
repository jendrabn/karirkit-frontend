import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { useUser } from "@/features/admin/users/api/get-user";
import { UserDetail } from "@/features/admin/users/components/UserDetail";
import { Spinner } from "@/components/ui/spinner";
import { MinimalSEO } from "@/components/MinimalSEO";
import { paths } from "@/config/paths";
import { useDeleteUser } from "@/features/admin/users/api/delete-user";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminUserShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: user, isLoading } = useUser({
    id: id!,
    queryConfig: {
      enabled: !!id,
    },
  });

  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("User berhasil dihapus");
        navigate("/admin/users");
      },
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteUserMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pengguna", href: paths.admin.users.list.getHref() },
          { label: "Detail Pengguna" },
        ]}
      >
        <div className="flex bg-background h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pengguna", href: paths.admin.users.list.getHref() },
          { label: "User Tidak Ditemukan" },
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">User tidak ditemukan.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pengguna", href: paths.admin.users.list.getHref() },
        { label: "Detail Pengguna" },
      ]}
    >
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
      >
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <UserDetail user={user} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. User "{user.name}" akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminUserShow;
