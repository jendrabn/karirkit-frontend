import { Briefcase } from "lucide-react";
import { Link } from "react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JobCard } from "@/features/jobs/components/job-card";
import { useBookmarks } from "@/features/jobs/hooks/use-bookmarks";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import type { Job } from "@/types/job";
import { MinimalSEO } from "@/components/minimal-seo";

export default function SavedJobs() {
  const { bookmarks, isLoading } = useBookmarks();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MinimalSEO
        title="Lowongan Tersimpan"
        description="Daftar lowongan kerja yang Anda simpan di KarirKit."
        noIndex
      />
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Lowongan Tersimpan</h1>
              <p className="text-muted-foreground">
                Daftar lowongan kerja yang telah Anda simpan.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-[200px] w-full bg-muted animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Belum ada lowongan tersimpan
              </h3>
              <p className="text-muted-foreground mb-6">
                Belum ada lowongan kerja yang Anda simpan. Cari lowongan menarik
                dan klik ikon bookmark untuk menyimpannya di sini.
              </p>
              <Button asChild>
                <Link to={paths.jobs.list.getHref()}>Cari Lowongan</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {bookmarks.map((job: Job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
