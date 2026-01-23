import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { CVForm } from "@/features/cvs/components/CVForm";
import {
  type CreateCVInput,
  type CVFormData,
  useCreateCV,
} from "@/features/cvs/api/create-cv";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/MinimalSEO";

export default function CVCreate() {
  const navigate = useNavigate();
  const form = useForm<CVFormData>();

  const createMutation = useCreateCV({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("CV berhasil dibuat");
        navigate(paths.cvs.detail.getHref(data.id));
      },
    },
  });

  useServerValidation(createMutation.error, form);

  const handleSubmit = (data: CVFormData) => {
    createMutation.mutate(data as CreateCVInput);
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
      />
      <CVForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cvs")}
        isLoading={createMutation.isPending}
        error={createMutation.error}
      />
    </DashboardLayout>
  );
}
