import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { CVForm, type CVFormData } from "@/components/cv/CVForm";
import { mockCVs } from "@/data/mockCVs";
import { toast } from "sonner";

const CvsEditRouter = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // Find CV by id
  const cv = mockCVs.find((c) => c.id === id);

  if (!cv) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold mb-2">CV tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">
            CV yang Anda cari tidak tersedia.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (data: CVFormData) => {
    setIsLoading(true);
    try {
      // In real implementation, call API to update CV
      console.log("Updating CV:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("CV berhasil diperbarui");
      navigate("/cvs");
    } catch {
      toast.error("Gagal memperbarui CV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Edit CV" subtitle="Perbarui informasi CV Anda." />
      <CVForm
        initialData={cv}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cvs")}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};

export default CvsEditRouter;
