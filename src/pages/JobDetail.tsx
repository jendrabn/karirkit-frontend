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
  Loader2,
  Link2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
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
import { paths } from "@/config/paths";
import {
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
  EMPLOYEE_SIZE_LABELS,
} from "@/types/job";
import { toast } from "sonner";
import { useJob } from "@/features/jobs/api/get-job";
import { dayjs } from "@/lib/date";

const formatSalary = (min: number, max: number): string => {
  const formatNumber = (num: number) => num.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  if (min === 0 && max === 0) return "Negotiable";
  if (max === 0) return `Rp ${formatNumber(min)}+`;
  return `Rp ${formatNumber(min)} - Rp ${formatNumber(max)}`;
};

export default function JobDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading, error } = useJob({ slug: slug || "" });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark dihapus" : "Lowongan disimpan");
  };

  const openImagePreview = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImagePreview = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (job?.medias && selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % job.medias.length);
    }
  };

  const prevImage = () => {
    if (job?.medias && selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + job.medias.length) % job.medias.length
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;
    if (e.key === "Escape") closeImagePreview();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  };

  // Add keyboard event listener
  useState(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  });

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
            <Link to={paths.jobs.list.getHref()}>
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
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to={paths.jobs.list.getHref()}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Lowongan
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
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Kuota</p>
                        <p className="font-medium">{job.talent_quota} orang</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Batas Lamaran
                        </p>
                        <p className="font-medium">
                          {dayjs(job.expiration_date).format("D MMMM YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Media */}
              {job.medias && job.medias.length > 0 && (
                <Card className="overflow-hidden">
                  <CardContent className="p-2">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {job.medias.map((media, index) => (
                        <button
                          key={media.id || media.path}
                          onClick={() => openImagePreview(index)}
                          className="aspect-[4/3] w-full overflow-hidden rounded-lg cursor-pointer transition-all group relative"
                        >
                          <img
                            src={buildImageUrl(media.path)}
                            alt={`Job media ${index + 1}`}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Deskripsi Pekerjaan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
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
                    className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
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
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-1">
                      Kisaran Gaji
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3 text-sm">
                    {job.contact_name && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0" />
                        <span className="truncate">{job.contact_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{job.contact_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{job.contact_phone}</span>
                    </div>
                    {job.job_url && (
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate text-sm"
                        >
                          Link Lowongan
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 rounded-lg shrink-0">
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
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {job.company.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    {job.company.employee_size && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0" />
                        <span>
                          {EMPLOYEE_SIZE_LABELS[job.company.employee_size]}{" "}
                          karyawan
                        </span>
                      </div>
                    )}
                    {job.company.website_url && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a
                          href={job.company.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {job.company.website_url}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Image Preview Modal */}
      {selectedImageIndex !== null && job.medias && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeImagePreview}
        >
          {/* Close Button */}
          <button
            onClick={closeImagePreview}
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10"
            aria-label="Close preview"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {selectedImageIndex + 1} / {job.medias.length}
          </div>

          {/* Navigation Buttons */}
          {job.medias.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white hover:bg-white/10 p-3 rounded-full transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white hover:bg-white/10 p-3 rounded-full transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={buildImageUrl(job.medias[selectedImageIndex].path)}
            alt={`Job media ${selectedImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
