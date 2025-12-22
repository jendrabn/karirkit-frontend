import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UserForm } from "@/features/admin/users/components/UserForm";
import { useUser } from "@/features/admin/users/api/get-user";
import { useUpdateUser } from "@/features/admin/users/api/update-user";
import { toast } from "sonner";
import type { UpdateUserInput } from "@/features/admin/users/api/update-user";
import { Spinner } from "@/components/ui/spinner";

const AdminUserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading } = useUser({
    id: id!,
    queryConfig: {
      enabled: !!id,
    },
  });

  const updateUserMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("User berhasil diupdate");
        navigate("/admin/users");
      },
    },
  });

  const handleSubmit = (data: any) => {
    if (id) {
       updateUserMutation.mutate({ id, data: data as UpdateUserInput });
    }
  };

  if (isUserLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
        <DashboardLayout>
            <div className="flex h-screen items-center justify-center">
                User not found
            </div>
        </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Edit User"
        subtitle="Edit data pengguna."
      />

      <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
        <UserForm 
            initialData={user} 
            onSubmit={handleSubmit} 
            isLoading={updateUserMutation.isPending} 
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminUserEdit;
