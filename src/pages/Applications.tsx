import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationsList } from "@/features/applications/components/ApplicationsList";

export default function Applications() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Lamaran Kerja"
        subtitle="Kelola dan pantau semua lamaran kerja Anda."
      />
      <ApplicationsList />
    </DashboardLayout>
  );
}
