import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { TemplateForm } from "@/features/admin/templates/components/TemplateForm";
import {
  useCreateTemplate,
  type CreateTemplateInput,
} from "@/features/admin/templates/api/create-template";
import { toast } from "sonner";
import { MinimalSEO } from "@/components/MinimalSEO";

const AdminTemplateCreate = () => {
  const navigate = useNavigate();

  const createTemplateMutation = useCreateTemplate({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Template berhasil dibuat");
        navigate("/admin/templates");
      },
      onError: (error) => {
        // Error handling is done via toast in api-client usually, but we can add more here if needed
        console.error(error);
      },
    },
  });

  const handleSubmit = (data: CreateTemplateInput) => {
    createTemplateMutation.mutate({ data });
  };

  return (
    <DashboardLayout>
      <MinimalSEO
        title="Buat Template"
        description="Buat template baru."
        noIndex={true}
      />
      <PageHeader
        title="Buat Template"
        subtitle="Buat template CV atau Surat Lamaran baru."
      />
      <TemplateForm
        onSubmit={handleSubmit}
        isLoading={createTemplateMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default AdminTemplateCreate;
