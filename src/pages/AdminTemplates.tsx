import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { TemplatesList } from "@/features/admin/templates/components/TemplatesList";

const AdminTemplates = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Template"
        subtitle="Kelola template CV dan Surat Lamaran."
      />
      <TemplatesList />
    </DashboardLayout>
  );
};

export default AdminTemplates;
