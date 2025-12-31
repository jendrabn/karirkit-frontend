import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationLetterList } from "@/features/application-letters/components/ApplicationLetterList";
import { MinimalSEO } from "@/components/MinimalSEO";

export default function ApplicationLetters() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Surat Lamaran" },
      ]}
    >
      <MinimalSEO
        title="Surat Lamaran"
        description="Kelola surat lamaran kerja Anda."
        noIndex={true}
      />
      <PageHeader
        title="Surat Lamaran"
        subtitle="Kelola surat lamaran kerja Anda."
      />
      <ApplicationLetterList />
    </DashboardLayout>
  );
}
