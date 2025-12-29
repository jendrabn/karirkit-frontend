import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useJob } from "@/features/admin/jobs/api/get-job";
import { useUpdateJob } from "@/features/admin/jobs/api/update-job";
import { JobForm } from "@/features/admin/jobs/components/JobForm";

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
          navigate("/admin/jobs");
        },
      }
    );
  };

  if (isLoadingJob) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data lowongan...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Lowongan tidak ditemukan
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/jobs")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>
      <PageHeader
        title="Edit Lowongan"
        subtitle={`Memperbarui: ${job.title}`}
      />
      <div className="pb-10">
        <JobForm
          initialData={job}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/jobs")}
          isLoading={updateJobMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
