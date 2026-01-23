import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { dayjs } from "@/lib/date";
import { Pencil, Loader2, Trash2, Download } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

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
import { useApplicationLetter } from "@/features/application-letters/api/get-application-letter";
import { useDeleteApplicationLetter } from "@/features/application-letters/api/delete-application-letter";
import { useDownloadApplicationLetter } from "@/features/application-letters/api/download-application-letter";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/applicationLetter";
import { toast } from "sonner";
import { buildImageUrl } from "@/lib/utils";
import { MinimalSEO } from "@/components/MinimalSEO";

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default function ApplicationLetterShow() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: letterResponse, isLoading } = useApplicationLetter({
    id: id!,
  });

  const deleteMutation = useDeleteApplicationLetter({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Surat lamaran berhasil dihapus");
        navigate("/application-letters");
      },
    },
  });
  const downloadMutation = useDownloadApplicationLetter();

  const letter = letterResponse;

  const getLabel = (
    value: string,
    options: { value: string; label: string }[]
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Surat Lamaran", href: "/application-letters" },
          { label: "Detail Surat Lamaran" },
        ]}
      >
        <MinimalSEO
          title="Loading..."
          description="Memuat surat lamaran..."
          noIndex={true}
        />
        <PageHeader
          title="Detail Surat Lamaran"
          showBackButton
          backButtonUrl="/application-letters"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Memuat data...
            </span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!letter) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Surat Lamaran", href: "/application-letters" },
          { label: "Surat Lamaran Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="Surat Lamaran Tidak Ditemukan"
          description="Surat lamaran tidak ditemukan."
          noIndex={true}
        />
        <PageHeader
          title="Surat Lamaran Tidak Ditemukan"
          showBackButton
          backButtonUrl="/application-letters"
        />
        <p className="text-muted-foreground">
          Data surat lamaran dengan ID tersebut tidak ditemukan atau terjadi
          kesalahan.
        </p>
        <Button
          onClick={() => navigate("/application-letters")}
          className="mt-4"
        >
          Kembali ke Daftar
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Surat Lamaran", href: "/application-letters" },
        { label: "Detail Surat Lamaran" },
      ]}
    >
      <MinimalSEO
        title={`${letter.subject} - ${letter.company_name}`}
        description={`Detail surat lamaran untuk ${letter.company_name}`}
        noIndex={true}
      />
      <PageHeader
        title={letter.subject}
        subtitle={letter.company_name}
        showBackButton
        backButtonUrl="/application-letters"
      >
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadMutation.mutate({
                id: letter.id,
                format: "docx",
                name: letter.name,
                subject: letter.subject,
              })
            }
            disabled={downloadMutation.isPending}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download Docx
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadMutation.mutate({
                id: letter.id,
                format: "pdf",
                name: letter.name,
                subject: letter.subject,
              })
            }
            disabled={downloadMutation.isPending}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/application-letters/${id}/edit`)}
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

      <div className="flex gap-2 mb-6">
        <Badge variant="outline">
          {getLabel(letter.language || "id", LANGUAGE_OPTIONS)}
        </Badge>
        <Badge variant="secondary">
          {getLabel(letter.gender, GENDER_OPTIONS)}
        </Badge>
        <Badge variant="secondary">
          {getLabel(letter.marital_status, MARITAL_STATUS_OPTIONS)}
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Pelamar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label="Nama Lengkap" value={letter.name} />
            <InfoItem
              label="Tempat, Tanggal Lahir"
              value={letter.birth_place_date}
            />
            <InfoItem
              label="Jenis Kelamin"
              value={getLabel(letter.gender, GENDER_OPTIONS)}
            />
            <InfoItem
              label="Status Pernikahan"
              value={getLabel(letter.marital_status, MARITAL_STATUS_OPTIONS)}
            />
            <InfoItem label="Pendidikan" value={letter.education} />
            <InfoItem label="Nomor Telepon" value={letter.phone} />
            <InfoItem label="Email" value={letter.email} />
            <InfoItem label="Kota Pelamar" value={letter.applicant_city} />
            <div className="md:col-span-2 lg:col-span-3">
              <InfoItem label="Alamat" value={letter.address} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Perusahaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label="Jabatan Penerima" value={letter.receiver_title} />
            <InfoItem label="Nama Perusahaan" value={letter.company_name} />
            <InfoItem label="Kota Perusahaan" value={letter.company_city} />
            <InfoItem
              label="Tanggal Lamaran"
              value={dayjs(letter.application_date).format("DD MMMM YYYY")}
            />
            <div className="md:col-span-2 lg:col-span-3">
              <InfoItem
                label="Alamat Perusahaan"
                value={letter.company_address}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Isi Surat</h3>
          <div className="space-y-4">
            <InfoItem label="Subjek" value={letter.subject} />

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Paragraf Pembuka</p>
              <p className="text-foreground whitespace-pre-wrap">
                {letter.opening_paragraph}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Paragraf Isi</p>
              <p className="text-foreground whitespace-pre-wrap">
                {letter.body_paragraph}
              </p>
            </div>

            <InfoItem label="Lampiran" value={letter.attachments} />

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Paragraf Penutup</p>
              <p className="text-foreground whitespace-pre-wrap">
                {letter.closing_paragraph}
              </p>
            </div>

            {letter.signature && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tanda Tangan</p>
                <img
                  src={buildImageUrl(letter.signature)}
                  alt="Tanda tangan"
                  className="max-h-24 border rounded-md p-2 bg-background"
                />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="ID" value={letter.id} />
            <InfoItem
              label="Dibuat"
              value={dayjs(letter.created_at).format("DD MMMM YYYY, HH:mm")}
            />
            <InfoItem
              label="Diperbarui"
              value={dayjs(letter.updated_at).format("DD MMMM YYYY, HH:mm")}
            />
          </div>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Surat Lamaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus surat lamaran ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoadingOverlay
        show={downloadMutation.isPending}
        message="Sedang mengunduh surat lamaran..."
      />
    </DashboardLayout>
  );
}
