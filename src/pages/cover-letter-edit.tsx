import { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  CoverLetterForm,
  type CoverLetterFormHandle,
} from "@/features/cover-letters/components/cover-letter-form";
import { type CreateCoverLetterInput } from "@/features/cover-letters/api/create-cover-letter";
import { useCoverLetter } from "@/features/cover-letters/api/get-cover-letter";
import { useUpdateCoverLetter } from "@/features/cover-letters/api/update-cover-letter";
import {
  toCoverLetterAiImprovementData,
  useImproveCoverLetterWithAI,
} from "@/features/cover-letters/api/improve-cover-letter-with-ai";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { Loader2, Sparkles } from "lucide-react";
import { MinimalSEO } from "@/components/minimal-seo";

export default function CoverLetterEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const form = useForm<CreateCoverLetterInput>();
  const letterFormRef = useRef<CoverLetterFormHandle>(null);
  const aiImprovedData = (
    location.state as {
      aiImprovedData?: Partial<CreateCoverLetterInput>;
    } | null
  )?.aiImprovedData;

  const { data: letterResponse, isLoading: isLetterLoading } =
    useCoverLetter({
      id: id!,
    });

  const updateMutation = useUpdateCoverLetter({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Surat lamaran berhasil diperbarui");
        navigate(paths.coverLetters.detail.getHref(id!));
      },
    },
  });
  const improveLetterMutation = useImproveCoverLetterWithAI();

  useServerValidation(updateMutation.error, form);

  const handleSubmit = (data: CreateCoverLetterInput) => {
    if (id) {
      updateMutation.mutate({ id, data });
    }
  };

  const handleAiImprove = async (data: CreateCoverLetterInput) => {
    const improvedData = await improveLetterMutation.mutateAsync({
      data: toCoverLetterAiImprovementData(data),
    });
    toast.success("Surat lamaran berhasil diperbaiki dengan AI");
    return improvedData;
  };

  if (isLetterLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Surat Lamaran", href: "/cover-letters" },
          { label: "Edit Surat Lamaran" },
        ]}
      >
        <MinimalSEO
          title="Loading..."
          description="Memuat data surat lamaran..."
          noIndex={true}
        />
        <PageHeader
          title="Edit Surat Lamaran"
          showBackButton
          backButtonUrl="/cover-letters"
        />
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const letter = letterResponse;
  const letterInitialData = letter
    ? {
        ...letter,
        ...aiImprovedData,
        template_id: letter.template_id,
        signature: letter.signature,
      }
    : undefined;

  if (!letter) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Surat Lamaran", href: "/cover-letters" },
          { label: "Surat Lamaran Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="Surat Lamaran Tidak Ditemukan"
          description="Surat lamaran tidak ditemukan."
          noIndex={true}
        />
        <PageHeader
          title="Surat Lamaran Tidak Ditemukan"
          showBackButton
          backButtonUrl="/cover-letters"
        />
        <p className="text-muted-foreground">
          Data surat lamaran dengan ID tersebut tidak ditemukan.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Surat Lamaran", href: "/cover-letters" },
        { label: "Edit Surat Lamaran" },
      ]}
    >
      <MinimalSEO
        title={`Edit: ${letter.company_name}`}
        description={`Edit surat lamaran untuk ${letter.company_name}`}
        noIndex={true}
      />
      <PageHeader
        title="Edit Surat Lamaran"
        subtitle={`Edit surat lamaran untuk ${letter.company_name}`}
        showBackButton
        backButtonUrl="/cover-letters"
      >
        <Button
          type="button"
          variant="outline"
          disabled={updateMutation.isPending || improveLetterMutation.isPending}
          onClick={() => letterFormRef.current?.improveWithAi()}
        >
          <Sparkles data-icon="inline-start" />
          Perbaiki Surat Lamaran
        </Button>
      </PageHeader>

      <CoverLetterForm
        ref={letterFormRef}
        initialData={letterInitialData as CreateCoverLetterInput}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cover-letters")}
        isLoading={updateMutation.isPending}
        error={updateMutation.error}
        onAiImprove={handleAiImprove}
        initialAiImprovementSuccess={Boolean(aiImprovedData)}
      />
      <LoadingOverlay
        show={improveLetterMutation.isPending}
        message="Sedang memperbaiki surat lamaran dengan AI..."
      />
    </DashboardLayout>
  );
}
