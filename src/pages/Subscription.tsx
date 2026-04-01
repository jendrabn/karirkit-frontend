import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";
import { paths } from "@/config/paths";
import { SubscriptionManager } from "@/features/subscriptions/components/SubscriptionManager";

export default function Subscription() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: paths.dashboard.getHref() },
        { label: "Langganan", href: paths.subscriptions.list.getHref() },
      ]}
    >
      <MinimalSEO
        title="Langganan"
        description="Kelola paket langganan, lihat fitur akun, dan upgrade sesuai kebutuhan."
        noIndex={true}
      />
      <PageHeader
        title="Langganan"
        subtitle="Kelola paket langganan, lihat fitur akun, dan upgrade sesuai kebutuhan."
      />
      <SubscriptionManager />
    </DashboardLayout>
  );
}
