import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationLetterForm } from "@/features/application-letters/components/ApplicationLetterForm";
import type { ApplicationLetterFormData } from "@/features/application-letters/components/ApplicationLetterForm";
import { useCreateApplicationLetter } from "@/features/application-letters/api/create-application-letter";
import { toast } from "sonner";
import { useFormErrors } from "@/hooks/use-form-errors";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/MinimalSEO"; // Import

export default function ApplicationLetterCreate() {
  const navigate = useNavigate();
  const form = useForm<ApplicationLetterFormData>();

  useFormErrors(form);

  const createMutation = useCreateApplicationLetter({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("Surat lamaran berhasil dibuat");
        navigate(paths.applicationLetters.detail.getHref(data.id));
      },
    },
  });

  const handleSubmit = (data: ApplicationLetterFormData) => {
    createMutation.mutate(data);
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
      />

      <ApplicationLetterForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/application-letters")}
        isLoading={createMutation.isPending}
      />
    </DashboardLayout>
  );
}
