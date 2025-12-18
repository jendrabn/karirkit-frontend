/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { mockApplications } from "@/data/mockApplications";
import { toast } from "@/hooks/use-toast";

const ApplicationsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const application = mockApplications.find((app) => app.id === id);

  if (!application) {
    return (
      <DashboardLayout>
        <PageHeader title="Lamaran Tidak Ditemukan" />
        <p className="text-muted-foreground">
          Data lamaran dengan ID tersebut tidak ditemukan.
        </p>
      </DashboardLayout>
    );
  }

  const handleSubmit = (data: any) => {
    console.log("Updating application:", data);
    toast({
      title: "Berhasil",
      description: "Lamaran berhasil diperbarui.",
    });
    navigate("/applications");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Edit Lamaran"
        subtitle={`Edit lamaran ke ${application.company_name}`}
      />

      <ApplicationForm
        initialData={application}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/applications")}
      />
    </DashboardLayout>
  );
};

export default ApplicationsEdit;
