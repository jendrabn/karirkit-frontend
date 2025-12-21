import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router";
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
  Download,
  FileText,
  Calendar,
  Briefcase,
  Link2,
  Check,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
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
} from "@/components/portfolios/PortfolioFilterModal";
import { mockPortfolios } from "@/data/mockPortfolios";
import { type Portfolio, projectTypeLabels } from "@/types/portfolio";
import { toast } from "sonner";

type SortField = "created_at" | "updated_at" | "year" | "month" | "title";
type SortOrder = "asc" | "desc";

const getProjectTypeBadgeVariant = (type: string) => {
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

export default function Portfolios() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<PortfolioFilterValues>({});
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockPortfolios);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(
    null
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedPortfolios = useMemo(() => {
    let result = [...portfolios];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.sort_description.toLowerCase().includes(query) ||
          p.role_title.toLowerCase().includes(query) ||
          p.industry.toLowerCase().includes(query)
      );
    }

    // Filters
    if (filters.project_type) {
      result = result.filter((p) => p.project_type === filters.project_type);
    }
    if (filters.industry) {
      result = result.filter((p) =>
        p.industry.toLowerCase().includes(filters.industry!.toLowerCase())
      );
    }
    if (filters.year) {
      result = result.filter((p) => p.year === filters.year);
    }
    if (filters.month) {
      result = result.filter((p) => p.month === filters.month);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortField === "created_at" || sortField === "updated_at") {
        aVal = new Date(a[sortField]).getTime();
        bVal = new Date(b[sortField]).getTime();
      } else if (sortField === "year" || sortField === "month") {
        aVal = a[sortField];
        bVal = b[sortField];
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [portfolios, searchQuery, filters, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedPortfolios.length / perPage);
  const paginatedPortfolios = filteredAndSortedPortfolios.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleDelete = (id: string) => {
    setPortfolioToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (portfolioToDelete) {
      setPortfolios((prev) => prev.filter((p) => p.id !== portfolioToDelete));
      setDeleteDialogOpen(false);
      setPortfolioToDelete(null);
      toast.success("Portfolio berhasil dihapus");
    }
  };

  const handleDuplicate = (portfolio: Portfolio) => {
    const newPortfolio: Portfolio = {
      ...portfolio,
      id: `portfolio-${Date.now()}`,
      title: `${portfolio.title} (Copy)`,
      slug: `${portfolio.slug}-copy-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPortfolios((prev) => [newPortfolio, ...prev]);
    toast.success("Portfolio berhasil diduplikasi");
  };

  const handleDownload = (id: string, format: "docx" | "pdf") => {
    if (format === "pdf") {
      toast.info("Fitur download PDF akan segera hadir");
      return;
    }
    toast.success(
      `Mengunduh portfolio dalam format ${format.toUpperCase()}...`
    );
  };

  // Mock username - in real app, get from auth context
  const username = "johndoe";
  const publicPortfolioUrl = `${window.location.origin}/me/${username}`;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicPortfolioUrl);
    setCopied(true);
    toast.success("Link portfolio berhasil disalin");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Portfolio"
        subtitle="Kelola dan tampilkan proyek-proyek terbaik Anda."
      />

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
          {/* Sort */}
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
      {paginatedPortfolios.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-16 text-center">
          <div className="flex flex-col items-center gap-2">
            <Briefcase className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-foreground">
              Tidak ada portfolio
            </p>
            <p className="text-sm text-muted-foreground">
              Mulai tambahkan portfolio pertama Anda
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate("/portfolios/create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Portfolio
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPortfolios.map((portfolio) => (
            <Card
              key={portfolio.id}
              className="group overflow-hidden border border-border/60 hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={portfolio.cover}
                  alt={portfolio.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(portfolio)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplikat
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDownload(portfolio.id, "docx")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Download DOCX
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled
                        className="text-muted-foreground"
                        onClick={() => handleDownload(portfolio.id, "pdf")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px] px-1"
                        >
                          Soon
                        </Badge>
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
                <div className="absolute top-2 left-2">
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
      {filteredAndSortedPortfolios.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tampilkan</span>
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
              dari {filteredAndSortedPortfolios.length} portfolio
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
    </DashboardLayout>
  );
}
