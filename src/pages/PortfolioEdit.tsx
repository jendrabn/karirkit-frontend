/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PortfolioForm } from "@/features/portfolios/components/PortfolioForm";
import { usePortfolio } from "@/features/portfolios/api/get-portfolio";
import { useUpdatePortfolio } from "@/features/portfolios/api/update-portfolio";
import { useFormErrors } from "@/hooks/use-form-errors";
import { useForm } from "react-hook-form";

const PortfolioEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm();

  useFormErrors(form);

  const { data: portfolioResponse, isLoading } = usePortfolio({
    id: id!,
  });

  const updateMutation = useUpdatePortfolio({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Portfolio berhasil diperbarui");
        navigate("/portfolios");
      },
    },
  });

  const handleSubmit = (data: any) => {
    if (id) {
      updateMutation.mutate({ id, data });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
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
      <DashboardLayout>
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
    <DashboardLayout>
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
      />
    </DashboardLayout>
  );
};

export default PortfolioEdit;
