import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { ArrowLeft, Pencil, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockApplications } from "@/data/mockApplications";
import {
  JOB_TYPE_OPTIONS,
  WORK_SYSTEM_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/types/application";

export default function ApplicationShow() {
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
          className="text-primary hover:underline flex items-center gap-1"
        >
          {String(value).substring(0, 40)}...
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <p className="font-medium">{value || "-"}</p>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/applications")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <PageHeader
        title={application.position}
        subtitle={application.company_name}
      >
        <Button onClick={() => navigate(`/applications/${id}/edit`)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </PageHeader>

      <div className="flex gap-2 mb-6">
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
              : "outline-solid"
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
              value={format(new Date(application.date), "dd MMMM yyyy")}
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
                  ? format(new Date(application.follow_up_date), "dd MMMM yyyy")
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
          <p className="text-foreground">{application.notes || "-"}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="ID" value={application.id} />
            <InfoItem
              label="Dibuat"
              value={format(
                new Date(application.created_at),
                "dd MMMM yyyy, HH:mm"
              )}
            />
            <InfoItem
              label="Diperbarui"
              value={format(
                new Date(application.updated_at),
                "dd MMMM yyyy, HH:mm"
              )}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
