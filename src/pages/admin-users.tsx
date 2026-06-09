import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { UsersList } from "@/features/admin/users/components/users-list";
import { MinimalSEO } from "@/components/minimal-seo";

const AdminUsers = () => {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pengguna" },
      ]}
    >
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
