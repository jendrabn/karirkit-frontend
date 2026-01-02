import { useNavigate, useParams } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { CVForm } from "@/features/cvs/components/CVForm";
import type { CVFormData } from "@/features/cvs/components/CVForm";
import { useCV } from "@/features/cvs/api/get-cv";
import { useUpdateCV } from "@/features/cvs/api/update-cv";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useFormErrors } from "@/hooks/use-form-errors";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/MinimalSEO";

export default function CVEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const form = useForm<CVFormData>();

  useFormErrors(form);

  const { data: cvResponse, isLoading: isCVLoading } = useCV({
    id: id!,
  });

  const updateMutation = useUpdateCV({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV berhasil diperbarui");
        navigate(paths.cvs.detail.getHref(id!));
      },
    },
  });

  const handleSubmit = (data: CVFormData) => {
    if (id) {
      updateMutation.mutate({ id, data });
    }
  };

  if (isCVLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "CV Saya", href: "/cvs" },
          { label: "Edit CV" },
        ]}
      >
        <MinimalSEO
          title="Loading..."
          description="Memuat data CV..."
          noIndex={true}
        />
        <PageHeader
          title="Edit CV"
          subtitle="Perbarui informasi CV Anda."
          showBackButton
          backButtonUrl="/cvs"
        />
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const cv = cvResponse;

  if (!cv) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "CV Saya", href: "/cvs" },
          { label: "CV Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="CV Tidak Ditemukan"
          description="CV tidak ditemukan."
          noIndex={true}
        />
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold mb-2">CV tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">
            CV yang Anda cari tidak tersedia.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "CV Saya", href: "/cvs" },
        { label: "Edit CV" },
      ]}
    >
      <MinimalSEO
        title={`Edit CV: ${cv.name}`}
        description={`Edit CV ${cv.name}`}
        noIndex={true}
      />
      <PageHeader
        title={`Edit CV: ${cv.name}`}
        subtitle="Perbarui informasi CV Anda."
        showBackButton
        backButtonUrl="/cvs"
      />
      <CVForm
        initialData={cv}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cvs")}
        isLoading={updateMutation.isPending}
      />
    </DashboardLayout>
  );
}
