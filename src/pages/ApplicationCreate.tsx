import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import { useCreateApplication } from "@/features/applications/api/create-application";
import { toast } from "sonner";
import { type CreateApplicationInput } from "@/features/applications/api/create-application";
import { MinimalSEO } from "@/components/MinimalSEO";
import { seoConfig } from "@/config/seo";

export default function ApplicationCreate() {
  const navigate = useNavigate();
  const createApplicationMutation = useCreateApplication({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Lamaran berhasil ditambahkan");
        navigate("/applications");
      },
    },
  });

  const handleSubmit = (data: CreateApplicationInput) => {
    createApplicationMutation.mutate({ data });
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lamaran Kerja", href: "/applications" },
        { label: "Tambah Lamaran" },
      ]}
    >
      <MinimalSEO
        title={seoConfig.applicationCreate.title}
        description={seoConfig.applicationCreate.description}
        noIndex={true}
      />
      <PageHeader
        title="Tambah Lamaran"
        subtitle="Tambahkan lamaran kerja baru ke dalam daftar Anda."
        showBackButton
        backButtonUrl="/applications"
      />
      <ApplicationForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/applications")}
        isLoading={createApplicationMutation.isPending}
      />
    </DashboardLayout>
  );
}
