import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { dayjs } from "@/lib/date";
import {
  Pencil,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Users,
  Star,
  Layers,
  Loader2,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useCV } from "@/features/cvs/api/get-cv";
import { useDeleteCV } from "@/features/cvs/api/delete-cv";
import { buildImageUrl } from "@/lib/utils";
import {
  DEGREE_OPTIONS,
  JOB_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  MONTH_OPTIONS,
} from "@/types/cv";
import { toast } from "sonner";
import { MinimalSEO } from "@/components/MinimalSEO";
import { getSocialIcon } from "@/lib/socials";
import { SOCIAL_PLATFORM_LABELS } from "@/types/social";

export default function CVShow() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: cvResponse, isLoading } = useCV({
    id: id!,
  });

  const deleteMutation = useDeleteCV({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV berhasil dihapus");
        navigate("/cvs");
      },
    },
  });

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
          { label: "CV Saya", href: "/cvs" },
          { label: "Detail CV" },
        ]}
      >
        <MinimalSEO
          title="Loading..."
          description="Memuat data CV..."
          noIndex={true}
        />
        <PageHeader title="Detail CV" showBackButton backButtonUrl="/cvs" />
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const cv = cvResponse;

  const getLabel = (
    value: string | number,
    options: { value: string | number; label: string }[]
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const formatPeriod = (
    startMonth: number,
    startYear: number,
    endMonth?: number | null,
    endYear?: number | null,
    isCurrent?: boolean
  ) => {
    const start = `${getLabel(startMonth, MONTH_OPTIONS)} ${startYear}`;
    if (isCurrent) return `${start} - Sekarang`;
    if (!endMonth || !endYear) return start;
    return `${start} - ${getLabel(endMonth, MONTH_OPTIONS)} ${endYear}`;
  };

  if (!cv) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "CV Saya", href: "/cvs" },
          { label: "CV Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="CV Tidak Ditemukan"
          description="CV tidak ditemukan."
          noIndex={true}
        />
        <PageHeader title="Detail CV" showBackButton backButtonUrl="/cvs" />
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold mb-2">CV tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">
            CV yang Anda cari tidak tersedia.
          </p>
          <Button onClick={() => navigate("/cvs")}>Kembali ke Daftar CV</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "CV Saya", href: "/cvs" },
        { label: "Detail CV" },
      ]}
    >
      <MinimalSEO
        title={`${cv.name} - ${cv.headline}`}
        description={`Detail CV dari ${cv.name}`}
        noIndex={true}
      />
      <PageHeader title="Detail CV" showBackButton backButtonUrl="/cvs">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/cvs/${id}/edit`)}
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

      {/* Personal Info */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={buildImageUrl(cv.photo)} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {cv.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{cv.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{cv.headline}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {cv.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {cv.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {cv.address}
              </div>
            </div>
          </div>
        </div>
        {cv.about && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="font-semibold mb-2">Tentang Saya</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {cv.about}
              </p>
            </div>
          </>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Experience */}
          {cv.experiences.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Pengalaman Kerja</h3>
              </div>
              <div className="space-y-6">
                {cv.experiences.map((exp, index) => (
                  <div key={index} className={index > 0 ? "border-t pt-6" : ""}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{exp.job_title}</h4>
                        <p className="text-muted-foreground">
                          {exp.company_name}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {getLabel(exp.job_type, JOB_TYPE_OPTIONS)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exp.company_location} •{" "}
                      {formatPeriod(
                        exp.start_month,
                        exp.start_year,
                        exp.end_month,
                        exp.end_year,
                        exp.is_current
                      )}
                    </p>
                    {exp.description && (
                      <p className="mt-3 text-sm whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Education */}
          {cv.educations.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Pendidikan</h3>
              </div>
              <div className="space-y-6">
                {cv.educations.map((edu, index) => (
                  <div key={index} className={index > 0 ? "border-t pt-6" : ""}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{edu.school_name}</h4>
                        <p className="text-muted-foreground">
                          {getLabel(edu.degree, DEGREE_OPTIONS)}{" "}
                          {edu.major && `- ${edu.major}`}
                        </p>
                      </div>
                      {edu.gpa && edu.gpa > 0 && (
                        <Badge variant="secondary">IPK: {edu.gpa}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {edu.school_location} •{" "}
                      {formatPeriod(
                        edu.start_month,
                        edu.start_year,
                        edu.end_month,
                        edu.end_year,
                        edu.is_current
                      )}
                    </p>
                    {edu.description && (
                      <p className="mt-3 text-sm whitespace-pre-wrap">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Organizations */}
          {cv.organizations.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Organisasi</h3>
              </div>
              <div className="space-y-6">
                {cv.organizations.map((org, index) => (
                  <div key={index} className={index > 0 ? "border-t pt-6" : ""}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{org.organization_name}</h4>
                        <p className="text-muted-foreground">
                          {org.role_title}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {getLabel(
                          org.organization_type,
                          ORGANIZATION_TYPE_OPTIONS
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {org.location && `${org.location} • `}
                      {formatPeriod(
                        org.start_month,
                        org.start_year,
                        org.end_month,
                        org.end_year,
                        org.is_current
                      )}
                    </p>
                    {org.description && (
                      <p className="mt-3 text-sm whitespace-pre-wrap">
                        {org.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Projects */}
          {cv.projects.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Proyek</h3>
              </div>
              <div className="space-y-6">
                {cv.projects.map((project, index) => (
                  <div key={index} className={index > 0 ? "border-t pt-6" : ""}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant="secondary">{project.year}</Badge>
                    </div>
                    {project.description && (
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                        {project.description}
                      </p>
                    )}
                    {(project.repo_url || project.live_url) && (
                      <div className="flex flex-wrap gap-3 mt-3 text-sm">
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <LinkIcon className="h-4 w-4" />
                            Repository
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <LinkIcon className="h-4 w-4" />
                            Tautan Live
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Skills */}
          {cv.skills.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Keahlian</h3>
              </div>
              <div className="space-y-3">
                {cv.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span>{skill.name}</span>
                    <Badge variant="outline">
                      {getLabel(skill.level, SKILL_LEVEL_OPTIONS)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Certificates */}
          {cv.certificates.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Sertifikasi</h3>
              </div>
              <div className="space-y-4">
                {cv.certificates.map((cert, index) => (
                  <div key={index} className={index > 0 ? "border-t pt-4" : ""}>
                    <h4 className="font-medium">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getLabel(cert.issue_month, MONTH_OPTIONS)}{" "}
                      {cert.issue_year}
                      {!cert.no_expiry &&
                        cert.expiry_year &&
                        cert.expiry_year > 0 && (
                          <>
                            {" "}
                            - {getLabel(
                              cert.expiry_month ?? 0,
                              MONTH_OPTIONS
                            )}{" "}
                            {cert.expiry_year}
                          </>
                        )}
                    </p>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 inline-block"
                      >
                        Lihat Kredensial
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Awards */}
          {cv.awards.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Penghargaan</h3>
              </div>
              <div className="space-y-4">
                {cv.awards.map((award, index) => (
                  <div key={index} className={index > 0 ? "border-t pt-4" : ""}>
                    <h4 className="font-medium">{award.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {award.issuer} • {award.year}
                    </p>
                    {award.description && (
                      <p className="text-sm mt-1">{award.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Social Links */}
          {cv.social_links.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Media Sosial</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {cv.social_links.map((link, index) => (
                  <a
                    key={`${link.platform}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-foreground hover:border-primary transition-colors"
                  >
                    {getSocialIcon(link.platform, "h-4 w-4")}
                    <span>
                      {SOCIAL_PLATFORM_LABELS[link.platform] ?? link.platform}
                    </span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Metadata */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Informasi
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibuat</span>
                <span>{dayjs(cv.created_at).format("DD MMM YYYY HH:mm")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diperbarui</span>
                <span>{dayjs(cv.updated_at).format("DD MMM YYYY HH:mm")}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus CV?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus CV ini? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
