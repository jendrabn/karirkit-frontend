import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { TemplatesList } from "@/features/admin/templates/components/TemplatesList";
import { MinimalSEO } from "@/components/MinimalSEO";

const AdminTemplates = () => {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Template" },
      ]}
    >
      <MinimalSEO
        title="Kelola Template"
        description="Kelola template CV dan Surat Lamaran."
        noIndex={true}
      />
      <PageHeader
        title="Template"
        subtitle="Kelola template CV dan Surat Lamaran."
      />
      <TemplatesList />
    </DashboardLayout>
  );
};

export default AdminTemplates;
