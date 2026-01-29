import { useNavigate, useParams } from "react-router";
import {
  Pencil,
  Trash2,
  Loader2,
  ExternalLink,
  Mail,
  Phone,
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Wallet,
  Users,
  Calendar,
  Clock,
  Award,
} from "lucide-react";
import { useState } from "react";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildImageUrl } from "@/lib/utils";
import { formatCurrency, formatYears } from "@/lib/utils";
import { formatDateTime } from "@/lib/date";
import { InfoItem, ContactItem, RichText } from "@/components/ui/display-info";
import {
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
  EMPLOYEE_SIZE_LABELS,
  type JobStatus,
} from "@/types/job";
import { useJob } from "@/features/admin/jobs/api/get-job";
import { useDeleteJob } from "@/features/admin/jobs/api/delete-job";
import { toast } from "sonner";
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

const getStatusBadgeVariant = (status: JobStatus) => {
  const variants: Record<
    JobStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    published: "default",
    draft: "secondary",
    closed: "destructive",
    archived: "outline",
  };
  return variants[status];
};

const STATUS_LABELS: Record<JobStatus, string> = {
  published: "Published",
  draft: "Draft",
  closed: "Closed",
  archived: "Archived",
};

export default function AdminJobShow() {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: job, isLoading, error } = useJob({ id: jobId || "" });
  const deleteJobMutation = useDeleteJob();

  const handleDelete = () => {
    if (!jobId) return;
    deleteJobMutation.mutate(jobId, {
      onSuccess: () => {
        toast.success("Lowongan berhasil dihapus");
        navigate("/admin/jobs");
      },
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
          { label: "Detail Lowongan" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data lowongan...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
          { label: "Lowongan Tidak Ditemukan" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Lowongan tidak ditemukan</p>
          <Button onClick={() => navigate("/admin/jobs")}>
            Kembali ke Daftar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const company = job.company;
  const companyMeta = company as typeof company & {
    employeeSize?: string | null;
    businessSector?: string | null;
    websiteUrl?: string | null;
  };
  const companyEmployeeSize =
    company?.employee_size ?? companyMeta?.employeeSize ?? null;
  const companyBusinessSector =
    company?.business_sector ?? companyMeta?.businessSector ?? null;
  const companyWebsiteUrl =
    company?.website_url ?? companyMeta?.websiteUrl ?? null;

  const locationLabel = job.city?.name
    ? `${job.city.name}${job.city.province?.name ? `, ${job.city.province.name}` : ""}`
    : "-";

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
        { label: "Detail Lowongan" },
      ]}
    >
      <MinimalSEO
        title={job.title}
        description={
          job.company?.name
            ? `Detail lowongan di ${job.company.name}`
            : undefined
        }
        noIndex={true}
      />
      <PageHeader
        title={job.title}
        subtitle={job.job_role?.name}
        showBackButton
        backButtonUrl="/admin/jobs"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Informasi Lowongan</CardTitle>
                <Badge
                  variant={getStatusBadgeVariant(job.status)}
                  className="text-xs"
                >
                  {STATUS_LABELS[job.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <Briefcase className="h-3 w-3" />
                  {JOB_TYPE_LABELS[job.job_type]}
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <Building2 className="h-3 w-3" />
                  {WORK_SYSTEM_LABELS[job.work_system]}
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <GraduationCap className="h-3 w-3" />
                  {EDUCATION_LEVEL_LABELS[job.education_level]}
                </Badge>
              </div>

              <Separator />

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="Lokasi" value={locationLabel} icon={MapPin} />
                <InfoItem
                  label="Role Pekerjaan"
                  value={job.job_role?.name}
                  icon={Briefcase}
                />
                <InfoItem
                  label="Pengalaman"
                  value={
                    job.min_years_of_experience !== null ||
                    job.max_years_of_experience !== null
                      ? `${formatYears(job.min_years_of_experience)} - ${formatYears(job.max_years_of_experience)}`
                      : "-"
                  }
                  icon={Award}
                />
                <InfoItem
                  label="Range Gaji"
                  value={
                    job.salary_min || job.salary_max
                      ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`
                      : "-"
                  }
                  icon={Wallet}
                />
                <InfoItem
                  label="Kuota Talenta"
                  value={
                    job.talent_quota !== null && job.talent_quota !== undefined
                      ? `${job.talent_quota} orang`
                      : "-"
                  }
                  icon={Users}
                />
                <InfoItem
                  label="Batas Waktu"
                  value={formatDateTime(job.expiration_date || "")}
                  icon={Calendar}
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deskripsi Pekerjaan</CardTitle>
            </CardHeader>
            <CardContent>
              <RichText content={job.description} />
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Persyaratan</CardTitle>
            </CardHeader>
            <CardContent>
              <RichText content={job.requirements} />
            </CardContent>
          </Card>

          {/* Media */}
          {job.medias && job.medias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media Lowongan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {job.medias.map((media) => (
                    <div
                      key={media.id || media.path}
                      className="aspect-video w-full overflow-hidden rounded-lg border bg-muted"
                    >
                      <img
                        src={buildImageUrl(media.path)}
                        alt="Media lowongan"
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perusahaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14 rounded-lg shrink-0">
                  <AvatarImage
                    src={buildImageUrl(company?.logo)}
                    alt={company?.name || "Logo Perusahaan"}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-lg">
                    {company?.name?.substring(0, 2).toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-semibold text-base truncate">
                    {company?.name || "-"}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {company?.slug || "-"}
                  </p>
                </div>
              </div>

              {company?.description && (
                <>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <RichText content={company.description} />
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                {companyBusinessSector && (
                  <InfoItem
                    label="Sektor Bisnis"
                    value={companyBusinessSector}
                    icon={Building2}
                  />
                )}
                {companyEmployeeSize && (
                  <InfoItem
                    label="Ukuran Perusahaan"
                    value={
                      EMPLOYEE_SIZE_LABELS[
                        companyEmployeeSize as keyof typeof EMPLOYEE_SIZE_LABELS
                      ] || companyEmployeeSize
                    }
                    icon={Users}
                  />
                )}
              </div>

              {(companyWebsiteUrl || company?.email || company?.phone) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    {companyWebsiteUrl && (
                      <ContactItem
                        type="url"
                        value={companyWebsiteUrl}
                        label="Website"
                        icon={ExternalLink}
                      />
                    )}
                    {company?.email && (
                      <ContactItem
                        type="email"
                        value={company.email}
                        label="Email"
                        icon={Mail}
                      />
                    )}
                    {company?.phone && (
                      <ContactItem
                        type="phone"
                        value={company.phone}
                        label="Telepon"
                        icon={Phone}
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kontak Lowongan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.contact_name && (
                <InfoItem
                  label="Nama Kontak"
                  value={job.contact_name}
                  icon={Users}
                />
              )}
              {job.contact_email && (
                <ContactItem
                  type="email"
                  value={job.contact_email}
                  label="Email Kontak"
                  icon={Mail}
                />
              )}
              {job.contact_phone && (
                <ContactItem
                  type="phone"
                  value={job.contact_phone}
                  label="Telepon Kontak"
                  icon={Phone}
                />
              )}
              {job.job_url && (
                <ContactItem
                  type="url"
                  value={job.job_url}
                  label="URL Lowongan"
                  icon={ExternalLink}
                />
              )}
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Job ID
                </p>
                <p className="text-xs font-mono bg-muted px-2 py-1.5 rounded break-all">
                  {job.id}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Dibuat"
                  value={formatDateTime(job.created_at)}
                  icon={Clock}
                />
                <InfoItem
                  label="Diperbarui"
                  value={formatDateTime(job.updated_at)}
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
            <AlertDialogTitle>Hapus Lowongan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus lowongan "{job.title}"? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteJobMutation.isPending}
            >
              {deleteJobMutation.isPending ? (
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
}
