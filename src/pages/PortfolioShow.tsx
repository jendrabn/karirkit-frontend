import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Briefcase,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { usePortfolio } from "@/features/portfolios/api/get-portfolio";
import { useDeletePortfolio } from "@/features/portfolios/api/delete-portfolio";
import { projectTypeLabels } from "@/types/portfolio";
import { toast } from "sonner";
import { buildImageUrl } from "@/lib/utils";
import { MinimalSEO } from "@/components/MinimalSEO";

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function PortfolioShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: portfolioResponse, isLoading } = usePortfolio({
    id: id!,
  });

  const deleteMutation = useDeletePortfolio({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Portfolio berhasil dihapus");
        navigate("/portfolios");
      },
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <MinimalSEO
          title="Loading..."
          description="Memuat data portfolio..."
          noIndex={true}
        />
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const portfolio = portfolioResponse;

  if (!portfolio) {
    return (
      <DashboardLayout>
        <MinimalSEO
          title="Portfolio Tidak Ditemukan"
          description="Portfolio tidak ditemukan."
          noIndex={true}
        />
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-lg font-medium text-muted-foreground">
            Portfolio tidak ditemukan
          </p>
          <Button className="mt-4" onClick={() => navigate("/portfolios")}>
            Kembali ke Daftar Portfolio
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const nextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === portfolio.medias.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? portfolio.medias.length - 1 : prev - 1
    );
  };

  return (
    <DashboardLayout>
      <MinimalSEO
        title={portfolio.title}
        description={`Detail proyek: ${portfolio.title}`}
        noIndex={true}
      />
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/portfolios")}
          className="gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content - 3/5 */}
        <div className="lg:w-3/5 space-y-6">
          {/* Media Gallery */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={
                  buildImageUrl(portfolio.medias[currentMediaIndex]?.path) ||
                  buildImageUrl(portfolio.cover)
                }
                alt={
                  portfolio.medias[currentMediaIndex]?.caption ||
                  portfolio.title
                }
                className="w-full h-full object-cover"
              />

              {portfolio.medias.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10"
                    onClick={prevMedia}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
                    onClick={nextMedia}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  {/* Media indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {portfolio.medias.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === currentMediaIndex
                            ? "bg-white"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {portfolio.medias[currentMediaIndex]?.caption && (
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground text-center">
                  {portfolio.medias[currentMediaIndex].caption}
                </p>
              </CardContent>
            )}
          </Card>

          {/* Thumbnail Gallery */}
          {portfolio.medias.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {portfolio.medias.map((media, index) => (
                <button
                  key={media.id}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                    index === currentMediaIndex
                      ? "border-primary"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img
                    src={buildImageUrl(media.path)}
                    alt={media.caption}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Proyek</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {portfolio.description.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 2/5 */}
        <div className="lg:w-2/5 space-y-6">
          {/* Header Info */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold">{portfolio.title}</h1>
                  <p className="text-muted-foreground mt-1">
                    {portfolio.sort_description}
                  </p>
                </div>
                <Badge variant="secondary">
                  {projectTypeLabels[portfolio.project_type]}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{portfolio.role_title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {monthNames[portfolio.month - 1]} {portfolio.year}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-sm font-medium">Industri:</span>
                <p className="text-sm text-muted-foreground">
                  {portfolio.industry}
                </p>
              </div>

              {/* Links */}
              <div className="flex gap-2 pt-2">
                {portfolio.live_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(portfolio.live_url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                )}
                {portfolio.repo_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(portfolio.repo_url, "_blank")}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Repository
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tools & Teknologi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {portfolio.tools.map((tool) => (
                  <Badge key={tool.id} variant="secondary">
                    {tool.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/portfolios/${portfolio.id}/edit`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Portfolio
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Portfolio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Portfolio</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus portfolio "{portfolio.title}"?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
