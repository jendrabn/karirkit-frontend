import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { CVForm } from "@/components/cv/CVForm";
import type { CVFormData } from "@/components/cv/CVForm";
import { useCreateCV } from "@/features/cvs/api/create-cv";
import { toast } from "sonner";
import { useFormErrors } from "@/hooks/use-form-errors";
import { useForm } from "react-hook-form";

export default function CVCreate() {
  const navigate = useNavigate();
  const form = useForm<CVFormData>();
  
  useFormErrors(form);

  const createMutation = useCreateCV({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV berhasil dibuat");
        navigate("/cvs");
      },
    },
  });

  const handleSubmit = (data: CVFormData) => {
    createMutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Buat CV Baru"
        subtitle="Lengkapi informasi di bawah untuk membuat CV."
        showBackButton
        backButtonUrl="/cvs"
      />
      <CVForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cvs")}
        isLoading={createMutation.isPending}
      />
    </DashboardLayout>
  );
}
