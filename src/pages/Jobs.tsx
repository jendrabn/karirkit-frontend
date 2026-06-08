import { Briefcase, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useJobs } from "@/features/jobs/api/get-jobs";
import { useCompaniesList, useJobRolesList, useCitiesList } from "@/lib/jobs";
import type { JobFilters } from "@/types/job";
import { JobCard } from "@/features/jobs/components/JobCard";
import {
  type JobFilterState,
  JobFilterSidebar,
} from "@/features/jobs/components/JobFilterSidebar";
import { JobPagination } from "@/features/jobs/components/JobPagination";
import { useUrlParams } from "@/hooks/use-url-params";
import { SEO } from "@/components/SEO";
import { env } from "@/config/env";
import { PublicPageHero } from "@/components/PublicPageHero";

export default function Jobs() {
  const perPage = 10;

  // Use URL params hook
  const {
    params,
    setParam,
    setParams,
    searchInput,
    handleSearchInput,
    handleSearchSubmit,
  } = useUrlParams<{
    page: number;
    q: string;
    job_type: string;
    work_system: string;
    job_role_id: string;
    city_id: string;
    company_id: string;
    experience_min: number | string;
  }>({
    page: 1,
    q: "",
    job_type: "",
    work_system: "",
    job_role_id: "",
    city_id: "",
    company_id: "",
    experience_min: "",
  });

  // Convert URL params to filter state
  const filters: JobFilterState = {
    job_types: params.job_type
      ? ([params.job_type] as JobFilterState["job_types"])
      : undefined,
    work_systems: params.work_system
      ? ([params.work_system] as JobFilterState["work_systems"])
      : undefined,
    job_role_ids: params.job_role_id ? [params.job_role_id] : undefined,
    city_ids: params.city_id ? [params.city_id] : undefined,
    company_ids: params.company_id ? [params.company_id] : undefined,
    experience_min: params.experience_min
      ? Number(params.experience_min)
      : undefined,
  };

  // Prepare API params from URL params
  const apiParams: JobFilters = {
    page: params.page,
    per_page: perPage,
    q: params.q || undefined,
    job_type: params.job_type
      ? ([params.job_type] as JobFilters["job_type"])
      : undefined,
    work_system: params.work_system
      ? ([params.work_system] as JobFilters["work_system"])
      : undefined,
    job_role_id: params.job_role_id ? [params.job_role_id] : undefined,
    city_id: params.city_id ? [params.city_id] : undefined,
    company_id: params.company_id ? [params.company_id] : undefined,
    experience_min: params.experience_min
      ? Number(params.experience_min)
      : undefined,
  };

  const { data: jobsData, isLoading: isLoadingJobs } = useJobs({
    params: apiParams,
  });

  const { data: companiesData } = useCompaniesList();
  const { data: jobRolesData } = useJobRolesList();
  const { data: citiesData } = useCitiesList();

  const jobs = jobsData?.items || [];
  const pagination = jobsData?.pagination;
  const totalPages = pagination?.total_pages || 0;
  const seoTitle = params.q
    ? `Lowongan Kerja ${params.q}`
    : "Lowongan Kerja Terbaru";
  const seoDescription = params.q
    ? `Temukan lowongan kerja ${params.q} terbaru di Indonesia. Cari posisi, perusahaan, lokasi, dan sistem kerja yang sesuai dengan tujuan karir Anda.`
    : "Temukan lowongan kerja terbaru di Indonesia dari berbagai perusahaan. Cari posisi, lokasi, sistem kerja, dan peluang karir yang sesuai dengan profil Anda.";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Lowongan Kerja KarirKit",
        description: seoDescription,
        url: `${env.APP_URL}/jobs`,
        isPartOf: {
          "@type": "WebSite",
          name: env.APP_NAME,
          url: env.APP_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${env.APP_URL}/jobs?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        },
      },
      {
        "@type": "ItemList",
        name: "Daftar Lowongan Kerja",
        itemListElement: jobs.map((job, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${env.APP_URL}/jobs/${job.slug}`,
          name: `${job.title} di ${job.company?.name}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: env.APP_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Lowongan Kerja",
            item: `${env.APP_URL}/jobs`,
          },
        ],
      },
    ],
  };

  const handleFilterChange = (newFilters: JobFilterState) => {
    const updates: Record<string, string> = {};

    // Convert array filters to single values for URL
    if (newFilters.job_types?.length) {
      updates.job_type = newFilters.job_types[0];
    }
    if (newFilters.work_systems?.length) {
      updates.work_system = newFilters.work_systems[0];
    }
    if (newFilters.job_role_ids?.length) {
      updates.job_role_id = newFilters.job_role_ids[0];
    }
    if (newFilters.city_ids?.length) {
      updates.city_id = newFilters.city_ids[0];
    }
    if (newFilters.company_ids?.length) {
      updates.company_id = newFilters.company_ids[0];
    }
    if (newFilters.experience_min !== undefined) {
      updates.experience_min = String(newFilters.experience_min);
    }

    setParams(updates, true);
  };

  const handleClearFilters = () => {
    setParams(
      {
        job_type: "",
        work_system: "",
        job_role_id: "",
        city_id: "",
        company_id: "",
        experience_min: "",
      },
      true
    );
  };

  const handlePageChange = (page: number) => {
    setParam("page", page, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="lowongan kerja, cari kerja, peluang karir, pekerjaan indonesia, job vacancy, loker terbaru, karir indonesia, kerja remote, kerja hybrid"
        url="/jobs"
        type="website"
        structuredData={structuredData}
      />

      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />

        <main className="flex-1">
          <PublicPageHero
            title="Temukan Karir Impianmu"
            description="Jelajahi ribuan lowongan pekerjaan dari perusahaan-perusahaan terbaik di Indonesia"
            searchId="jobs-search"
            searchPlaceholder="Cari posisi atau perusahaan..."
            searchValue={searchInput}
            onSearchChange={handleSearchInput}
            onSearchSubmit={handleSearchSubmit}
          />

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10">
              {/* Job List */}
              <div className="order-2 lg:order-1 min-w-0">
                {/* Mobile Filter */}
                <div className="lg:hidden mb-4">
                  <JobFilterSidebar
                    jobRoles={jobRolesData || []}
                    cities={citiesData || []}
                    companies={companiesData || []}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>

                {/* Results Count */}
                {/* {!isLoadingJobs && jobs.length > 0 && (
                  <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>
                      Menampilkan{" "}
                      <span className="font-semibold text-foreground">
                        {jobs.length}
                      </span>{" "}
                      dari{" "}
                      <span className="font-semibold text-foreground">
                        {pagination?.total_items || 0}
                      </span>{" "}
                      lowongan kerja
                    </span>
                  </div>
                )} */}

                {/* Job Cards */}
                {isLoadingJobs ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                      <p className="text-muted-foreground">
                        Memuat lowongan kerja...
                      </p>
                    </div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-20">
                    <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Tidak ada lowongan ditemukan
                    </h3>
                    <p className="text-muted-foreground">
                      Coba ubah filter atau kata kunci pencarian Anda
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!isLoadingJobs && jobs.length > 0 && totalPages > 1 && (
                  <div className="mt-8">
                    <JobPagination
                      currentPage={params.page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>

              {/* Filter Sidebar - Desktop */}
              <aside className="order-1 lg:order-2 w-full lg:sticky lg:top-24 lg:self-start">
                <div className="hidden lg:block">
                  <JobFilterSidebar
                    jobRoles={jobRolesData || []}
                    cities={citiesData || []}
                    companies={companiesData || []}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      </div>
    </>
  );
}
