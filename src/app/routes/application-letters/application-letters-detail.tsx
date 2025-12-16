/* eslint-disable react-hooks/static-components */
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { ArrowLeft, Pencil, Download, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockApplicationLetters } from "@/data/mockApplicationLetters";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/applicationLetter";
import { toast } from "sonner";

const ApplicationLettersDetailRouter = () => {
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

  const getLabel = (
    value: string,
    options: { value: string; label: string }[]
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const handleDownload = (format: "docx" | "pdf") => {
    if (format === "pdf") {
      toast.info("Fitur export PDF akan segera hadir");
      return;
    }
    toast.success(
      `Mengunduh surat lamaran dalam format ${format.toUpperCase()}`
    );
  };

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

      <PageHeader title={letter.subject} subtitle={letter.company_name}>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => handleDownload("docx")}>
                <FileText className="h-4 w-4 mr-2" />
                Word (.docx)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDownload("pdf")}
                className="text-muted-foreground"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF (Segera Hadir)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => navigate(`/application-letters/${id}/edit`)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </PageHeader>

      <div className="flex gap-2 mb-6">
        <Badge variant="outline">
          {getLabel(letter.language, LANGUAGE_OPTIONS)}
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
              value={format(new Date(letter.application_date), "dd MMMM yyyy")}
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
                  src={letter.signature}
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
              value={format(new Date(letter.created_at), "dd MMMM yyyy, HH:mm")}
            />
            <InfoItem
              label="Diperbarui"
              value={format(new Date(letter.updated_at), "dd MMMM yyyy, HH:mm")}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationLettersDetailRouter;
