import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UserForm } from "@/components/users/UserForm";
import { toast } from "sonner";

const AdminUserCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Creating user:", data);
    toast.success("User berhasil ditambahkan");
    navigate("/admin/users");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Tambah User"
        subtitle="Tambahkan pengguna baru ke sistem."
      />

      <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
        <UserForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
};

export default AdminUserCreate;
