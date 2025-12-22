import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UsersList } from "@/features/admin/users/components/UsersList";

const AdminUsers = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Manajemen Users"
        subtitle="Kelola semua pengguna aplikasi."
      />

      <UsersList />
    </DashboardLayout>
  );
};

export default AdminUsers;
