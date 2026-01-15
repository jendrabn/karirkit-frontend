import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { TemplateForm } from "@/features/admin/templates/components/TemplateForm";
import { useTemplate } from "@/features/admin/templates/api/get-template";
import {
  useUpdateTemplate,
  type UpdateTemplateInput,
} from "@/features/admin/templates/api/update-template";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { MinimalSEO } from "@/components/MinimalSEO";
import { paths } from "@/config/paths";

const AdminTemplateEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: template, isLoading: isTemplateLoading } = useTemplate({
    id: id as string,
    queryConfig: {
      enabled: !!id,
    },
  });

  const updateTemplateMutation = useUpdateTemplate({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Template berhasil diperbarui");
        navigate(paths.admin.templates.detail.getHref(id!));
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  if (isTemplateLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Template", href: paths.admin.templates.list.getHref() },
          { label: "Edit Template" },
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!template) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Template", href: paths.admin.templates.list.getHref() },
          { label: "Template Tidak Ditemukan" },
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Template tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  const initialData: UpdateTemplateInput = {
    name: template.name,
    type: template.type,
    language: template.language,
    is_premium: template.is_premium,
    path: template.path,
    preview: template.preview,
  };

  const handleSubmit = (data: UpdateTemplateInput) => {
    if (id) {
      updateTemplateMutation.mutate({ data, id });
    }
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Template", href: paths.admin.templates.list.getHref() },
        { label: "Edit Template" },
      ]}
    >
      <MinimalSEO
        title={`Edit Template: ${template.name}`}
        description={`Edit template ${template.name}`}
        noIndex={true}
      />
      <PageHeader
        title="Edit Template"
        subtitle={`Edit template: ${template.name}`}
      />
      <TemplateForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateTemplateMutation.isPending}
        error={updateTemplateMutation.error}
      />
    </DashboardLayout>
  );
};

export default AdminTemplateEdit;
