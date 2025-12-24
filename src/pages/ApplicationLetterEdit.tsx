import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationLetterForm } from "@/features/application-letters/components/ApplicationLetterForm";
import type { ApplicationLetterFormData } from "@/features/application-letters/components/ApplicationLetterForm";
import { useApplicationLetter } from "@/features/application-letters/api/get-application-letter";
import { useUpdateApplicationLetter } from "@/features/application-letters/api/update-application-letter";
import { toast } from "sonner";
import { useFormErrors } from "@/hooks/use-form-errors";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

export default function ApplicationLetterEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const form = useForm<ApplicationLetterFormData>();

  useFormErrors(form);

  const { data: letterResponse, isLoading: isLetterLoading } =
    useApplicationLetter({
      id: id!,
    });

  const updateMutation = useUpdateApplicationLetter({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Surat lamaran berhasil diperbarui");
        navigate("/application-letters");
      },
    },
  });

  const handleSubmit = (data: ApplicationLetterFormData) => {
    if (id) {
      updateMutation.mutate({ id, data });
    }
  };

  if (isLetterLoading) {
    return (
      <DashboardLayout>
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
      <DashboardLayout>
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
    <DashboardLayout>
      <PageHeader
        title="Edit Surat Lamaran"
        subtitle={`Edit surat lamaran untuk ${letter.company_name}`}
        showBackButton
        backButtonUrl="/application-letters"
      />

      <ApplicationLetterForm
        initialData={letter}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/application-letters")}
        isLoading={updateMutation.isPending}
      />
    </DashboardLayout>
  );
}
