import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Download, Loader2, Pencil, Trash2 } from "lucide-react";

import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MinimalSEO } from "@/components/minimal-seo";
import { useCoverLetter } from "@/features/cover-letters/api/get-cover-letter";
import { useDeleteCoverLetter } from "@/features/cover-letters/api/delete-cover-letter";
import { useDownloadCoverLetter } from "@/features/cover-letters/api/download-cover-letter";
import { CoverLetterDetail } from "@/features/cover-letters/components/cover-letter-detail";
import { toast } from "sonner";

const CoverLetterShow = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: letter, isLoading } = useCoverLetter({
    id: id!,
  });

  const deleteMutation = useDeleteCoverLetter({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Surat lamaran berhasil dihapus");
        navigate("/cover-letters");
      },
    },
  });

  const downloadMutation = useDownloadCoverLetter();

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Surat Lamaran", href: "/cover-letters" },
          { label: "Detail Surat Lamaran" },
        ]}
      >
        <MinimalSEO
          title="Memuat Surat Lamaran"
          description="Memuat detail surat lamaran..."
          noIndex={true}
        />
        <PageHeader
          title="Detail Surat Lamaran"
          showBackButton
          backButtonUrl="/cover-letters"
        />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Memuat data...
            </span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!letter) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Surat Lamaran", href: "/cover-letters" },
          { label: "Surat Lamaran Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="Surat Lamaran Tidak Ditemukan"
          description="Surat lamaran tidak ditemukan."
          noIndex={true}
        />
        <PageHeader
          title="Detail Surat Lamaran"
          showBackButton
          backButtonUrl="/cover-letters"
        />
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold mb-2">
            Surat lamaran tidak ditemukan
          </h2>
          <p className="text-muted-foreground mb-4">
            Surat lamaran yang Anda cari tidak tersedia.
          </p>
          <Button onClick={() => navigate("/cover-letters")}>
            Kembali ke Daftar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Surat Lamaran", href: "/cover-letters" },
        { label: letter.subject },
      ]}
    >
      <MinimalSEO
        title={`${letter.subject} - ${letter.company_name}`}
        description={`Detail surat lamaran untuk ${letter.company_name}`}
        noIndex={true}
      />
      <PageHeader title="Surat Lamaran" subtitle={letter.subject} showBackButton backButtonUrl="/cover-letters">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadMutation.mutate({
                id: letter.id,
                format: "docx",
                name: letter.name,
                subject: letter.subject,
              })
            }
            disabled={downloadMutation.isPending}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download Docx
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadMutation.mutate({
                id: letter.id,
                format: "pdf",
                name: letter.name,
                subject: letter.subject,
              })
            }
            disabled={downloadMutation.isPending}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/cover-letters/${id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <CoverLetterDetail letter={letter} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Surat Lamaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus surat lamaran ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(id!)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoadingOverlay
        show={downloadMutation.isPending}
        message="Sedang mengunduh surat lamaran..."
      />
    </DashboardLayout>
  );
};

export default CoverLetterShow;
