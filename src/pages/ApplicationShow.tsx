import { useNavigate, useParams } from "react-router";
import { dayjs } from "@/lib/date";
import { Pencil, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  JOB_TYPE_OPTIONS,
  WORK_SYSTEM_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/types/application";
import { useApplication } from "@/features/applications/api/get-application";
import { useDeleteApplication } from "@/features/applications/api/delete-application";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MinimalSEO } from "@/components/MinimalSEO";

export default function ApplicationShow() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: application,
    isLoading,
    error,
  } = useApplication({
    id: id!,
  });

  const deleteApplicationMutation = useDeleteApplication({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Lamaran berhasil dihapus");
        navigate("/applications");
      },
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <MinimalSEO
          title="Loading..."
          description="Memuat detail lamaran..."
          noIndex={true}
        />
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout>
        <MinimalSEO
          title="Lamaran Tidak Ditemukan"
          description="Data lamaran tidak ditemukan."
          noIndex={true}
        />
        <PageHeader title="Lamaran Tidak Ditemukan" />
        <p className="text-muted-foreground">
          Data lamaran dengan ID tersebut tidak ditemukan atau terjadi
          kesalahan.
        </p>
        <Button onClick={() => navigate("/applications")} className="mt-4">
          Kembali ke Daftar
        </Button>
      </DashboardLayout>
    );
  }

  const getLabel = (
    value: string,
    options: { value: string; label: string }[]
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const InfoItem = ({
    label,
    value,
    isLink,
  }: {
    label: string;
    value: string | number;
    isLink?: boolean;
  }) => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      {isLink && value ? (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1 break-all"
        >
          {String(value)}
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      ) : (
        <p className="font-medium">{value || "-"}</p>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <MinimalSEO
        title={`${application.position} at ${application.company_name}`}
        description={`Detail lamaran untuk posisi ${application.position} di ${application.company_name}`}
        noIndex={true}
      />
      <PageHeader
        title={application.position}
        subtitle={application.company_name}
        showBackButton
        backButtonUrl="/applications"
      >
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/applications/${id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="outline">
          {getLabel(application.job_type, JOB_TYPE_OPTIONS)}
        </Badge>
        <Badge variant="outline">
          {getLabel(application.work_system, WORK_SYSTEM_OPTIONS)}
        </Badge>
        <Badge variant="secondary">
          {getLabel(application.status, STATUS_OPTIONS)}
        </Badge>
        <Badge
          variant={
            application.result_status === "passed"
              ? "default"
              : application.result_status === "failed"
              ? "destructive"
              : "outline"
          }
        >
          {getLabel(application.result_status, RESULT_STATUS_OPTIONS)}
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Perusahaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem
              label="Nama Perusahaan"
              value={application.company_name}
            />
            <InfoItem
              label="URL Perusahaan"
              value={application.company_url}
              isLink
            />
            <InfoItem label="Posisi" value={application.position} />
            <InfoItem label="Sumber Lowongan" value={application.job_source} />
            <InfoItem label="URL Lowongan" value={application.job_url} isLink />
            <InfoItem label="Lokasi" value={application.location} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detail Pekerjaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem
              label="Tipe Pekerjaan"
              value={getLabel(application.job_type, JOB_TYPE_OPTIONS)}
            />
            <InfoItem
              label="Sistem Kerja"
              value={getLabel(application.work_system, WORK_SYSTEM_OPTIONS)}
            />
            <InfoItem
              label="Gaji Minimal"
              value={formatCurrency(application.salary_min)}
            />
            <InfoItem
              label="Gaji Maksimal"
              value={formatCurrency(application.salary_max)}
            />
            <InfoItem
              label="Tanggal Lamaran"
              value={dayjs(application.date).format("DD MMMM YYYY")}
            />
            <InfoItem
              label="Status"
              value={getLabel(application.status, STATUS_OPTIONS)}
            />
            <InfoItem
              label="Hasil"
              value={getLabel(application.result_status, RESULT_STATUS_OPTIONS)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Kontak</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Nama Kontak" value={application.contact_name} />
            <InfoItem label="Email Kontak" value={application.contact_email} />
            <InfoItem
              label="Telepon Kontak"
              value={application.contact_phone}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Follow Up</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Tanggal Follow Up"
              value={
                application.follow_up_date
                  ? dayjs(application.follow_up_date).format("DD MMMM YYYY")
                  : "-"
              }
            />
            <InfoItem
              label="Catatan Follow Up"
              value={application.follow_up_note}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Catatan</h3>
          <p className="whitespace-pre-wrap">{application.notes || "-"}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="ID" value={application.id} />
            <InfoItem
              label="Dibuat"
              value={dayjs(application.created_at).format(
                "DD MMMM YYYY, HH:mm"
              )}
            />
            <InfoItem
              label="Diperbarui"
              value={dayjs(application.updated_at).format(
                "DD MMMM YYYY, HH:mm"
              )}
            />
          </div>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lamaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Lamaran akan dihapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteApplicationMutation.mutate({ id: application.id })
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteApplicationMutation.isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
