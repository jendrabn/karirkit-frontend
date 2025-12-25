import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UsersList } from "@/features/admin/users/components/UsersList";
import { MinimalSEO } from "@/components/MinimalSEO";

const AdminUsers = () => {
  return (
    <DashboardLayout>
      <MinimalSEO
        title="Manajemen User"
        description="Kelola semua pengguna aplikasi."
        noIndex={true}
      />
      <PageHeader
        title="Manajemen Users"
        subtitle="Kelola semua pengguna aplikasi."
      />

      <UsersList />
    </DashboardLayout>
  );
};

export default AdminUsers;
