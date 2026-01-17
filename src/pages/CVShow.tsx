import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Download, Loader2, Pencil, Trash2 } from "lucide-react";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
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
import { MinimalSEO } from "@/components/MinimalSEO";
import { useCV } from "@/features/cvs/api/get-cv";
import { useDeleteCV } from "@/features/cvs/api/delete-cv";
import { useDownloadCV } from "@/features/cvs/api/download-cv";
import { CVDetail } from "@/features/cvs/components/CVDetail";
import { toast } from "sonner";

export default function CVShow() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: cvResponse, isLoading } = useCV({
    id: id!,
  });

  const deleteMutation = useDeleteCV({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV berhasil dihapus");
        navigate("/cvs");
      },
    },
  });
  const downloadMutation = useDownloadCV();

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "CV Saya", href: "/cvs" },
          { label: "Detail CV" },
        ]}
      >
        <MinimalSEO
          title="Loading..."
          description="Memuat data CV..."
          noIndex={true}
        />
        <PageHeader title="Detail CV" showBackButton backButtonUrl="/cvs" />
        <div className="flex items-center justify-center min-h-[50vh]">
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

  const cv = cvResponse;

  if (!cv) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "CV Saya", href: "/cvs" },
          { label: "CV Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="CV Tidak Ditemukan"
          description="CV tidak ditemukan."
          noIndex={true}
        />
        <PageHeader title="Detail CV" showBackButton backButtonUrl="/cvs" />
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold mb-2">CV tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">
            CV yang Anda cari tidak tersedia.
          </p>
          <Button onClick={() => navigate("/cvs")}>Kembali ke Daftar CV</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "CV Saya", href: "/cvs" },
        { label: "Detail CV" },
      ]}
    >
      <MinimalSEO
        title={`${cv.name} - ${cv.headline}`}
        description={`Detail CV dari ${cv.name}`}
        noIndex={true}
      />
      <PageHeader title="Detail CV" showBackButton backButtonUrl="/cvs">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadMutation.mutate({
                id: cv.id,
                format: "docx",
                name: cv.name,
                headline: cv.headline,
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
                id: cv.id,
                format: "pdf",
                name: cv.name,
                headline: cv.headline,
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
            onClick={() => navigate(`/cvs/${id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <CVDetail
        cv={cv}
        showMeta
        showPublicUrl
        publicUrlBase={window.location.origin}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus CV?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus CV ini? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoadingOverlay
        show={downloadMutation.isPending}
        message="Sedang mengunduh CV..."
      />
    </DashboardLayout>
  );
}
