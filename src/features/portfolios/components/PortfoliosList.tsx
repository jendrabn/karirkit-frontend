/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Eye,
  Pencil,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Github,
  MoreVertical,
  Calendar,
  Briefcase,
  Link2,
  Check,
  Loader2,
  FileStack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  PortfolioFilterModal,
  type PortfolioFilterValues,
} from "@/features/portfolios/components/PortfolioFilterModal";
import { usePortfolios } from "@/features/portfolios/api/get-portfolios";
import { useDeletePortfolio } from "@/features/portfolios/api/delete-portfolio";
import { useMassDeletePortfolios } from "@/features/portfolios/api/mass-delete-portfolios";
import { projectTypeLabels } from "@/types/portfolio";
import { toast } from "sonner";
import { buildImageUrl } from "@/lib/utils";
import { paths } from "@/config/paths";
import { env } from "@/config/env";
import { useAuth } from "@/contexts/AuthContext";

type SortField = "created_at" | "updated_at" | "year" | "month" | "title";
type SortOrder = "asc" | "desc";

const getProjectTypeBadgeVariant = (_type: string) => {
  return "secondary"; // Consistent styling for all project types
};

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

const PortfoliosList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<PortfolioFilterValues>({});
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [massDeleteDialogOpen, setMassDeleteDialogOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  // API calls
  const { data: portfoliosResponse, isLoading } = usePortfolios({
    params: {
      page: currentPage,
      per_page: perPage,
      q: searchQuery || undefined,
      sort_by: sortField,
      sort_order: sortOrder,
      project_type: filters.project_type || undefined,
      industry: filters.industry || undefined,
      year: filters.year || undefined,
      month: filters.month || undefined,
    },
  });

  const deleteMutation = useDeletePortfolio({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Portfolio berhasil dihapus");
        setDeleteDialogOpen(false);
        setPortfolioToDelete(null);
      },
    },
  });

  const massDeleteMutation = useMassDeletePortfolios({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Portfolio terpilih berhasil dihapus");
        setMassDeleteDialogOpen(false);
        setSelectedIds([]);
      },
    },
  });

  const portfolios = portfoliosResponse?.items || [];
  const pagination = portfoliosResponse?.pagination;
  const totalPages = pagination?.total_pages || 1;

  const handleDelete = (id: string) => {
    setPortfolioToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (portfolioToDelete) {
      deleteMutation.mutate(portfolioToDelete);
    }
  };

  const confirmMassDelete = () => {
    massDeleteMutation.mutate({ ids: selectedIds });
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(portfolios.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Get username from auth context
  const username = user?.username || "";
  const publicPortfolioUrl =
    env.APP_URL + paths.publicPortfolio.list.getHref(username);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicPortfolioUrl);
    setCopied(true);
    toast.success("Link portfolio berhasil disalin");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Public Portfolio Link */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Portfolio Publik Anda</p>
            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
              {publicPortfolioUrl}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-2"
          >
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(publicPortfolioUrl, "_blank")}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Lihat
          </Button>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul, deskripsi, peran, industri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setMassDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus ({selectedIds.length})
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={
                portfolios.length > 0 &&
                selectedIds.length === portfolios.length
              }
              onCheckedChange={(checked) => handleSelectAll(!!checked)}
              id="select-all"
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Pilih Semua
            </label>
          </div>

          <Select
            value={`${sortField}-${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split("-") as [SortField, SortOrder];
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-auto min-w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Terbaru Dibuat</SelectItem>
              <SelectItem value="created_at-asc">Terlama Dibuat</SelectItem>
              <SelectItem value="updated_at-desc">
                Terbaru Diperbarui
              </SelectItem>
              <SelectItem value="updated_at-asc">Terlama Diperbarui</SelectItem>
              <SelectItem value="year-desc">Tahun (Terbaru)</SelectItem>
              <SelectItem value="year-asc">Tahun (Terlama)</SelectItem>
              <SelectItem value="title-asc">Judul (A-Z)</SelectItem>
              <SelectItem value="title-desc">Judul (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => navigate("/portfolios/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Portfolio
          </Button>
        </div>
      </div>

      {/* Portfolio Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Memuat data…
            </span>
          </div>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <FileStack className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-base font-medium">Tidak ada data portfolio</p>
            <p className="text-sm">Mulai tambahkan portfolio pertama Anda</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card
              key={portfolio.id}
              className="group overflow-hidden border border-border/60 hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={buildImageUrl(portfolio.cover)}
                  alt={portfolio.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedIds.includes(portfolio.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(portfolio.id, !!checked)
                    }
                    className="bg-background/80 border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>

                {/* Action Menu */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => navigate(`/portfolios/${portfolio.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/portfolios/${portfolio.id}/edit`)
                        }
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(portfolio.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Project Type Badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge
                    variant={
                      getProjectTypeBadgeVariant(portfolio.project_type) as any
                    }
                  >
                    {projectTypeLabels[portfolio.project_type]}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {portfolio.sort_description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span className="line-clamp-1">{portfolio.role_title}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {monthNames[portfolio.month - 1]} {portfolio.year}
                  </span>
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-1">
                  {portfolio.tools.slice(0, 4).map((tool) => (
                    <Badge
                      key={tool.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tool.name}
                    </Badge>
                  ))}
                  {portfolio.tools.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{portfolio.tools.length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2">
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
                {!portfolio.live_url && !portfolio.repo_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/portfolios/${portfolio.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Detail
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_items > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Menampilkan</span>
            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              dari {pagination?.total_items || 0} portfolio
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">
              Halaman {currentPage} dari {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <PortfolioFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Portfolio</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus portfolio ini? Tindakan ini
              tidak dapat dibatalkan.
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

      <AlertDialog
        open={massDeleteDialogOpen}
        onOpenChange={setMassDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus {selectedIds.length} Portfolio?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. {selectedIds.length}{" "}
              portfolio yang dipilih akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={massDeleteMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                confirmMassDelete();
              }}
              disabled={massDeleteMutation.isPending}
            >
              {massDeleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PortfoliosList;
