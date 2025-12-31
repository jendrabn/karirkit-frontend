import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toast } from "sonner";
import { useCreateJob } from "@/features/admin/jobs/api/create-job";
import { JobForm } from "@/features/admin/jobs/components/JobForm";
import { paths } from "@/config/paths";

export default function AdminJobCreate() {
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  const handleSubmit = (data: any) => {
    createJobMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Lowongan berhasil dibuat");
        navigate("/admin/jobs");
      },
    });
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
        { label: "Tambah Lowongan" },
      ]}
    >
      <PageHeader
        title="Tambah Lowongan Baru"
        subtitle="Buat lowongan pekerjaan baru."
        showBackButton
        backButtonUrl="/admin/jobs"
      />
      <div className="pb-10">
        <JobForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/jobs")}
          isLoading={createJobMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
