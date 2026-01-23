import { useNavigate, useParams } from "react-router";
import { paths } from "@/config/paths";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PortfolioForm } from "@/features/portfolios/components/PortfolioForm";
import { usePortfolio } from "@/features/portfolios/api/get-portfolio";
import {
  useUpdatePortfolio,
  type UpdatePortfolioInput,
} from "@/features/portfolios/api/update-portfolio";
import type { PortfolioFormData } from "@/features/portfolios/api/create-portfolio";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useForm } from "react-hook-form";
import { MinimalSEO } from "@/components/MinimalSEO";

const PortfolioEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<PortfolioFormData>();

  const { data: portfolioResponse, isLoading } = usePortfolio({
    id: id!,
  });

  const updateMutation = useUpdatePortfolio({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Portfolio berhasil diperbarui");
        navigate(paths.portfolios.detail.getHref(id!));
      },
    },
  });

  useServerValidation(updateMutation.error, form);

  const handleSubmit = (data: PortfolioFormData) => {
    if (id) {
      updateMutation.mutate({ id, data: data as UpdatePortfolioInput });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Portfolio", href: "/portfolios" },
          { label: "Edit Portfolio" },
        ]}
      >
        <MinimalSEO
          title="Loading..."
          description="Memuat data portfolio..."
          noIndex={true}
        />
        <PageHeader
          title="Edit Portfolio"
          subtitle="Perbarui informasi portfolio Anda"
          showBackButton
          backButtonUrl="/portfolios"
        />
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const portfolio = portfolioResponse;

  if (!portfolio) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Portfolio", href: "/portfolios" },
          { label: "Portfolio Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="Portfolio Tidak Ditemukan"
          description="Portfolio tidak ditemukan."
          noIndex={true}
        />
        <PageHeader
          title="Edit Portfolio"
          subtitle="Perbarui informasi portfolio Anda"
          showBackButton
          backButtonUrl="/portfolios"
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Portfolio tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Portfolio", href: "/portfolios" },
        { label: "Edit Portfolio" },
      ]}
    >
      <MinimalSEO
        title={`Edit Portfolio: ${portfolio.title}`}
        description={`Edit portfolio ${portfolio.title}`}
        noIndex={true}
      />
      <PageHeader
        title="Edit Portfolio"
        subtitle="Perbarui informasi portfolio Anda"
        showBackButton
        backButtonUrl="/portfolios"
      />
      <PortfolioForm
        initialData={portfolio}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        error={updateMutation.error}
      />
    </DashboardLayout>
  );
};

export default PortfolioEdit;
