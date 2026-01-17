import { useParams } from "react-router";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Users,
  Star,
  Layers,
  Link2 as LinkIcon,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { buildImageUrl } from "@/lib/utils";
import {
  DEGREE_OPTIONS,
  JOB_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  MONTH_OPTIONS,
} from "@/types/cv";
import { MinimalSEO } from "@/components/MinimalSEO";
import { getSocialIcon } from "@/lib/socials";
import { usePublicCV } from "@/features/public/api/get-public-cv";
import { SKILL_CATEGORY_LABELS } from "@/types/skill-categories";

export default function PublicCVShow() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: cvResponse,
    isLoading,
    error,
  } = usePublicCV({
    slug: slug!,
  });

  const cv = cvResponse;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <MinimalSEO title="CV Tidak Ditemukan" noIndex />
        <h2 className="text-xl font-semibold mb-2">CV Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-4 text-center">
          CV yang Anda cari tidak tersedia atau bersifat privat.
        </p>
        <Button onClick={() => (window.location.href = "/")}>
          Kembali ke Beranda
        </Button>
      </div>
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
    endMonth?: number | null,
    endYear?: number | null,
    isCurrent?: boolean
  ) => {
    const start = `${getLabel(startMonth, MONTH_OPTIONS)} ${startYear}`;
    if (isCurrent) return `${start} - Sekarang`;
    if (!endMonth || !endYear) return start;
    return `${start} - ${getLabel(endMonth, MONTH_OPTIONS)} ${endYear}`;
  };

  const skillCategoryLabels = SKILL_CATEGORY_LABELS[cv.language || "id"];
  const groupedSkills = cv.skills.reduce(
    (acc, skill) => {
      if (!acc.map[skill.skill_category]) {
        acc.map[skill.skill_category] = {
          label:
            skillCategoryLabels[
              skill.skill_category as keyof typeof skillCategoryLabels
            ] || skill.skill_category,
          items: [],
        };
        acc.order.push(skill.skill_category);
      }
      acc.map[skill.skill_category].items.push(skill);
      return acc;
    },
    {
      map: {} as Record<
        string,
        { label: string; items: typeof cv.skills }
      >,
      order: [] as string[],
    }
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <MinimalSEO
        title={`${cv.name} - ${cv.headline}`}
        description={`Lihat CV profesional ${cv.name}. ${cv.headline}`}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Info */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={buildImageUrl(cv.photo)}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {cv.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{cv.name}</h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    {cv.headline}
                  </p>
                </div>
              </div>

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
          {/* Left Column */}
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
                    <div
                      key={index}
                      className={index > 0 ? "border-t pt-6" : ""}
                    >
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
                    <div
                      key={index}
                      className={index > 0 ? "border-t pt-6" : ""}
                    >
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

            {/* Projects */}
            {cv.projects.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Proyek</h3>
                </div>
                <div className="space-y-6">
                  {cv.projects.map((project, index) => (
                    <div
                      key={index}
                      className={index > 0 ? "border-t pt-6" : ""}
                    >
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

            {/* Organizations */}
            {cv.organizations.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Organisasi</h3>
                </div>
                <div className="space-y-6">
                  {cv.organizations.map((org, index) => (
                    <div
                      key={index}
                      className={index > 0 ? "border-t pt-6" : ""}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {org.organization_name}
                          </h4>
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

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            {cv.skills.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Keahlian</h3>
                </div>
                <div className="space-y-4">
                  {groupedSkills.order.map((categoryKey) => {
                    const group = groupedSkills.map[categoryKey];
                    const skillList = group.items
                      .map(
                        (skill) =>
                          `${skill.name} (${getLabel(
                            skill.level,
                            SKILL_LEVEL_OPTIONS
                          )})`
                      )
                      .join(", ");

                    return (
                      <div key={categoryKey} className="space-y-1">
                        <div className="text-sm font-semibold">
                          {group.label}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {skillList}
                        </p>
                      </div>
                    );
                  })}
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
                    <div
                      key={index}
                      className={index > 0 ? "border-t pt-4" : ""}
                    >
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
                              -{" "}
                              {getLabel(
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
                    <div
                      key={index}
                      className={index > 0 ? "border-t pt-4" : ""}
                    >
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
                      className="flex items-center gap-2 rounded-full border border-border/60 p-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {getSocialIcon(link.platform, "h-5 w-5")}
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-8 pb-4">
          <p>Dibuat dengan KarirKit</p>
        </div>
      </div>
    </div>
  );
}
