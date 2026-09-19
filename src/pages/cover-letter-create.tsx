import { useRef } from "react";
import { useNavigate } from "react-router";
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
import { useCreateCoverLetter } from "@/features/cover-letters/api/create-cover-letter";
import {
  toCoverLetterAiImprovementData,
  useImproveCoverLetterWithAI,
} from "@/features/cover-letters/api/improve-cover-letter-with-ai";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/minimal-seo"; // Import
import { Sparkles } from "lucide-react";

export default function CoverLetterCreate() {
  const navigate = useNavigate();
  const form = useForm<CreateCoverLetterInput>();
  const letterFormRef = useRef<CoverLetterFormHandle>(null);

  const createMutation = useCreateCoverLetter({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("Surat lamaran berhasil dibuat");
        navigate(paths.coverLetters.detail.getHref(data.id));
      },
    },
  });
  const improveLetterMutation = useImproveCoverLetterWithAI();

  useServerValidation(createMutation.error, form);

  const handleSubmit = (data: CreateCoverLetterInput) => {
    createMutation.mutate(data);
  };

  const handleAiImprove = async (data: CreateCoverLetterInput) => {
    const improvedData = await improveLetterMutation.mutateAsync({
      data: toCoverLetterAiImprovementData(data),
    });
    toast.success("Surat lamaran berhasil diperbaiki dengan AI");
    return improvedData;
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Surat Lamaran", href: "/cover-letters" },
        { label: "Buat Surat Lamaran" },
      ]}
    >
      <MinimalSEO
        title="Buat Surat Lamaran"
        description="Buat surat lamaran kerja baru."
        noIndex={true}
      />
      <PageHeader
        title="Buat Surat Lamaran"
        subtitle="Buat surat lamaran kerja baru."
        showBackButton
        backButtonUrl="/cover-letters"
      >
        <Button
          type="button"
          variant="outline"
          disabled={createMutation.isPending || improveLetterMutation.isPending}
          onClick={() => letterFormRef.current?.improveWithAi()}
        >
          <Sparkles data-icon="inline-start" />
          Perbaiki Surat Lamaran
        </Button>
      </PageHeader>

      <CoverLetterForm
        ref={letterFormRef}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cover-letters")}
        isLoading={createMutation.isPending}
        error={createMutation.error}
        onAiImprove={handleAiImprove}
      />
      <LoadingOverlay
        show={improveLetterMutation.isPending}
        message="Sedang memperbaiki surat lamaran dengan AI..."
      />
    </DashboardLayout>
  );
}
