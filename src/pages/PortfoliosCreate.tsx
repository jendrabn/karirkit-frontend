/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PortfolioForm } from "@/components/portfolios/PortfolioForm";

const PortfoliosCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      // Simulate API call
      console.log("Creating portfolio:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Portfolio berhasil dibuat");
      navigate("/portfolios");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Gagal membuat portfolio");
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Buat Portfolio"
        subtitle="Tambahkan proyek baru ke portfolio Anda"
      />
      <div className="max-w-4xl">
        <PortfolioForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
};

export default PortfoliosCreate;
