import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationLetterList } from "@/features/application-letters/components/ApplicationLetterList";

export default function ApplicationLetters() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Surat Lamaran"
        subtitle="Kelola surat lamaran kerja Anda."
      />
      <ApplicationLetterList />
    </DashboardLayout>
  );
}
