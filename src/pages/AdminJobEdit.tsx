import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toast } from "sonner";
import { useJob } from "@/features/admin/jobs/api/get-job";
import { useUpdateJob } from "@/features/admin/jobs/api/update-job";
import { JobForm } from "@/features/admin/jobs/components/JobForm";
import { paths } from "@/config/paths";

export default function AdminJobEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: job, isLoading: isLoadingJob } = useJob({ id: id || "" });
  const updateJobMutation = useUpdateJob();

  const handleSubmit = (data: any) => {
    if (!id) return;
    updateJobMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Lowongan berhasil diperbarui");
          navigate(paths.admin.jobs.detail.getHref(id));
        },
      }
    );
  };

  if (isLoadingJob) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
          { label: "Edit Lowongan" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data lowongan...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
          { label: "Lowongan Tidak Ditemukan" },
        ]}
      >
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Lowongan tidak ditemukan
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
        { label: "Edit Lowongan" },
      ]}
    >
      <PageHeader
        title="Edit Lowongan"
        subtitle={`Memperbarui: ${job.title}`}
        showBackButton
        backButtonUrl="/admin/jobs"
      />
      <div className="pb-10">
        <JobForm
          initialData={job}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/jobs")}
          isLoading={updateJobMutation.isPending}
          error={updateJobMutation.error}
        />
      </div>
    </DashboardLayout>
  );
}
