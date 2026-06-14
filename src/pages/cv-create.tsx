import { useRef } from "react";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Sparkles } from "lucide-react";
import { CVForm, type CVFormHandle } from "@/features/cvs/components/cv-form";
import {
  type CreateCVInput,
  type CVFormData,
  useCreateCV,
} from "@/features/cvs/api/create-cv";
import {
  toCvAiImprovementData,
  useImproveCVWithAI,
} from "@/features/cvs/api/improve-cv-with-ai";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/minimal-seo";

export default function CVCreate() {
  const navigate = useNavigate();
  const form = useForm<CVFormData>();
  const cvFormRef = useRef<CVFormHandle>(null);

  const createMutation = useCreateCV({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("CV berhasil dibuat");
        navigate(paths.cvs.detail.getHref(data.id));
      },
    },
  });
  const improveCvMutation = useImproveCVWithAI();

  useServerValidation(createMutation.error, form);

  const handleSubmit = (data: CVFormData) => {
    createMutation.mutate(data as CreateCVInput);
  };

  const handleAiImprove = async (data: CVFormData) => {
    const improvedData = await improveCvMutation.mutateAsync({
      data: toCvAiImprovementData(data as CreateCVInput),
    });
    toast.success("CV berhasil diperbaiki dengan AI");
    return improvedData;
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "CV Saya", href: "/cvs" },
        { label: "Buat CV" },
      ]}
    >
      <MinimalSEO
        title="Buat CV Baru"
        description="Lengkapi informasi untuk membuat CV baru."
        noIndex={true}
      />
      <PageHeader
        title="Buat CV Baru"
        subtitle="Lengkapi informasi di bawah untuk membuat CV."
        showBackButton
        backButtonUrl="/cvs"
      >
        <Button
          type="button"
          variant="outline"
          disabled={createMutation.isPending || improveCvMutation.isPending}
          onClick={() => cvFormRef.current?.improveWithAi()}
        >
          <Sparkles data-icon="inline-start" />
          Perbaiki CV
        </Button>
      </PageHeader>
      <CVForm
        ref={cvFormRef}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cvs")}
        isLoading={createMutation.isPending}
        error={createMutation.error}
        onAiImprove={handleAiImprove}
      />
      <LoadingOverlay
        show={improveCvMutation.isPending}
        message="Sedang memperbaiki CV dengan AI..."
      />
    </DashboardLayout>
  );
}
