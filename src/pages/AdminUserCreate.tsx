import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UserForm } from "@/features/admin/users/components/UserForm";
import {
  useCreateUser,
  type CreateUserInput,
} from "@/features/admin/users/api/create-user";
import { toast } from "sonner";
import type { UpdateUserInput } from "@/features/admin/users/api/update-user";
import { MinimalSEO } from "@/components/MinimalSEO";
import { paths } from "@/config/paths";

const AdminUserCreate = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("User berhasil ditambahkan");
        navigate(paths.admin.users.detail.getHref(data.id));
      },
    },
  });

  const handleSubmit = (data: CreateUserInput | UpdateUserInput) => {
    if ("password" in data) {
      createUserMutation.mutate(data);
    }
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pengguna", href: paths.admin.users.list.getHref() },
        { label: "Tambah Pengguna" },
      ]}
    >
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
        error={createUserMutation.error}
      />
    </DashboardLayout>
  );
};

export default AdminUserCreate;
