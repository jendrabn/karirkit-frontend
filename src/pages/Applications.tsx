import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationsList } from "@/features/applications/components/ApplicationsList";
import { MinimalSEO } from "@/components/MinimalSEO";
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
