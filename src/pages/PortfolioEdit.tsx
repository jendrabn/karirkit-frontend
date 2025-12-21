import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PortfolioForm } from "@/components/portfolios/PortfolioForm";
import { mockPortfolios } from "@/data/mockPortfolios";

const PortfolioEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const portfolio = mockPortfolios.find((p) => p.id === id);

  const handleSubmit = async (data: any) => {
    try {
      console.log("Updating portfolio:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Portfolio berhasil diperbarui");
      navigate("/portfolios");
    } catch (error) {
      toast.error("Gagal memperbarui portfolio");
    }
  };

  if (!portfolio) {
    return (
      <DashboardLayout>
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
      />
      <div className="max-w-4xl">
        <PortfolioForm initialData={portfolio} onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
};

export default PortfolioEdit;
