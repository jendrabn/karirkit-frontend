import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";
import CVList from "@/features/cvs/components/CVList";

export default function CVs() {
  return (
    <DashboardLayout>
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
