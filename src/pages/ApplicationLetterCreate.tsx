import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import {
  ApplicationLetterForm,
  ApplicationLetterFormData,
} from "@/components/application-letters/ApplicationLetterForm";
import { toast } from "sonner";

export default function ApplicationLetterCreate() {
  const navigate = useNavigate();

  const handleSubmit = (data: ApplicationLetterFormData) => {
    // In real implementation, call API to create
    console.log("Creating application letter:", data);
    toast.success("Surat lamaran berhasil dibuat");
    navigate("/application-letters");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/application-letters")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <PageHeader
        title="Buat Surat Lamaran"
        subtitle="Buat surat lamaran kerja baru."
      />

      <ApplicationLetterForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/application-letters")}
      />
    </DashboardLayout>
  );
}
