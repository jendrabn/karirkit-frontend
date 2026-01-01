import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  GraduationCap,
  Globe,
  Mail,
  Phone,
  Calendar,
  Users,
  Bookmark,
  List,
  Loader2,
  Link2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ShareMenu } from "@/components/jobs/ShareMenu";
import { buildImageUrl } from "@/lib/utils";
import {
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
  EMPLOYEE_SIZE_LABELS,
} from "@/types/job";
import { toast } from "sonner";
import { useJob } from "@/features/jobs/api/get-job";

const formatSalary = (min: number, max: number): string => {
  const formatNumber = (num: number) => num.toLocaleString("id-ID");
  if (min === 0 && max === 0) return "Negotiable";
  if (max === 0) return `Rp ${formatNumber(min)}+`;
  return `Rp ${formatNumber(min)} - Rp ${formatNumber(max)}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function JobDetail() {
  const { slug } = useParams<{ slug: string }>();
  // Use useJob hook to fetch data
  const { data: job, isLoading, error } = useJob({ slug: slug || "" });
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark dihapus" : "Lowongan disimpan");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Lowongan tidak ditemukan
            </h1>
            <Link to="/jobs">
              <Button>Lihat Semua Lowongan</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/jobs"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <List className="h-4 w-4 mr-2" />
              Semua Daftar Pekerjaan
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16 rounded-lg shrink-0">
                      <AvatarImage
                        src={buildImageUrl(job.company.logo)}
                        alt={job.company.name}
                        className="object-contain"
                      />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-xl">
                        {job.company.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h1 className="text-2xl font-bold mb-1">
                            {job.title}
                          </h1>
                          <p className="text-lg text-muted-foreground mb-3">
                            {job.company.name}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBookmark}
                          >
                            <Bookmark
                              className={`h-4 w-4 mr-2 ${
                                isBookmarked ? "fill-primary text-primary" : ""
                              }`}
                            />
                            {isBookmarked ? "Tersimpan" : "Simpan"}
                          </Button>
                          <ShareMenu url={currentUrl} title={job.title} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {JOB_TYPE_LABELS[job.job_type]}
                        </Badge>
                        <Badge variant="outline">
                          <Building2 className="h-3 w-3 mr-1" />
                          {WORK_SYSTEM_LABELS[job.work_system]}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.city.name}, {job.city.province.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Pengalaman
                        </p>
                        <p className="font-medium">
                          {job.min_years_of_experience === 0
                            ? "Fresh Graduate"
                            : `${job.min_years_of_experience}${
                                job.max_years_of_experience
                                  ? `-${job.max_years_of_experience}`
                                  : "+"
                              } tahun`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Pendidikan
                        </p>
                        <p className="font-medium">
                          {EDUCATION_LEVEL_LABELS[job.education_level]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Kuota</p>
                        <p className="font-medium">{job.talent_quota} orang</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Berakhir
                        </p>
                        <p className="font-medium">
                          {formatDate(job.expiration_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Media */}
              {job.medias?.length > 0 && (
                <Card className="overflow-hidden border-none shadow-lg">
                  <div className="grid gap-2 p-2 sm:grid-cols-2">
                    {job.medias.map((media) => (
                      <div
                        key={media.id || media.path}
                        className="aspect-[4/3] w-full overflow-hidden rounded-md"
                      >
                        <img
                          src={buildImageUrl(media.path)}
                          alt="Job media"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Deskripsi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Persyaratan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary & Contact Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Gaji</p>
                    <p className="text-xl font-bold text-primary">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3 text-sm">
                    {job.contact_name && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{job.contact_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{job.contact_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{job.contact_phone}</span>
                    </div>
                    {job.job_url && (
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
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
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 rounded-lg">
                      <AvatarImage
                        src={buildImageUrl(job.company.logo)}
                        alt={job.company.name}
                        className="object-contain"
                      />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                        {job.company.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{job.company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.company.business_sector}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {job.company.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {EMPLOYEE_SIZE_LABELS[job.company.employee_size]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={job.company.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {job.company.website_url}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
