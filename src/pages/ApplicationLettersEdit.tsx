import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import {
  ApplicationLetterForm,
  type ApplicationLetterFormData,
} from "@/components/application-letters/ApplicationLetterForm";
import { mockApplicationLetters } from "@/data/mockApplicationLetters";
import { toast } from "sonner";

const ApplicationLettersEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const letter = mockApplicationLetters.find((l) => l.id === id);

  if (!letter) {
    return (
      <DashboardLayout>
        <PageHeader title="Surat Lamaran Tidak Ditemukan" />
        <p className="text-muted-foreground">
          Data surat lamaran dengan ID tersebut tidak ditemukan.
        </p>
      </DashboardLayout>
    );
  }

  const handleSubmit = (data: ApplicationLetterFormData) => {
    // In real implementation, call API to update
    console.log("Updating application letter:", data);
    toast.success("Surat lamaran berhasil diperbarui");
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
        title="Edit Surat Lamaran"
        subtitle={`Edit surat lamaran untuk ${letter.company_name}`}
      />

      <ApplicationLetterForm
        initialData={letter}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/application-letters")}
      />
    </DashboardLayout>
  );
};

export default ApplicationLettersEdit;
