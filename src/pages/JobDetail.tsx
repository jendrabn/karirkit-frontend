import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  Clock,
  Briefcase,
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
  MapPin,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { MinimalSEO } from "@/components/MinimalSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShareMenu } from "@/features/jobs/components/ShareMenu";
import { buildImageUrl } from "@/lib/utils";
import { paths } from "@/config/paths";
import { useBookmarks } from "@/features/jobs/hooks/use-bookmarks";
import {
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
  EMPLOYEE_SIZE_LABELS,
} from "@/types/job";
// import { toast } from "sonner";
import { useJob } from "@/features/jobs/api/get-job";
import { dayjs } from "@/lib/date";
import { RichText } from "@/components/ui/display-info";

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const employmentTypeMap = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
  freelance: "CONTRACTOR",
} as const;

const headerLogoWrapperClassName =
  "w-14 shrink-0 sm:w-16 md:w-20 lg:w-20";
const headerLogoImageClassName = "h-auto w-full object-contain";

const companyLogoWrapperClassName =
  "w-10 shrink-0 sm:w-12 md:w-12";
const companyLogoImageClassName = "h-auto w-full object-contain";
const wrapValueClassName =
  "whitespace-normal break-words [overflow-wrap:anywhere] leading-snug";

const formatSalary = (min: number, max: number): string => {
  const formatNumber = (num: number) =>
    num.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  if (min === 0 && max === 0) return "Negotiable";
  if (max === 0) return `Rp ${formatNumber(min)}+`;
  return `Rp ${formatNumber(min)} - Rp ${formatNumber(max)}`;
};

