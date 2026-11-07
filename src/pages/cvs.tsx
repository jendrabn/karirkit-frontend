import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { MinimalSEO } from "@/components/minimal-seo";
import CVList from "@/features/cvs/components/cv-list";

export default function CVs() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "CV Saya" },
      ]}
    >
      <MinimalSEO
        title="Daftar CV"
        description="Kelola daftar riwayat hidup (CV) Anda."
        noIndex={true}
      />
      <PageHeader
        title="CV"
        subtitle="Kelola daftar riwayat hidup (CV) Anda."
      />

      <CVList />
    </DashboardLayout>
  );
}
