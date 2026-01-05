import { useState } from "react";
import { Briefcase, Loader2, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useJobs } from "@/features/jobs/api/get-jobs";
import { useCompaniesList, useJobRolesList, useCitiesList } from "@/lib/jobs";
import type { JobFilters } from "@/types/job";
import { JobCard } from "@/features/jobs/components/JobCard";
import {
  type JobFilterState,
  JobFilterSidebar,
} from "@/features/jobs/components/JobFilterSidebar";
import { JobPagination } from "@/features/jobs/components/JobPagination";

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [filters, setFilters] = useState<JobFilterState>({});
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  // Prepare API params from UI state
  const apiParams: JobFilters = {
    page: currentPage,
    per_page: perPage,
    q: appliedSearch || undefined,
    job_type: filters.job_types,
    work_system: filters.work_systems,
    job_role_id: filters.job_role_ids,
    city_id: filters.city_ids,
    company_id: filters.company_ids,
    experience_min: filters.experience_min,
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: JobFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Pattern */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* Background with hexagon pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="hexagon-pattern"
                    width="56"
                    height="100"
                    patternUnits="userSpaceOnUse"
                    patternTransform="scale(0.5)"
                  >
                    <path
                      d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <path
                      d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
              </svg>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Briefcase className="h-4 w-4" />
                Info Lowongan Kerja
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Temukan Karir Impianmu
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                Jelajahi ribuan lowongan pekerjaan dari perusahaan-perusahaan
                terbaik di Indonesia
              </p>
              <div className="max-w-xl mx-auto pt-6">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 pointer-events-none" />
                    <Input
                      placeholder="Cari posisi atau perusahaan..."
                      className="w-full pl-14 pr-5 h-14 text-base bg-background border-2 rounded-full focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm hover:shadow-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

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
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!isLoadingJobs && jobs.length > 0 && totalPages > 1 && (
                  <div className="mt-8">
                    <JobPagination
                      currentPage={currentPage}
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
  );
}
