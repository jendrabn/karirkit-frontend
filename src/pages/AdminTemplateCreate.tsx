import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { TemplateForm } from "@/components/templates/TemplateForm";
import type { Template } from "@/types/template";
import { toast } from "sonner";

const AdminTemplateCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: Partial<Template>) => {
    // Simulate API call
    console.log("Creating template:", data);
    toast.success("Template berhasil dibuat");
    navigate("/templates");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Buat Template"
        subtitle="Buat template CV atau Surat Lamaran baru."
      />
      <TemplateForm onSubmit={handleSubmit} />
    </DashboardLayout>
  );
};

export default AdminTemplateCreate;
