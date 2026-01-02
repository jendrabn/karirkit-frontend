import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { paths } from "@/config/paths";
import { DocumentsList } from "@/features/documents/components/DocumentsList";

export default function Documents() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: paths.dashboard.getHref() },
        { label: "Dokumen", href: paths.documents.list.getHref() },
      ]}
    >
      <PageHeader
        title="Dokumen"
        subtitle="Kelola dan simpan dokumen penting Anda dengan aman."
      />

      <DocumentsList />
    </DashboardLayout>
  );
}
