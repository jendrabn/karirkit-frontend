import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { TemplatesList } from "@/features/admin/templates/components/templates-list";
import { MinimalSEO } from "@/components/minimal-seo";

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
