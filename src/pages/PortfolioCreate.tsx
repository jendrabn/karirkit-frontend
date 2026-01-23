import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PortfolioForm } from "@/features/portfolios/components/PortfolioForm";
import {
  useCreatePortfolio,
  type CreatePortfolioInput,
  type PortfolioFormData,
} from "@/features/portfolios/api/create-portfolio";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/MinimalSEO";

const PortfolioCreate = () => {
  const navigate = useNavigate();
  const form = useForm<PortfolioFormData>();

  const createMutation = useCreatePortfolio({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("Portfolio berhasil dibuat");
        navigate(paths.portfolios.detail.getHref(data.id));
      },
    },
  });

  useServerValidation(createMutation.error, form);

  const handleSubmit = (data: PortfolioFormData) => {
    createMutation.mutate(data as CreatePortfolioInput);
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Portfolio", href: "/portfolios" },
        { label: "Buat Portfolio" },
      ]}
    >
      <MinimalSEO
        title="Buat Portfolio"
        description="Tambahkan proyek baru ke portfolio Anda."
        noIndex={true}
      />
      <PageHeader
        title="Buat Portfolio"
        subtitle="Tambahkan proyek baru ke portfolio Anda"
        showBackButton
        backButtonUrl="/portfolios"
      />
      <PortfolioForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        error={createMutation.error}
      />
    </DashboardLayout>
  );
};

export default PortfolioCreate;
