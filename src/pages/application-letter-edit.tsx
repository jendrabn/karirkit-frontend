import { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
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
import { useApplicationLetter } from "@/features/application-letters/api/get-application-letter";
import { useUpdateApplicationLetter } from "@/features/application-letters/api/update-application-letter";
import {
  toApplicationLetterAiImprovementData,
  useImproveApplicationLetterWithAI,
} from "@/features/application-letters/api/improve-application-letter-with-ai";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { Loader2, Sparkles } from "lucide-react";
import { MinimalSEO } from "@/components/minimal-seo";

export default function ApplicationLetterEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const form = useForm<CreateApplicationLetterInput>();
  const letterFormRef = useRef<ApplicationLetterFormHandle>(null);
  const aiImprovedData = (
    location.state as {
      aiImprovedData?: Partial<CreateApplicationLetterInput>;
    } | null
  )?.aiImprovedData;

  const { data: letterResponse, isLoading: isLetterLoading } =
    useApplicationLetter({
      id: id!,
    });

  const updateMutation = useUpdateApplicationLetter({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Surat lamaran berhasil diperbarui");
        navigate(paths.applicationLetters.detail.getHref(id!));
      },
    },
  });
  const improveLetterMutation = useImproveApplicationLetterWithAI();

  useServerValidation(updateMutation.error, form);

  const handleSubmit = (data: CreateApplicationLetterInput) => {
    if (id) {
      updateMutation.mutate({ id, data });
    }
  };

  const handleAiImprove = async (data: CreateApplicationLetterInput) => {
    const improvedData = await improveLetterMutation.mutateAsync({
      data: toApplicationLetterAiImprovementData(data),
    });
    toast.success("Surat lamaran berhasil diperbaiki dengan AI");
    return improvedData;
  };

  if (isLetterLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Surat Lamaran", href: "/application-letters" },
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
          backButtonUrl="/application-letters"
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
          { label: "Surat Lamaran", href: "/application-letters" },
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
          backButtonUrl="/application-letters"
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
        { label: "Surat Lamaran", href: "/application-letters" },
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
        backButtonUrl="/application-letters"
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

      <ApplicationLetterForm
        ref={letterFormRef}
        initialData={letterInitialData as CreateApplicationLetterInput}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/application-letters")}
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
