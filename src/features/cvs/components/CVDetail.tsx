import {
  Award,
  Briefcase,
  Eye,
  Globe,
  GraduationCap,
  Layers,
  Link2 as LinkIcon,
  Lock,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";

import type { CV, Skill } from "@/features/cvs/api/get-cvs";
import {
  DEGREE_OPTIONS,
  JOB_TYPE_OPTIONS,
  MONTH_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
} from "@/types/cv";
import { SKILL_CATEGORY_LABELS } from "@/types/skill-categories";
import { dayjs } from "@/lib/date";
import { buildImageUrl, cn } from "@/lib/utils";
import { getSocialIcon } from "@/lib/socials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SkillGroup = {
  label: string;
  items: Skill[];
};

type CVDetailProps = {
  cv: CV;
  className?: string;
  showMeta?: boolean;
  showPublicUrl?: boolean;
  publicUrlBase?: string;
};

const getLabel = (
  value: string | number,
  options: { value: string | number; label: string }[]
) => {
  return options.find((option) => option.value === value)?.label || value;
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

const renderDescription = (value?: string | null) => {
  if (!value) return null;
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return <p className="mt-3 text-sm text-muted-foreground">{value}</p>;
  }

  return (
    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
      {lines.map((line, index) => (
        <li key={`${line}-${index}`}>{line}</li>
      ))}
    </ul>
  );
};

const groupSkills = (skills: Skill[], language: CV["language"]) => {
  const labels = SKILL_CATEGORY_LABELS[language || "id"];

  return skills.reduce(
    (acc, skill) => {
      if (!acc.map[skill.skill_category]) {
        acc.map[skill.skill_category] = {
          label:
            labels[skill.skill_category as keyof typeof labels] ||
            skill.skill_category,
          items: [],
        };
        acc.order.push(skill.skill_category);
      }

      acc.map[skill.skill_category].items.push(skill);
      return acc;
    },
    {
      map: {} as Record<string, SkillGroup>,
      order: [] as string[],
    }
  );
};

