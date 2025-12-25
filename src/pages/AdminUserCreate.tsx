import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UserForm } from "@/features/admin/users/components/UserForm";
import { useCreateUser } from "@/features/admin/users/api/create-user";
import { toast } from "sonner";
import type { CreateUserInput } from "@/features/admin/users/api/create-user";
import { MinimalSEO } from "@/components/MinimalSEO";

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
      <MinimalSEO
        title="Tambah User | KarirKit"
        description="Tambahkan pengguna baru ke sistem."
        noIndex={true}
      />
      <PageHeader
        title="Tambah User"
        subtitle="Tambahkan pengguna baru ke sistem."
      />

      <UserForm
        onSubmit={handleSubmit}
        isLoading={createUserMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default AdminUserCreate;
