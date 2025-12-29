import { useState } from "react";
import { Briefcase, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useJobs } from "@/features/jobs/api/get-jobs";
import { useJobRoles } from "@/features/jobs/api/get-job-roles";
import { useCities } from "@/features/jobs/api/get-cities";
import type { JobFilters } from "@/types/job";
import { JobCard } from "@/features/jobs/components/JobCard";
import {
  type JobFilterState,
  JobFilterSidebar,
} from "@/features/jobs/components/JobFilterSidebar";
import { JobPagination } from "@/features/jobs/components/JobPagination";
import { JobSearchBar } from "@/features/jobs/components/JobSearchBar";

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
    experience_min: filters.experience_min,
  };

  const { data: jobsData, isLoading: isLoadingJobs } = useJobs({
    params: apiParams,
  });

  const { data: jobRolesData } = useJobRoles({
    params: { per_page: 100 }, // Fetch enough for filter
  });

  const { data: citiesData } = useCities({
    params: { per_page: 100 }, // Fetch enough for filter
  });

  const jobs = jobsData?.items || [];
  const pagination = jobsData?.pagination;
  const totalPages = pagination?.total_pages || 0;

  const handleSearch = () => {
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
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary/10 via-primary/5 to-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm font-medium">Info Lowongan Kerja</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Temukan Karir Impianmu
              </h1>
              <p className="text-muted-foreground text-lg">
                Jelajahi ribuan lowongan pekerjaan dari perusahaan-perusahaan
                terbaik di Indonesia
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <JobSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Job List */}
              <div className="flex-1 order-2 lg:order-1">
                {/* Mobile Filter */}
                <div className="lg:hidden mb-4">
                  <JobFilterSidebar
                    jobRoles={jobRolesData?.items || []}
                    cities={citiesData?.items || []}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>

                {/* Job Cards */}
                {isLoadingJobs ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                  <div className="flex flex-col gap-4">
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
              <div className="w-full lg:w-80 xl:w-96 order-1 lg:order-2">
                <div className="hidden lg:block">
                  <JobFilterSidebar
                    jobRoles={jobRolesData?.items || []}
                    cities={citiesData?.items || []}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
