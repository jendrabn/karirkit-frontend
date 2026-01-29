import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Calendar,
  Briefcase,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
  Copy,
  Check,
  Share2,
  Globe,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
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
import { InfoItem, ContactItem, RichText } from "@/components/ui/display-info";
import { MinimalSEO } from "@/components/MinimalSEO";
import { usePortfolio } from "@/features/portfolios/api/get-portfolio";
import { useDeletePortfolio } from "@/features/portfolios/api/delete-portfolio";
import { projectTypeLabels } from "@/types/portfolio";
import { toast } from "sonner";
import { buildImageUrl } from "@/lib/utils";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { useAuth } from "@/contexts/AuthContext";
import { formatDateTime } from "@/lib/date";

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const portfolio = portfolioResponse;
  const username = user?.username;

  const publicPortfolioUrl = username
    ? env.APP_URL + paths.publicPortfolio.detail.getHref(username, portfolio?.id || "")
    : "";

  const nextMedia = () => {
    if (!portfolio) return;
    setCurrentMediaIndex((prev) =>
      prev === portfolio.medias.length - 1 ? 0 : prev + 1,
    );
  };

  const prevMedia = () => {
    if (!portfolio) return;
    setCurrentMediaIndex((prev) =>
      prev === 0 ? portfolio.medias.length - 1 : prev - 1,
    );
  };

  const handleCopyLink = () => {
    if (!publicPortfolioUrl) {
      toast.error("Link portfolio belum tersedia");
      return;
    }

    navigator.clipboard.writeText(publicPortfolioUrl);
    setCopied(true);
    toast.success("Link portfolio berhasil disalin");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!publicPortfolioUrl) {
      toast.error("Link portfolio belum tersedia");
      return;
    }

    if (!navigator.share) {
      handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title: portfolio?.title || "Portfolio",
        text: `Lihat portfolio ${portfolio?.title}`,
        url: publicPortfolioUrl,
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error("Gagal membagikan portfolio");
      }
    }
  };

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
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Portfolio", href: "/portfolios" },
          { label: "Detail Portfolio" },
        ]}
      >
        <MinimalSEO
          title="Memuat Portfolio"
          description="Memuat data portfolio..."
          noIndex={true}
        />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data portfolio...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!portfolio) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Portfolio", href: "/portfolios" },
          { label: "Portfolio Tidak Ditemukan" },
        ]}
      >
        <MinimalSEO
          title="Portfolio Tidak Ditemukan"
          description="Portfolio tidak ditemukan."
          noIndex={true}
        />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-lg font-medium text-muted-foreground">
            Portfolio tidak ditemukan
          </p>
          <Button onClick={() => navigate("/portfolios")}>
            Kembali ke Daftar Portfolio
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Portfolio", href: "/portfolios" },
        { label: "Detail Portfolio" },
      ]}
    >
      <MinimalSEO
        title={portfolio.title}
        description={`Detail proyek: ${portfolio.title}`}
        noIndex={true}
      />
      <PageHeader
        title={portfolio.title}
        subtitle={portfolio.sort_description}
        showBackButton
        backButtonUrl="/portfolios"
      >
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopyLink} className="gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Tersalin
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Salin Link
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Bagikan
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/portfolios/${portfolio.id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Galeri Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video">
                <img
                  src={
                    buildImageUrl(
                      portfolio.medias[currentMediaIndex]?.path || portfolio.cover,
                    )
                  }
                  alt={
                    portfolio.medias[currentMediaIndex]?.caption || portfolio.title
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
                <p className="text-sm text-muted-foreground text-center">
                  {portfolio.medias[currentMediaIndex].caption}
                </p>
              )}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deskripsi Proyek</CardTitle>
            </CardHeader>
            <CardContent>
              <RichText
                content={portfolio.description}
                className="text-sm leading-relaxed"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/5 space-y-6">
          <Card>
            <CardHeader className="space-y-3">
              <CardTitle className="text-lg">Informasi Proyek</CardTitle>
              <Badge variant="secondary" className="text-xs uppercase gap-1">
                <Briefcase className="h-3 w-3" />
                {projectTypeLabels[portfolio.project_type]}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  label="Peran"
                  value={portfolio.role_title}
                  icon={Briefcase}
                />
                <InfoItem
                  label="Industri"
                  value={portfolio.industry}
                  icon={Globe}
                />
                <InfoItem
                  label="Bulan"
                  value={monthNames[portfolio.month - 1]}
                  icon={Calendar}
                />
                <InfoItem
                  label="Tahun"
                  value={portfolio.year}
                  icon={Clock}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tautan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContactItem
                type="url"
                value={portfolio.live_url}
                label="Live Demo"
                icon={ExternalLink}
              />
              <ContactItem
                type="url"
                value={portfolio.repo_url}
                label="Repository"
                icon={Github}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tools & Teknologi</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                label="Dibuat"
                value={formatDateTime(portfolio.created_at)}
                icon={Calendar}
              />
              <InfoItem
                label="Diperbarui"
                value={formatDateTime(portfolio.updated_at)}
                icon={Clock}
              />
            </CardContent>
          </Card>
        </div>
      </div>

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
    </DashboardLayout>
  );
}
