import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UserForm } from "@/components/users/UserForm";
import { mockUsers } from "@/data/mockUsers";
import { toast } from "sonner";

const AdminUserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">User tidak ditemukan.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (data: any) => {
    console.log("Updating user:", data);
    toast.success("User berhasil diupdate");
    navigate("/admin/users");
  };

  return (
    <DashboardLayout>
      <PageHeader title="Edit User" subtitle={`Edit data untuk ${user.name}`} />

      <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
        <UserForm user={user} onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
};

export default AdminUserEdit;