export function CVDetail({
  cv,
  className,
  showMeta = false,
  showPublicUrl = false,
  publicUrlBase,
}: CVDetailProps) {
  const groupedSkills = groupSkills(cv.skills, cv.language);

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="relative overflow-hidden border border-border/60 bg-gradient-to-br from-primary/5 via-background to-muted/30 p-6">
        <div className="absolute -right-16 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row">
          <Avatar className="h-24 w-24 border border-border/60">
            <AvatarImage
              src={buildImageUrl(cv.photo)}
              alt={`Foto ${cv.name}`}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {cv.name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {cv.name}
              </h1>
              <p className="text-base text-muted-foreground">{cv.headline}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {cv.email && (
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {cv.email}
                </span>
              )}
              {cv.phone && (
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {cv.phone}
                </span>
              )}
              {cv.address && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {cv.address}
                </span>
              )}
            </div>
          </div>
        </div>

        {cv.about && (
          <>
            <Separator className="my-6" />
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {cv.about}
            </p>
          </>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {cv.experiences.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Pengalaman Kerja</h2>
              </div>
              <div className="mt-4 space-y-6">
                {cv.experiences.map((exp, index) => (
                  <div
                    key={`${exp.job_title}-${index}`}
                    className={
                      index > 0 ? "border-t border-border/60 pt-5" : ""
                    }
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{exp.job_title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exp.company_name}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {getLabel(exp.job_type, JOB_TYPE_OPTIONS)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {exp.company_location} -{" "}
                      {formatPeriod(
                        exp.start_month,
                        exp.start_year,
                        exp.end_month,
                        exp.end_year,
                        exp.is_current
                      )}
                    </p>
                    {renderDescription(exp.description)}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {cv.educations.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Pendidikan</h2>
              </div>
              <div className="mt-4 space-y-6">
                {cv.educations.map((edu, index) => (
                  <div
                    key={`${edu.school_name}-${index}`}
                    className={
                      index > 0 ? "border-t border-border/60 pt-5" : ""
                    }
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{edu.school_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getLabel(edu.degree, DEGREE_OPTIONS)}
                          {edu.major ? ` - ${edu.major}` : ""}
                        </p>
                      </div>
                      {edu.gpa && edu.gpa > 0 && (
                        <Badge variant="secondary">IPK: {edu.gpa}</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {edu.school_location} -{" "}
                      {formatPeriod(
                        edu.start_month,
                        edu.start_year,
                        edu.end_month,
                        edu.end_year,
                        edu.is_current
                      )}
                    </p>
                    {renderDescription(edu.description)}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {cv.organizations.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Organisasi</h2>
              </div>
              <div className="mt-4 space-y-6">
                {cv.organizations.map((org, index) => (
                  <div
                    key={`${org.organization_name}-${index}`}
                    className={
                      index > 0 ? "border-t border-border/60 pt-5" : ""
                    }
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{org.organization_name}</h3>
                        <p className="text-sm text-muted-foreground">
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
                    <p className="mt-1 text-xs text-muted-foreground">
                      {org.location ? `${org.location} - ` : ""}
                      {formatPeriod(
                        org.start_month,
                        org.start_year,
                        org.end_month,
                        org.end_year,
                        org.is_current
                      )}
                    </p>
                    {renderDescription(org.description)}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {cv.projects.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Proyek</h2>
              </div>
              <div className="mt-4 space-y-6">
                {cv.projects.map((project, index) => (
                  <div
                    key={`${project.name}-${index}`}
                    className={
                      index > 0 ? "border-t border-border/60 pt-5" : ""
                    }
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge variant="secondary">{project.year}</Badge>
                    </div>
                    {renderDescription(project.description)}
                    {(project.repo_url || project.live_url) && (
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
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
                            className="inline-flex items-center gap-1 text-primary hover:underline"
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
          {cv.skills.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Keahlian</h2>
              </div>
              <div className="mt-4 space-y-4">
                {groupedSkills.order.map((categoryKey) => {
                  const group = groupedSkills.map[categoryKey];
                  return (
                    <div key={categoryKey} className="space-y-2">
                      <div className="text-sm font-semibold text-foreground">
                        {group.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((skill) => (
                          <span
                            key={`${categoryKey}-${skill.name}`}
                            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs"
                          >
                            <span className="font-medium text-foreground">
                              {skill.name}
                            </span>
                            <span className="text-muted-foreground">
                              {getLabel(skill.level, SKILL_LEVEL_OPTIONS)}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {cv.certificates.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Sertifikasi</h2>
              </div>
              <div className="mt-4 space-y-4">
                {cv.certificates.map((cert, index) => (
                  <div
                    key={`${cert.title}-${index}`}
                    className={
                      index > 0 ? "border-t border-border/60 pt-4" : ""
                    }
                  >
                    <h3 className="font-medium">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
                        className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        Lihat Kredensial
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {cv.awards.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Penghargaan</h2>
              </div>
              <div className="mt-4 space-y-4">
                {cv.awards.map((award, index) => (
                  <div
                    key={`${award.title}-${index}`}
                    className={
                      index > 0 ? "border-t border-border/60 pt-4" : ""
                    }
                  >
                    <h3 className="font-medium">{award.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {award.issuer} - {award.year}
                    </p>
                    {award.description && (
                      <p className="text-sm text-muted-foreground">
                        {award.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {cv.social_links.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Media Sosial</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {cv.social_links.map((link, index) => (
                  <a
                    key={`${link.platform}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background p-2 text-foreground hover:border-primary hover:text-primary"
                    aria-label={link.platform}
                    title={link.platform}
                  >
                    {getSocialIcon(link.platform, "h-4 w-4")}
                  </a>
                ))}
              </div>
            </Card>
          )}

          {showMeta && (
            <Card className="p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Informasi
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dibuat</span>
                  <span>
                    {dayjs(cv.created_at).format("DD MMM YYYY HH:mm")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diperbarui</span>
                  <span>
                    {dayjs(cv.updated_at).format("DD MMM YYYY HH:mm")}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Visibilitas</span>
                  <Badge
                    variant={
                      cv.visibility === "public" ? "default" : "secondary"
                    }
                    className="gap-1"
                  >
                    {cv.visibility === "public" ? (
                      <Globe className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    {cv.visibility === "public" ? "Public" : "Private"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dilihat</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span>{cv.views || 0} kali</span>
                  </div>
                </div>
                {showPublicUrl && cv.visibility === "public" && cv.slug && (
                  <div className="pt-2 text-xs text-muted-foreground">
                    <span className="mb-1 block text-[11px] uppercase tracking-[0.2em]">
                      Public URL
                    </span>
                    <a
                      href={`/cv/${cv.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-primary hover:underline"
                    >
                      {publicUrlBase
                        ? `${publicUrlBase}/cv/${cv.slug}`
                        : `/cv/${cv.slug}`}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
