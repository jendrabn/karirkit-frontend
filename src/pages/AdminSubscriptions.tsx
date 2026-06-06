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
        description="Kelola dan approve transaksi subscription user."
        noIndex={true}
      />
      <PageHeader
        title="Manajemen Langganan"
        subtitle="Pantau transaksi user, filter gateway, dan proses order pending."
      />
      <AdminSubscriptionsList />
    </DashboardLayout>
  );
}
