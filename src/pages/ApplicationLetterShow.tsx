import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Pencil,
  Loader2,
  Trash2,
  Download,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Building2,
  MapPin,
  FileText,
  Info,
  GraduationCap,
  Users,
  Briefcase,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { MinimalSEO } from "@/components/MinimalSEO";
import { useApplicationLetter } from "@/features/application-letters/api/get-application-letter";
import { useDeleteApplicationLetter } from "@/features/application-letters/api/delete-application-letter";
import { useDownloadApplicationLetter } from "@/features/application-letters/api/download-application-letter";
import { buildImageUrl } from "@/lib/utils";
import { formatDate, formatDateTime } from "@/lib/date";
import { InfoItem, ContactItem, RichText } from "@/components/ui/display-info";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/applicationLetter";
import { toast } from "sonner";

const getLabel = (value: string, options: { value: string; label: string }[]) =>
  options.find((opt) => opt.value === value)?.label || value;

const ApplicationLetterShow = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: letter, isLoading } = useApplicationLetter({
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
          title="Memuat Surat Lamaran"
          description="Memuat detail surat lamaran..."
          noIndex={true}
        />
        <PageHeader
          title="Detail Surat Lamaran"
          showBackButton
          backButtonUrl="/application-letters"
        />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            Surat lamaran dengan ID tersebut tidak ditemukan atau terjadi
            kesalahan.
          </p>
          <Button onClick={() => navigate("/application-letters")}>
            Kembali ke Daftar
          </Button>
        </div>
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
            disabled={deleteMutation.isPending}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Pelamar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Nama Lengkap"
                  value={letter.name}
                  icon={User}
                />
                <InfoItem
                  label="Tempat, Tanggal Lahir"
                  value={letter.birth_place_date}
                  icon={Calendar}
                />
                <InfoItem
                  label="Jenis Kelamin"
                  value={getLabel(letter.gender, GENDER_OPTIONS)}
                  icon={User}
                />
                <InfoItem
                  label="Status Pernikahan"
                  value={getLabel(
                    letter.marital_status,
                    MARITAL_STATUS_OPTIONS,
                  )}
                  icon={Users}
                />
                <InfoItem
                  label="Pendidikan"
                  value={letter.education}
                  icon={GraduationCap}
                />
                <InfoItem
                  label="Kota Pelamar"
                  value={letter.applicant_city}
                  icon={MapPin}
                />
                <div className="sm:col-span-2">
                  <InfoItem
                    label="Alamat"
                    value={letter.address}
                    icon={MapPin}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Perusahaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Jabatan Penerima"
                  value={letter.receiver_title}
                  icon={Briefcase}
                />
                <InfoItem
                  label="Nama Perusahaan"
                  value={letter.company_name}
                  icon={Building2}
                />
                <InfoItem
                  label="Kota Perusahaan"
                  value={letter.company_city}
                  icon={MapPin}
                />
                <InfoItem
                  label="Tanggal Lamaran"
                  value={formatDate(letter.application_date)}
                  icon={Calendar}
                />
                <div className="sm:col-span-2">
                  <InfoItem
                    label="Alamat Perusahaan"
                    value={letter.company_address}
                    icon={MapPin}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Isi Surat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <InfoItem label="Subjek" value={letter.subject} icon={Info} />
              <Separator />
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Paragraf Pembuka
                  </p>
                  <RichText content={letter.opening_paragraph} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Paragraf Isi
                  </p>
                  <RichText content={letter.body_paragraph} />
                </div>
                {letter.attachments && (
                  <InfoItem
                    label="Lampiran"
                    value={letter.attachments}
                    icon={FileText}
                  />
                )}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Paragraf Penutup
                  </p>
                  <RichText content={letter.closing_paragraph} />
                </div>
                {letter.signature && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Tanda Tangan
                    </p>
                    <img
                      src={buildImageUrl(letter.signature)}
                      alt="Tanda tangan"
                      className="max-h-24 border rounded-md p-2 bg-background"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kontak Pelamar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContactItem
                type="email"
                value={letter.email}
                label="Email"
                icon={Mail}
              />
              <ContactItem
                type="phone"
                value={letter.phone}
                label="Telepon"
                icon={Phone}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Info Perusahaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                label="Perusahaan"
                value={letter.company_name}
                icon={Building2}
              />
              <InfoItem
                label="Kota"
                value={letter.company_city}
                icon={MapPin}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                label="Dibuat"
                value={formatDateTime(letter.created_at)}
                icon={Clock}
              />
              <InfoItem
                label="Diperbarui"
                value={formatDateTime(letter.updated_at)}
                icon={Clock}
              />
            </CardContent>
          </Card>
        </div>
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
              onClick={() => deleteMutation.mutate(id!)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
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
};

export default ApplicationLetterShow;
