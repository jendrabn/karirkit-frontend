import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";
import { paths } from "@/config/paths";
import { AdminSubscriptionsList } from "@/features/admin/subscriptions/components/AdminSubscriptionsList";

export default function AdminSubscriptions() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: paths.dashboard.getHref() },
        { label: "Langganan", href: paths.admin.subscriptions.list.getHref() },
      ]}
    >
      <MinimalSEO
        title="Manajemen Langganan"
        description="Kelola transaksi subscription user dan manual subscription."
        noIndex={true}
      />
      <PageHeader
        title="Manajemen Langganan"
        subtitle="Pantau transaksi, buat manual subscription, dan buka detail tiap plan user."
      />
      <AdminSubscriptionsList />
    </DashboardLayout>
  );
}
