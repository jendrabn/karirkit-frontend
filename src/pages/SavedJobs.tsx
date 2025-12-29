import { Briefcase, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/features/jobs/components/JobCard";
import { useBookmarks } from "@/features/jobs/hooks/use-bookmarks";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SavedJobs() {
  const { bookmarks, clearBookmarks } = useBookmarks();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Pekerjaan Tersimpan</h1>
              <p className="text-muted-foreground">
                Daftar lowongan kerja yang telah Anda simpan.
              </p>
            </div>

            {bookmarks.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Semua
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Semua Bookmark?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan menghapus semua lowongan kerja dari
                      daftar simpan Anda. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearBookmarks}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Hapus Semua
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {bookmarks.length === 0 ? (
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
            <div className="grid gap-4">
              {bookmarks.map((job) => (
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
