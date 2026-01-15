import { useNavigate, useParams } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationLetterForm } from "@/features/application-letters/components/ApplicationLetterForm";
import { type CreateApplicationLetterInput } from "@/features/application-letters/api/create-application-letter";
import { useApplicationLetter } from "@/features/application-letters/api/get-application-letter";
import { useUpdateApplicationLetter } from "@/features/application-letters/api/update-application-letter";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { MinimalSEO } from "@/components/MinimalSEO";

export default function ApplicationLetterEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const form = useForm<CreateApplicationLetterInput>();

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

  useServerValidation(updateMutation.error, form);

  const handleSubmit = (data: CreateApplicationLetterInput) => {
    if (id) {
      updateMutation.mutate({ id, data });
    }
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
      />

      <ApplicationLetterForm
        initialData={letter as CreateApplicationLetterInput}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/application-letters")}
        isLoading={updateMutation.isPending}
        error={updateMutation.error}
      />
    </DashboardLayout>
  );
}
