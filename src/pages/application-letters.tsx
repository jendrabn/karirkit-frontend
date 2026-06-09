import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { ApplicationLetterList } from "@/features/application-letters/components/application-letter-list";
import { MinimalSEO } from "@/components/minimal-seo";

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
