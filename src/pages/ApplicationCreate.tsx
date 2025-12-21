import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { toast } from "@/hooks/use-toast";

export default function ApplicationCreate() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Creating application:", data);
    toast({
      title: "Berhasil",
      description: "Lamaran berhasil ditambahkan.",
    });
    navigate("/applications");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Tambah Lamaran"
        subtitle="Tambahkan data lamaran kerja baru."
      />

      <ApplicationForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/applications")}
      />
    </DashboardLayout>
  );
}
