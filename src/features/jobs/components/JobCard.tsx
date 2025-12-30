import { Link } from "react-router";
import {
  MapPin,
  Briefcase,
  Building2,
  Bookmark,
  Banknote,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type Job, JOB_TYPE_LABELS, WORK_SYSTEM_LABELS } from "@/types/job";
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
      : `${job.min_years_of_experience} Tahun`;

  const formatSalary = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

    if (min === 0 && max === 0) return "Gaji Dirahasiakan";

    // Format compact for millions to save space if needed, but standard is safer for reading
    // Let's try to make it slightly compact if it's in millions
    const formatCompact = (num: number) => {
      if (num >= 1000000) {
        return `Rp ${(num / 1000000).toLocaleString("id-ID", {
          maximumFractionDigits: 1,
        })}jt`;
      }
      return formatter.format(num).replace(",00", "");
    };

    if (max) {
      return `${formatCompact(min)} - ${formatCompact(max)}`;
    }
    return formatCompact(min);
  };

  return (
    <Link to={`/jobs/${job.slug}`} className="block h-full">
      <Card className="group relative h-full overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card/50 hover:bg-card">
        <CardContent className="p-5 flex gap-4 h-full">
          {/* Company Logo */}
          <div className="shrink-0">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border bg-white/50 ring-1 ring-border/50 group-hover:ring-primary/20 transition-all">
              <AvatarImage
                src={job.company.logo}
                alt={job.company.name}
                className="object-contain p-1"
              />
              <AvatarFallback className="rounded-xl bg-primary/5 text-primary font-bold text-lg">
                {job.company.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-2.5">
            {/* Header: Title & Company */}
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1">
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground/70" />
                  <span className="font-medium hover:underline truncate">
                    {job.company.name}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-primary/10 -mt-2 -mr-2 ${
                  bookmarked
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground"
                }`}
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`h-8 w-8 ${bookmarked ? "fill-current" : ""}`}
                />
                <span className="sr-only">Simpan Lowongan</span>
              </Button>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="rounded-md px-2 py-0.5 font-normal text-xs bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 hover:bg-blue-500/20 shadow-none border-blue-200/50 dark:border-blue-800/50"
              >
                {JOB_TYPE_LABELS[job.job_type]}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-md px-2 py-0.5 font-normal text-xs bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 hover:bg-violet-500/20 shadow-none border-violet-200/50 dark:border-violet-800/50"
              >
                {WORK_SYSTEM_LABELS[job.work_system]}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-md px-2 py-0.5 font-normal text-xs text-muted-foreground shadow-none"
              >
                <Briefcase className="w-3 h-3 mr-1" />
                {experienceLabel}
              </Badge>
            </div>

            {/* Footer Row: Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1 pt-2 border-t border-dashed border-border/60">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{job.city.name}</span>
              </div>

              <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <Banknote className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground/60 ml-auto pl-1">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="whitespace-nowrap">
                  {dayjs(job.created_at).fromNow()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
