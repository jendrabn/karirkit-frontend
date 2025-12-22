import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UserForm } from "@/features/admin/users/components/UserForm";
import { useCreateUser } from "@/features/admin/users/api/create-user";
import { toast } from "sonner";
import type { CreateUserInput } from "@/features/admin/users/api/create-user";

const AdminUserCreate = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("User berhasil ditambahkan");
        navigate("/admin/users");
      },
    },
  });

  const handleSubmit = (data: any) => {
    // data is CreateUserInput | UpdateUserInput, but here we know it is Create
    createUserMutation.mutate(data as CreateUserInput);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Tambah User"
        subtitle="Tambahkan pengguna baru ke sistem."
      />

      <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
        <UserForm onSubmit={handleSubmit} isLoading={createUserMutation.isPending} />
      </div>
    </DashboardLayout>
  );
};

export default AdminUserCreate;
