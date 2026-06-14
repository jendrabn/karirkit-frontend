import { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { CVForm, type CVFormHandle } from "@/features/cvs/components/cv-form";
import { type CreateCVInput, type CVFormData } from "@/features/cvs/api/create-cv";
import { useCV } from "@/features/cvs/api/get-cv";
import { useUpdateCV, type UpdateCVInput } from "@/features/cvs/api/update-cv";
import {
  toCvAiImprovementData,
  useImproveCVWithAI,
} from "@/features/cvs/api/improve-cv-with-ai";
import type { CV } from "@/types/cv";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/minimal-seo";

export default function CVEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const form = useForm<CVFormData>();
  const cvFormRef = useRef<CVFormHandle>(null);
  const aiImprovedData = (
    location.state as { aiImprovedData?: Partial<CVFormData> } | null
  )?.aiImprovedData;

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
  const improveCvMutation = useImproveCVWithAI();

  useServerValidation(updateMutation.error, form);

  const handleSubmit = (data: CVFormData) => {
    if (id) {
      updateMutation.mutate({ id, data: data as UpdateCVInput });
    }
  };

  const handleAiImprove = async (data: CVFormData) => {
    const improvedData = await improveCvMutation.mutateAsync({
      data: toCvAiImprovementData(data as CreateCVInput),
    });
    toast.success("CV berhasil diperbaiki dengan AI");
    return improvedData;
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

  const cv = cvResponse as CV | undefined;
  const cvInitialData = cv
    ? ({
        ...cv,
        ...aiImprovedData,
        template_id: cv.template_id,
        photo: cv.photo,
        slug: cv.slug,
        visibility: cv.visibility,
      } as CV)
    : undefined;

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
      >
        <Button
          type="button"
          variant="outline"
          disabled={updateMutation.isPending || improveCvMutation.isPending}
          onClick={() => cvFormRef.current?.improveWithAi()}
        >
          <Sparkles data-icon="inline-start" />
          Perbaiki CV
        </Button>
      </PageHeader>
      <CVForm
        ref={cvFormRef}
        initialData={cvInitialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cvs")}
        isLoading={updateMutation.isPending}
        error={updateMutation.error}
        onAiImprove={handleAiImprove}
        initialAiImprovementSuccess={Boolean(aiImprovedData)}
      />
      <LoadingOverlay
        show={improveCvMutation.isPending}
        message="Sedang memperbaiki CV dengan AI..."
      />
    </DashboardLayout>
  );
}