export default function JobDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading, error } = useJob({ slug: slug || "" });
  const { isBookmarked, toggleBookmark, isToggling } = useBookmarks();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handleBookmark = () => {
    if (job) {
      toggleBookmark(job);
    }
  };

  // Check if saved via direct property or bookmarks list
  const bookmarked = job?.is_saved || (job && isBookmarked(job.id));

  const openImagePreview = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImagePreview = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    if (job?.medias && selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % job.medias.length);
    }
  }, [job, selectedImageIndex]);

  const prevImage = useCallback(() => {
    if (job?.medias && selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + job.medias.length) % job.medias.length
      );
    }
  }, [job, selectedImageIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;
    if (e.key === "Escape") closeImagePreview();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  }, [closeImagePreview, nextImage, prevImage, selectedImageIndex]);

  // Add keyboard event listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

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
        <MinimalSEO
          title="Lowongan Tidak Ditemukan"
          description="Lowongan kerja yang Anda cari tidak tersedia atau telah ditutup."
          noIndex
        />
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
  const jobDescription = stripHtml(job.description);
  const companyName = job.company?.name || "Perusahaan";
  const jobLocationLabel = job.city
    ? `${job.city.name}${
        job.city.province?.name ? `, ${job.city.province.name}` : ""
      }`
    : "Indonesia";
  const locationText = job.city
    ? `${job.city.name}, ${job.city.province?.name || "Indonesia"}`
    : "Indonesia";
  const seoDescription = `${job.title} di ${companyName}, ${locationText}. ${
    jobDescription ||
    "Lihat detail pekerjaan, persyaratan, lokasi, sistem kerja, dan cara melamar."
  }`;
  const companyLogo = job.company?.logo ? buildImageUrl(job.company.logo) : undefined;
  const salaryMin = job.salary_min ?? undefined;
  const salaryMax = job.salary_max ?? undefined;
  const salaryLabel =
    job.salary_min == null && job.salary_max == null
      ? "-"
      : formatSalary(job.salary_min ?? 0, job.salary_max ?? 0);
  const jobInfoItems = [
    {
      key: "job-type",
      icon: Briefcase,
      label: "Jenis Pekerjaan",
      value: JOB_TYPE_LABELS[job.job_type],
    },
    {
      key: "work-system",
      icon: Globe,
      label: "Sistem Kerja",
      value: WORK_SYSTEM_LABELS[job.work_system],
    },
    {
      key: "location",
      icon: MapPin,
      label: "Lokasi",
      value: jobLocationLabel,
    },
    {
      key: "experience",
      icon: Clock,
      label: "Pengalaman",
      value:
        job.min_years_of_experience === 0
          ? "Fresh Graduate"
          : `${job.min_years_of_experience}${
              job.max_years_of_experience
                ? `-${job.max_years_of_experience}`
                : "+"
            } tahun`,
    },
    {
      key: "education",
      icon: GraduationCap,
      label: "Pendidikan",
      value: EDUCATION_LEVEL_LABELS[job.education_level],
    },
    {
      key: "quota",
      icon: Users,
      label: "Kuota",
      value: `${job.talent_quota} orang`,
    },
    {
      key: "deadline",
      icon: Calendar,
      label: "Batas Lamaran",
      value: job.expiration_date
        ? dayjs(job.expiration_date).format("D MMMM YYYY")
        : "-",
    },
  ] as const;
  const salaryContactItems = [
    {
      key: "contact-name",
      icon: Users,
      label: "Narahubung",
      value: job.contact_name ?? "-",
      href: undefined,
    },
    {
      key: "contact-email",
      icon: Mail,
      label: "Email",
      value: job.contact_email ?? "-",
      href: undefined,
    },
    {
      key: "contact-phone",
      icon: Phone,
      label: "Telepon",
      value: job.contact_phone ?? "-",
      href: undefined,
    },
    {
      key: "job-url",
      icon: Link2,
      label: "Link Lowongan",
      value: job.job_url ?? "-",
      href: job.job_url ?? undefined,
    },
  ] as const;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    validThrough: job.expiration_date || undefined,
    employmentType: employmentTypeMap[job.job_type],
    occupationalCategory: job.job_role?.name,
    industry: job.company?.business_sector || undefined,
    directApply: Boolean(job.job_url),
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      sameAs: job.company?.website_url || undefined,
      logo: companyLogo,
    },
    jobLocation: job.city
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city.name,
            addressRegion: job.city.province?.name,
            addressCountry: "ID",
          },
        }
      : undefined,
    applicantLocationRequirements:
      job.work_system === "remote"
        ? {
            "@type": "Country",
            name: "Indonesia",
          }
        : undefined,
    baseSalary:
      salaryMin || salaryMax
        ? {
            "@type": "MonetaryAmount",
            currency: "IDR",
            value: {
              "@type": "QuantitativeValue",
              minValue: salaryMin,
              maxValue: salaryMax,
              unitText: "MONTH",
            },
          }
        : undefined,
  };

  return (
    <>
      <SEO
        title={`${job.title} di ${companyName}`}
        description={seoDescription}
        keywords={`${job.title}, ${companyName}, ${job.job_role?.name}, lowongan kerja ${locationText}, ${JOB_TYPE_LABELS[job.job_type]}, ${WORK_SYSTEM_LABELS[job.work_system]}`}
        image={companyLogo}
        imageAlt={`Logo ${companyName}`}
        url={`/jobs/${job.slug}`}
        type="article"
        publishedTime={job.created_at}
        modifiedTime={job.updated_at}
        section="Lowongan Kerja"
        structuredData={structuredData}
      />

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
              {/* Job Header + Details */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3 sm:gap-4">
                        <div
                          className={`${headerLogoWrapperClassName} flex items-center justify-start`}
                        >
                          {companyLogo ? (
                            <img
                              src={companyLogo}
                              alt={companyName}
                              className={headerLogoImageClassName}
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
                              {companyName.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h1 className="break-words text-xl font-bold leading-tight text-foreground sm:text-2xl">
                            {job.title}
                          </h1>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {job.company?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 self-start sm:pt-1 sm:justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleBookmark}
                          disabled={isToggling}
                          aria-label={bookmarked ? "Hapus simpanan" : "Simpan lowongan"}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Bookmark
                            className={`h-4 w-4 ${
                              bookmarked ? "fill-primary text-primary" : ""
                            }`}
                          />
                        </Button>
                        <ShareMenu url={currentUrl} title={job.title} />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {jobInfoItems.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.key}
                            className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/10 p-3.5 sm:p-4"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                                {item.label}
                              </p>
                              <p
                                className={`${wrapValueClassName} text-sm font-medium text-foreground`}
                              >
                                {item.value}
                              </p>
                            </div>
                          </div>
                        );
                      })}
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
                  <RichText
                    content={job.description}
                    className="text-muted-foreground"
                    emptyText="Tidak ada deskripsi pekerjaan."
                  />
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Persyaratan</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichText
                    content={job.requirements}
                    className="text-muted-foreground"
                    emptyText="Tidak ada persyaratan."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary & Contact Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6 text-center">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                      Kisaran Gaji
                    </p>
                    <p className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
                      {salaryLabel}
                    </p>
                  </div>
                  <Separator className="my-5" />
                  <div className="space-y-3 text-sm">
                    {salaryContactItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.key}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                              {item.label}
                            </p>
                            {item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${wrapValueClassName} text-sm text-primary hover:underline`}
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p
                                className={`${wrapValueClassName} text-sm text-foreground`}
                              >
                                {item.value}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={companyLogoWrapperClassName}>
                      {job.company?.logo ? (
                        <img
                          src={buildImageUrl(job.company.logo)}
                          alt={job.company?.name}
                          className={companyLogoImageClassName}
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground">
                          {job.company?.name?.substring(0, 2).toUpperCase() ||
                            "NA"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold leading-tight text-foreground sm:text-[15px]">
                        {job.company?.name ?? "-"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        {job.company?.business_sector ?? "-"}
                      </p>
                    </div>
                  </div>
                  <p className={`${wrapValueClassName} text-sm leading-7 text-foreground`}>
                    {job.company?.description ?? "-"}
                  </p>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <Users className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                          Jumlah Karyawan
                        </p>
                        <p className={`${wrapValueClassName} text-sm text-foreground`}>
                          {job.company?.employee_size
                            ? `${EMPLOYEE_SIZE_LABELS[job.company.employee_size]} karyawan`
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <Link2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                          Website
                        </p>
                        {job.company?.website_url ? (
                          <a
                            href={job.company.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${wrapValueClassName} text-sm text-primary hover:underline`}
                          >
                            {job.company.website_url}
                          </a>
                        ) : (
                          <p className={`${wrapValueClassName} text-sm text-foreground`}>
                            -
                          </p>
                        )}
                      </div>
                    </div>
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
    </>
  );
}
