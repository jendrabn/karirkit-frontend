import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { StatsCards } from "@/features/admin/dashboard/components/StatsCards";
import { useDashboardStats } from "@/features/admin/dashboard/api/get-dashboard-stats";
import { Spinner } from "@/components/ui/spinner";
import { MinimalSEO } from "@/components/MinimalSEO";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          Gagal memuat statistik.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MinimalSEO
        title="Dashboard Admin"
        description="Ringkasan statistik dan aktivitas platform."
        noIndex={true}
      />
      <PageHeader
        title="Dashboard Admin"
        subtitle="Ringkasan statistik dan aktivitas platform."
      />

      <div className="space-y-6">
        <StatsCards stats={stats} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
