import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  Users,
  Globe,
  Mail,
  Phone,
  Building2,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
    expired: "outline",
  };
  return variants[status];
};

const STATUS_LABELS: Record<JobStatus, string> = {
  published: "Published",
  draft: "Draft",
  closed: "Closed",
  expired: "Expired",
};

export default function AdminJobShow() {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: job, isLoading, error } = useJob({ id: jobId || "" });
  const deleteJobMutation = useDeleteJob();

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data lowongan...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout>
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
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/jobs")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {job.job_role?.name}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(job.status)}>
                  {STATUS_LABELS[job.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{JOB_TYPE_LABELS[job.job_type]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.city?.name}</span>
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

          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{job.contact_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{job.contact_email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{job.contact_phone}</span>
              </div>
              {job.job_url && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {job.job_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gaji
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-primary">
                {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">per bulan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Perusahaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.company?.logo} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {job.company?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{job.company?.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {job.company?.business_sector}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {job.company?.description}
              </p>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ukuran</span>
                  <span>
                    {job.company?.employee_size
                      ? EMPLOYEE_SIZE_LABELS[job.company.employee_size]
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website</span>
                  <a
                    href={job.company?.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Kunjungi
                  </a>
                </div>
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
