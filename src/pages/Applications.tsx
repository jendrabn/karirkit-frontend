import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { ApplicationsList } from "@/features/applications/components/applications-list";
import { MinimalSEO } from "@/components/minimal-seo";
import { seoConfig } from "@/config/seo";

export default function Applications() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lamaran Kerja" },
      ]}
    >
      <MinimalSEO
        title={seoConfig.applications.title}
        description={seoConfig.applications.description}
        noIndex={true}
      />
      <PageHeader
        title="Lamaran Kerja"
        subtitle="Kelola dan pantau semua lamaran kerja Anda."
      />
      <ApplicationsList />
    </DashboardLayout>
  );
}
