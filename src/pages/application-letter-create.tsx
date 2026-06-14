import { useRef } from "react";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  ApplicationLetterForm,
  type ApplicationLetterFormHandle,
} from "@/features/application-letters/components/application-letter-form";
import { type CreateApplicationLetterInput } from "@/features/application-letters/api/create-application-letter";
import { useCreateApplicationLetter } from "@/features/application-letters/api/create-application-letter";
import {
  toApplicationLetterAiImprovementData,
  useImproveApplicationLetterWithAI,
} from "@/features/application-letters/api/improve-application-letter-with-ai";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/minimal-seo"; // Import
import { Sparkles } from "lucide-react";

export default function ApplicationLetterCreate() {
  const navigate = useNavigate();
  const form = useForm<CreateApplicationLetterInput>();
  const letterFormRef = useRef<ApplicationLetterFormHandle>(null);

  const createMutation = useCreateApplicationLetter({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("Surat lamaran berhasil dibuat");
        navigate(paths.applicationLetters.detail.getHref(data.id));
      },
    },
  });
  const improveLetterMutation = useImproveApplicationLetterWithAI();

  useServerValidation(createMutation.error, form);

  const handleSubmit = (data: CreateApplicationLetterInput) => {
    createMutation.mutate(data);
  };

  const handleAiImprove = async (data: CreateApplicationLetterInput) => {
    const improvedData = await improveLetterMutation.mutateAsync({
      data: toApplicationLetterAiImprovementData(data),
    });
    toast.success("Surat lamaran berhasil diperbaiki dengan AI");
    return improvedData;
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Surat Lamaran", href: "/application-letters" },
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
        backButtonUrl="/application-letters"
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

      <ApplicationLetterForm
        ref={letterFormRef}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/application-letters")}
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
