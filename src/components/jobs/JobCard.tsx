import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, Building2, GraduationCap, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job, JOB_TYPE_LABELS, WORK_SYSTEM_LABELS, EDUCATION_LEVEL_LABELS } from "@/types/job";
import { toast } from "sonner";

interface JobCardProps {
  job: Job;
}

const formatSalary = (min: number, max: number): string => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)} jt`;
    }
    return num.toLocaleString("id-ID");
  };

  if (min === 0 && max === 0) return "Negotiable";
  if (max === 0) return `Rp ${formatNumber(min)}+`;
  return `Rp ${formatNumber(min)} - ${formatNumber(max)}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  return `${Math.floor(diffDays / 30)} bulan lalu`;
};

export function JobCard({ job }: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark dihapus" : "Lowongan disimpan");
  };

  return (
    <Link to={`/jobs/${job.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4 sm:p-6">
          <div className="flex gap-4">
            {/* Company Logo */}
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg shrink-0">
              <AvatarImage src={job.company.logo} alt={job.company.name} className="object-contain" />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                {job.company.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{job.company.name}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                    {formatDate(job.created_at)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleBookmark}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              {/* Location & Salary */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{job.city.name}</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-foreground">
                  {formatSalary(job.salary_min, job.salary_max)}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge variant="secondary" className="text-xs">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {JOB_TYPE_LABELS[job.job_type]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Building2 className="h-3 w-3 mr-1" />
                  {WORK_SYSTEM_LABELS[job.work_system]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {job.min_years_of_experience === 0 
                    ? "Fresh Graduate" 
                    : `${job.min_years_of_experience}+ tahun`}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {EDUCATION_LEVEL_LABELS[job.education_level]}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
