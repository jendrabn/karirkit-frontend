import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { MinimalSEO } from "@/components/minimal-seo";
import PortfoliosList from "@/features/portfolios/components/portfolios-list";

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
