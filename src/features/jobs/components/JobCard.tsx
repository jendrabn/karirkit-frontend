import type { KeyboardEvent, MouseEvent } from "react";
import { useNavigate } from "react-router";
import {
  Bookmark,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { dayjs } from "@/lib/date";
import { buildImageUrl } from "@/lib/utils";
import {
  EDUCATION_LEVEL_LABELS,
  JOB_TYPE_LABELS,
  type Job,
  WORK_SYSTEM_LABELS,
} from "@/types/job";

import { useBookmarks } from "../hooks/use-bookmarks";

interface JobCardProps {
  job: Job;
}

const cardClassName =
  "relative h-full cursor-pointer overflow-hidden border border-border/70 bg-card shadow-sm transition-[box-shadow,border-color,background-color,ring-color] duration-200 hover:border-primary/30 hover:bg-primary/5 hover:ring-1 hover:ring-primary/10 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] dark:hover:bg-primary/10 dark:hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

const badgeBaseClassName = "rounded-md px-2.5 py-1 text-xs font-medium";

const bookmarkButtonBaseClassName =
  "inline-flex h-5 w-5 shrink-0 items-center justify-center p-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50";

const companyLogoWrapClassName =
  "flex w-10 shrink-0 items-center justify-start sm:w-12";

const companyTextClassName = "flex min-w-0 items-center gap-1.5";
const footerMetaClassName =
  "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-none text-muted-foreground";
const footerMetaItemClassName = "flex items-center gap-1.5 leading-none";

export function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark, isToggling } = useBookmarks();
  const bookmarked = job.is_saved || isBookmarked(job.id);
  const jobHref = `/jobs/${job.slug}`;

  const handleBookmark = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(job);
  };

  const handleCardClick = () => {
    navigate(jobHref);
  };

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(jobHref);
    }
  };

  const experienceLabel =
    job.min_years_of_experience === 0
      ? "Fresh Graduate"
      : job.max_years_of_experience
        ? `${job.min_years_of_experience}-${job.max_years_of_experience} Tahun`
        : `${job.min_years_of_experience}+ Tahun`;

  const formatSalary = (min: number, max: number) => {
    const formatCompact = (num: number) => {
      if (num >= 1000000) {
        return `Rp ${(num / 1000000).toLocaleString("id-ID", {
          maximumFractionDigits: 1,
        })}jt`;
      }

      return `Rp ${(num / 1000).toLocaleString("id-ID")}rb`;
    };

    if (min === 0 && max === 0) return "Gaji Dirahasiakan";

    if (max && max !== min) {
      return `${formatCompact(min)} - ${formatCompact(max)}`;
    }

    return `${formatCompact(min)}+`;
  };

  const daysUntilExpiration = dayjs(job.expiration_date).diff(dayjs(), "days");
  const isExpiringSoon = daysUntilExpiration <= 7 && daysUntilExpiration > 0;
  const companyName = job.company?.name || "Perusahaan";
  const companyLogoUrl = job.company?.logo ? buildImageUrl(job.company.logo) : "";

  const jobBadges = [
    {
      key: "job-type",
      variant: "secondary" as const,
      content: JOB_TYPE_LABELS[job.job_type],
    },
    {
      key: "work-system",
      variant: "outline" as const,
      content: WORK_SYSTEM_LABELS[job.work_system],
    },
    {
      key: "role",
      variant: "outline" as const,
      content: job.job_role?.name || "Role",
    },
    {
      key: "experience",
      variant: "outline" as const,
      content: experienceLabel,
    },
    {
      key: "education",
      variant: "outline" as const,
      content: EDUCATION_LEVEL_LABELS[job.education_level],
    },
  ] as const;

  return (
    <Card
      role="link"
      tabIndex={0}
      aria-label={`Lihat detail lowongan ${job.title}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={cardClassName}
    >
      <CardContent className="flex h-full flex-col p-4 sm:p-5">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-2 text-base font-semibold leading-snug text-foreground sm:text-[17px]">
                {job.title}
              </h2>
            </div>

            <button
              type="button"
              className={`${bookmarkButtonBaseClassName} ${
                bookmarked
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={handleBookmark}
              disabled={isToggling}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
              <span className="sr-only">Simpan Lowongan</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {jobBadges.map((badge) => (
              <Badge
                key={badge.key}
                variant={badge.variant}
                className={badgeBaseClassName}
              >
                {badge.content}
              </Badge>
            ))}
            {(job.talent_quota ?? 0) > 0 ? (
              <Badge
                variant="outline"
                className={`${badgeBaseClassName} inline-flex items-center gap-1 border-primary/25 text-primary`}
              >
                <Users className="h-3 w-3" />
                {job.talent_quota} posisi
              </Badge>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <div className={companyLogoWrapClassName}>
              {companyLogoUrl ? (
                <img
                  src={companyLogoUrl}
                  alt={companyName}
                  className="h-auto w-full max-w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                  {companyName.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className={companyTextClassName}>
                <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-medium text-foreground">
                  {companyName}
                </span>
              </div>
              <div className="flex min-w-0 items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{job.city?.name || "Lokasi"}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <div className={footerMetaClassName}>
              <div className={footerMetaItemClassName}>
                <Clock className="h-3.5 w-3.5" />
                <span>{dayjs(job.created_at).fromNow()}</span>
              </div>
              {isExpiringSoon ? (
                <div className={`${footerMetaItemClassName} font-medium text-orange-600 dark:text-orange-400`}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{daysUntilExpiration} hari lagi</span>
                </div>
              ) : null}
            </div>

            <div className="shrink-0 text-right text-[13px] font-semibold leading-none text-primary">
              {formatSalary(job.salary_min || 0, job.salary_max || 0)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
