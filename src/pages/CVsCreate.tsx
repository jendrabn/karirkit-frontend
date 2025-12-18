import { useState } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { CVForm, type CVFormData } from "@/components/cv/CVForm";
import { toast } from "sonner";

const CVsCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CVFormData) => {
    setIsLoading(true);
    try {
      // In real implementation, call API to create CV
      console.log("Creating CV:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("CV berhasil dibuat");
      navigate("/cvs");
    } catch {
      toast.error("Gagal membuat CV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Buat CV Baru"
        subtitle="Lengkapi informasi di bawah untuk membuat CV."
      />
      <CVForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cvs")}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};

export default CVsCreate;
