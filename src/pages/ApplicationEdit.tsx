import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import { useApplication } from "@/features/applications/api/get-application";
import { useUpdateApplication } from "@/features/applications/api/update-application";
import { toast } from "sonner";
import { type UpdateApplicationInput } from "@/features/applications/api/update-application";
import { Loader2 } from "lucide-react";

export default function ApplicationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: application, isLoading: isApplicationLoading } = useApplication({
    id: id!,
  });

  const updateApplicationMutation = useUpdateApplication({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Lamaran berhasil diperbarui");
        navigate("/applications");
      },
    },
  });

  const handleSubmit = (data: UpdateApplicationInput) => {
    if (id) {
       updateApplicationMutation.mutate({ id, data });
    }
  };

  if (isApplicationLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
     return (
      <DashboardLayout>
        <PageHeader
            title="Edit Lamaran"
            showBackButton
            backButtonUrl="/applications"
        />
        <div className="text-center py-10">Lamaran tidak ditemukan</div>
      </DashboardLayout>
     )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Edit Lamaran"
        subtitle={`Edit informasi lamaran untuk ${application.company_name} - ${application.position}`}
        showBackButton
        backButtonUrl="/applications"
      />
      <ApplicationForm
          initialData={application}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/applications")}
          isLoading={updateApplicationMutation.isPending}
        />
    </DashboardLayout>
  );
}
