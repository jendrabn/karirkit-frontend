import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Pencil,
  Trash2,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { paths } from "@/config/paths";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buildImageUrl } from "@/lib/utils";
import {
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
  type JobStatus,
} from "@/types/job";
import { useJob } from "@/features/admin/jobs/api/get-job";
import { useDeleteJob } from "@/features/admin/jobs/api/delete-job";
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

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
        { label: "Detail Lowongan" },
      ]}
    >
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
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {STATUS_LABELS[job.status]}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{JOB_TYPE_LABELS[job.job_type]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.city?.name || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>{EDUCATION_LEVEL_LABELS[job.education_level]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{job.min_years_of_experience}+ tahun</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-lg">
                    Deskripsi Pekerjaan
                  </h3>
                  <div
                    className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">Persyaratan</h3>
                  <div
                    className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {job.medias?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Media Lowongan</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  {job.medias.map((media) => (
                    <div
                      key={media.id || media.path}
                      className="aspect-[4/3] w-full overflow-hidden rounded-lg border"
                    >
                      <img
                        src={buildImageUrl(media.path)}
                        className="h-full w-full object-cover"
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

          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <a
                  href={job.company?.website_url || undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-primary"
                >
                  {job.company?.website_url || "Website tidak tersedia"}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{job.contact_email || job.company?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{job.contact_phone || job.company?.phone || "-"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detail Lainnya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sistem Kerja</span>
                <Badge variant="outline">
                  {WORK_SYSTEM_LABELS[job.work_system]}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kuota Talenta</span>
                <span>{job.talent_quota} orang</span>
              </div>
              {job.expiration_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kadaluarsa</span>
                  <span>
                    {format(new Date(job.expiration_date), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibuat</span>
                <span>
                  {format(new Date(job.created_at), "dd MMM yyyy", {
                    locale: id,
                  })}
                </span>
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
              Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteJobMutation.isPending}
            >
              {deleteJobMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
