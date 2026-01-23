import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toast } from "sonner";
import {
  useCreateJob,
  type CreateJobInput,
} from "@/features/admin/jobs/api/create-job";
import { JobForm } from "@/features/admin/jobs/components/JobForm";
import { paths } from "@/config/paths";

export default function AdminJobCreate() {
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  const handleSubmit = (data: CreateJobInput) => {
    createJobMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success("Lowongan berhasil dibuat");
        navigate(paths.admin.jobs.detail.getHref(response.id));
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
          error={createJobMutation.error}
        />
      </div>
    </DashboardLayout>
  );
}
