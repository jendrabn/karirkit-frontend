import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { DocumentsList } from "@/features/documents/components/DocumentsList";

export default function Documents() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Dokumen"
        subtitle="Kelola dan simpan dokumen penting Anda dengan aman."
      />

      <DocumentsList />
    </DashboardLayout>
  );
}
