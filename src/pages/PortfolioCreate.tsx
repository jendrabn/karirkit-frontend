import { useNavigate } from "react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PortfolioForm } from "@/components/portfolios/PortfolioForm";
import { useCreatePortfolio } from "@/features/portfolios/api/create-portfolio";
import { useFormErrors } from "@/hooks/use-form-errors";
import { useForm } from "react-hook-form";

const PortfolioCreate = () => {
  const navigate = useNavigate();
  const form = useForm();
  
  useFormErrors(form);

  const createMutation = useCreatePortfolio({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Portfolio berhasil dibuat");
        navigate("/portfolios");
      },
    },
  });

  const handleSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Buat Portfolio"
        subtitle="Tambahkan proyek baru ke portfolio Anda"
        showBackButton
        backButtonUrl="/portfolios"
      />
      <div className="max-w-4xl">
        <PortfolioForm 
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default PortfolioCreate;
