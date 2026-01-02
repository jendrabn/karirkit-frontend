import { useNavigate, useParams } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import { useApplication } from "@/features/applications/api/get-application";
import { useUpdateApplication } from "@/features/applications/api/update-application";
import { toast } from "sonner";
import { type UpdateApplicationInput } from "@/features/applications/api/update-application";
import { Loader2 } from "lucide-react";
import { MinimalSEO } from "@/components/MinimalSEO";

export default function ApplicationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: application, isLoading: isApplicationLoading } = useApplication(
    {
      id: id!,
    }
  );

  const updateApplicationMutation = useUpdateApplication({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Lamaran berhasil diperbarui");
        navigate(paths.applications.detail.getHref(id!));
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
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Lamaran Kerja", href: "/applications" },
          { label: "Edit Lamaran" },
        ]}
      >
        <MinimalSEO
          title="Loading..."
          description="Memuat data lamaran..."
          noIndex={true}
        />
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Lamaran Kerja", href: "/applications" },
          { label: "Lamaran Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="Lamaran Tidak Ditemukan"
          description="Data lamaran tidak ditemukan."
          noIndex={true}
        />
        <PageHeader
          title="Edit Lamaran"
          showBackButton
          backButtonUrl="/applications"
        />
        <div className="text-center py-10">Lamaran tidak ditemukan</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lamaran Kerja", href: "/applications" },
        { label: "Edit Lamaran" },
      ]}
    >
      <MinimalSEO
        title={`Edit: ${application.company_name} - ${application.position}`}
        description={`Edit lamaran untuk posisi ${application.position} di ${application.company_name}`}
        noIndex={true}
      />
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
