import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Pencil,
  Download,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Users,
  Link as LinkIcon,
  Star,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { mockCVs } from "@/data/mockCVs";
import {
  DEGREE_OPTIONS,
  JOB_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  MONTH_OPTIONS,
} from "@/types/cv";
import { toast } from "sonner";

const CvsDetailRouter = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const cv = mockCVs.find((c) => c.id === id);

  if (!cv) {
    return (
      <DashboardLayout>
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

  const getLabel = (
    value: string | number,
    options: { value: string | number; label: string }[]
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const formatPeriod = (
    startMonth: number,
    startYear: number,
    endMonth: number,
    endYear: number,
    isCurrent: boolean
  ) => {
    const start = `${getLabel(startMonth, MONTH_OPTIONS)} ${startYear}`;
    if (isCurrent) return `${start} - Sekarang`;
    if (endMonth === 0 || endYear === 0) return start;
    return `${start} - ${getLabel(endMonth, MONTH_OPTIONS)} ${endYear}`;
  };

  const handleDownload = (format: "docx" | "pdf") => {
    if (format === "pdf") {
      toast.info("Fitur export PDF akan segera hadir");
      return;
    }
    toast.success(`Mengunduh CV dalam format ${format.toUpperCase()}`);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/cvs")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload("docx")}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button size="sm" onClick={() => navigate(`/cvs/${id}/edit`)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Personal Info */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={cv.photo} />
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
                      {edu.gpa > 0 && (
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
                      {!cert.no_expiry && cert.expiry_year > 0 && (
                        <>
                          {" "}
                          - {getLabel(cert.expiry_month, MONTH_OPTIONS)}{" "}
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
                <LinkIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Media Sosial</h3>
              </div>
              <div className="space-y-3">
                {cv.social_links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {link.platform}
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
                <span>
                  {format(new Date(cv.created_at), "dd MMM yyyy HH:mm")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diperbarui</span>
                <span>
                  {format(new Date(cv.updated_at), "dd MMM yyyy HH:mm")}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CvsDetailRouter;
