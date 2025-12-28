import { useState, useEffect } from "react";
import { Briefcase, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JobSearchBar } from "@/components/jobs/JobSearchBar";
import { JobCard } from "@/components/jobs/JobCard";
import {
  JobFilterSidebar,
  type JobFilters,
} from "@/components/jobs/JobFilterSidebar";
import { JobPagination } from "@/components/jobs/JobPagination";
import { getMockJobsResponse, mockJobRoles, mockCities } from "@/data/mockJobs";
import type { Job } from "@/types/job";

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [filters, setFilters] = useState<JobFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const perPage = 10;

  useEffect(() => {
    fetchJobs();
  }, [appliedSearch, filters, currentPage]);

  const fetchJobs = () => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const response = getMockJobsResponse({
        page: currentPage,
        per_page: perPage,
        q: appliedSearch || undefined,
        job_type: filters.job_types?.[0],
        work_system: filters.work_systems?.[0],
        job_role_id: filters.job_role_ids?.[0],
        city_id: filters.city_ids?.[0],
        experience_min: filters.experience_min,
      });

      setJobs(response.data.items);
      setTotalPages(response.data.pagination.total_pages);
      setIsLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: JobFilters) => {
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
                    jobRoles={mockJobRoles}
                    cities={mockCities}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>

                {/* Job Cards */}
                {isLoading ? (
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
                {!isLoading && jobs.length > 0 && totalPages > 1 && (
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
                    jobRoles={mockJobRoles}
                    cities={mockCities}
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
