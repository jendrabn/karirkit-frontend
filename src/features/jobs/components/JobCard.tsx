import { Link } from "react-router";
import {
  MapPin,
  Briefcase,
  Building2,
  Bookmark,
  Banknote,
  Clock,
  GraduationCap,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type Job,
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
} from "@/types/job";
import { useBookmarks } from "../hooks/use-bookmarks";
import { dayjs } from "@/lib/date";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(job.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(job);
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <Link to={`/jobs/${job.slug}`} className="block">
        <CardContent className="p-5">
          <div className="space-y-3">
            {/* Header: Badges and Bookmark */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 text-xs font-medium"
                >
                  {JOB_TYPE_LABELS[job.job_type]}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-md px-2 py-0.5 text-xs font-medium"
                >
                  {WORK_SYSTEM_LABELS[job.work_system]}
                </Badge>
                {(job.talent_quota ?? 0) > 0 && (
                  <Badge
                    variant="outline"
                    className="rounded-md px-2 py-0.5 text-xs font-medium text-primary border-primary/30 inline-flex items-center gap-1"
                  >
                    <Users className="h-3 w-3" />
                    {job.talent_quota} posisi
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-full flex-shrink-0 transition-all ${
                  bookmarked
                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`!size-5 ${bookmarked ? "fill-current" : ""}`}
                />
                <span className="sr-only">Simpan Lowongan</span>
              </Button>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold leading-tight hover:text-primary transition-colors line-clamp-2 mb-1.5">
                {job.title}
              </h2>

              {/* Company and Job Role */}
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-medium hover:text-foreground transition-colors">
                    {job.company?.name || "Perusahaan"}
                  </span>
                </div>
                <span className="text-muted-foreground/50">•</span>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{job.job_role?.name || "Role"}</span>
                </div>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-2.5 border-y border-border/50">
              {/* Location */}
              <div className="flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground truncate">
                  {job.city?.name || "Lokasi"}
                </span>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-1.5 text-sm">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground truncate">
                  {experienceLabel}
                </span>
              </div>

              {/* Education */}
              <div className="flex items-center gap-1.5 text-sm col-span-2 sm:col-span-1">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground truncate">
                  {EDUCATION_LEVEL_LABELS[job.education_level]}
                </span>
              </div>
            </div>

            {/* Footer: Salary, Posted Date, and Action */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Left: Salary and Date */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Salary */}
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                  <Banknote className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {formatSalary(job.salary_min || 0, job.salary_max || 0)}
                  </span>
                </div>

                {/* Posted Time */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">
                    {dayjs(job.created_at).fromNow()}
                  </span>
                </div>

                {/* Expiration Warning */}
                {isExpiringSoon && (
                  <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">
                      {daysUntilExpiration} hari lagi
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Action Button */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-primary hover:text-primary hover:bg-primary/10 h-8 px-3"
                asChild
              >
                <Link to={`/jobs/${job.slug}`}>
                  Lihat Detail
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
