import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { paths } from "@/config/paths";
import { DocumentsList } from "@/features/documents/components/DocumentsList";
import { useMySubscription } from "@/features/subscriptions/api/get-my-subscription";
import { getPlanFeatureAccess } from "@/features/subscriptions/utils";
import { SubscriptionUpgradeCard } from "@/features/subscriptions/components/SubscriptionUpgradeCard";
import { Loader2 } from "lucide-react";

export default function Documents() {
  const { data: subscription, isLoading } = useMySubscription();
  const subscriptionFeatures = getPlanFeatureAccess(subscription?.current_features);

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: paths.dashboard.getHref() },
        { label: "Dokumen", href: paths.documents.list.getHref() },
      ]}
    >
      <PageHeader
        title="Dokumen"
        subtitle="Kelola dan simpan dokumen penting Anda dengan aman."
      />

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : subscriptionFeatures.canManageDocuments ? (
        <DocumentsList />
      ) : (
        <SubscriptionUpgradeCard
          title="Fitur dokumen belum tersedia di plan Anda"
          description="Akses dokumen sekarang ditentukan oleh plan aktif. Upgrade ke Pro atau Max untuk upload, download, dan mengelola dokumen."
        />
      )}
    </DashboardLayout>
  );
}
