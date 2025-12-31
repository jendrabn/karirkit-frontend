import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";
import PortfoliosList from "@/features/portfolios/components/PortfoliosList";

export default function Portfolios() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Portfolio" },
      ]}
    >
      <MinimalSEO
        title="Portfolio"
        description="Kelola dan tampilkan proyek-proyek terbaik Anda."
        noIndex={true}
      />
      <PageHeader
        title="Portfolio"
        subtitle="Kelola dan tampilkan proyek-proyek terbaik Anda."
      />

      <PortfoliosList />
    </DashboardLayout>
  );
}
