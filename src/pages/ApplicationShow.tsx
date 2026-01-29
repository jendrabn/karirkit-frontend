import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  Clock,
  Briefcase,
  Wallet,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Building2,
  Info,
  ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { MinimalSEO } from "@/components/MinimalSEO";
import { useApplication } from "@/features/applications/api/get-application";
import { useDeleteApplication } from "@/features/applications/api/delete-application";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "@/lib/date";
import { formatCurrency } from "@/lib/utils";
import { InfoItem, ContactItem, RichText } from "@/components/ui/display-info";
import {
  JOB_TYPE_OPTIONS,
  WORK_SYSTEM_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
  type Application,
} from "@/types/application";

const getLabel = (
  value: string,
  options: { value: string; label: string }[],
) => {
  return options.find((opt) => opt.value === value)?.label || value;
};

const getResultBadgeVariant = (result: Application["result_status"]) => {
  if (result === "passed") return "default";
  if (result === "failed") return "destructive";
  return "outline";
};

const getStatusBadgeVariant = (status: Application["status"]) => {
  if (status === "draft" || status === "submitted") return "secondary";
  if (status === "accepted") return "default";
  if (status === "rejected") return "destructive";
  return "outline";
};

const ApplicationShow = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: application, isLoading, error } = useApplication({
    id: id!,
  });

  const deleteMutation = useDeleteApplication({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Lamaran berhasil dihapus");
        navigate("/applications");
      },
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Lamaran Kerja", href: "/applications" },
          { label: "Detail Lamaran" },
        ]}
      >
        <MinimalSEO
          title="Memuat Lamaran"
          description="Memuat detail lamaran..."
          noIndex={true}
        />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data lamaran...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Lamaran Kerja", href: "/applications" },
          { label: "Lamaran Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="Lamaran Tidak Ditemukan"
          description="Data lamaran tidak ditemukan."
          noIndex={true}
        />
        <PageHeader title="Lamaran Tidak Ditemukan" showBackButton />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            Data lamaran tersebut tidak tersedia atau terjadi kesalahan.
          </p>
          <Button onClick={() => navigate("/applications")}>
            Kembali ke Daftar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusLabel = getLabel(application.status, STATUS_OPTIONS);
  const resultLabel = getLabel(application.result_status, RESULT_STATUS_OPTIONS);
  const badges = [
    {
      label: getLabel(application.job_type, JOB_TYPE_OPTIONS),
      icon: Briefcase,
      variant: "outline" as const,
    },
    {
      label: getLabel(application.work_system, WORK_SYSTEM_OPTIONS),
      icon: Clock,
      variant: "outline" as const,
    },
  ];

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lamaran Kerja", href: "/applications" },
        { label: "Detail Lamaran" },
      ]}
    >
      <MinimalSEO
        title={`${application.position} di ${application.company_name}`}
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
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">Informasi Lamaran</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={getStatusBadgeVariant(application.status)}
                    className="text-xs uppercase gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {statusLabel}
                  </Badge>
                  <Badge
                    variant={getResultBadgeVariant(application.result_status)}
                    className="text-xs uppercase gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    {resultLabel}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {badges.map((badge) => (
                  <Badge
                    key={badge.label}
                    variant={badge.variant}
                    className="gap-1.5 text-[10px] uppercase"
                  >
                    <badge.icon className="h-3 w-3" />
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Posisi"
                  value={application.position}
                  icon={Briefcase}
                />
                <InfoItem
                  label="Perusahaan"
                  value={application.company_name}
                  icon={Building2}
                />
                <InfoItem
                  label="Lokasi"
                  value={application.location}
                  icon={MapPin}
                />
                <InfoItem
                  label="Sumber Lowongan"
                  value={application.job_source}
                  icon={Globe}
                />
                <InfoItem
                  label="Tanggal Lamaran"
                  value={formatDate(application.date)}
                  icon={Calendar}
                />
                <InfoItem
                  label="Range Gaji"
                  value={`${formatCurrency(application.salary_min)} - ${formatCurrency(
                    application.salary_max,
                  )}`}
                  icon={Wallet}
                />
              </div>

              <Separator />

              {application.notes && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Catatan Lamaran
                  </p>
                  <RichText content={application.notes} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Follow Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Tanggal Follow Up"
                  value={
                    application.follow_up_date
                      ? formatDate(application.follow_up_date)
                      : "-"
                  }
                  icon={Calendar}
                />
                <InfoItem
                  label="Catatan Follow Up"
                  value={application.follow_up_note}
                  icon={Info}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kontak & Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContactItem
                type="url"
                value={application.company_url}
                label="Website Perusahaan"
                icon={Globe}
              />
              <ContactItem
                type="url"
                value={application.job_url}
                label="Link Lowongan"
                icon={ExternalLink}
              />
              <ContactItem
                type="email"
                value={application.contact_email}
                label="Email Kontak"
                icon={Mail}
              />
              <ContactItem
                type="phone"
                value={application.contact_phone}
                label="Telepon Kontak"
                icon={Phone}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <InfoItem
                  label="Dibuat"
                  value={formatDateTime(application.created_at)}
                  icon={Clock}
                />
                <InfoItem
                  label="Diperbarui"
                  value={formatDateTime(application.updated_at)}
                  icon={Clock}
                />
              </div>
            </CardContent>
          </Card>
        </div>
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
                deleteMutation.mutate({ id: application.id })
              }
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
    </DashboardLayout>
  );
};

export default ApplicationShow;
