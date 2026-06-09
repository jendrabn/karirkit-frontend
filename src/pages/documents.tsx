import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { MinimalSEO } from "@/components/minimal-seo";
import { paths } from "@/config/paths";
import { DocumentsList } from "@/features/documents/components/documents-list";

export default function Documents() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: paths.dashboard.getHref() },
        { label: "Dokumen", href: paths.documents.list.getHref() },
      ]}
    >
      <MinimalSEO
        title="Dokumen"
        description="Kelola dan simpan dokumen penting Anda dengan aman di KarirKit."
        noIndex
      />
      <PageHeader
        title="Dokumen"
        subtitle="Kelola dan simpan dokumen penting Anda dengan aman."
      />
      <DocumentsList />
    </DashboardLayout>
  );
}
