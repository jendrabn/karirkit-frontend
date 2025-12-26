/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/static-components */
import { useState } from "react";
import { useNavigate } from "react-router";
import { dayjs } from "@/lib/date";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  User,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { CVFilterModal } from "@/features/cvs/components/CVFilterModal";
import type { FilterValues } from "@/features/cvs/components/CVFilterModal";
import {
  CVColumnToggle,
  defaultColumnVisibility,
} from "@/features/cvs/components/CVColumnToggle";
import type { ColumnVisibility } from "@/features/cvs/components/CVColumnToggle";
import { useCVs } from "@/features/cvs/api/get-cvs";
import { useDeleteCV } from "@/features/cvs/api/delete-cv";
import { useDuplicateCV } from "@/features/cvs/api/duplicate-cv";
import { useDownloadCV } from "@/features/cvs/api/download-cv";
import { useMassDeleteCVs } from "@/features/cvs/api/mass-delete-cvs";
import type { CV } from "@/features/cvs/api/get-cvs";
import { DEGREE_OPTIONS } from "@/types/cv";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";

type SortField = "updated_at" | "name" | "created_at";
type SortOrder = "asc" | "desc";

const CVList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "cv-table-columns",
      defaultColumnVisibility
    );
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // API calls
  const { data: cvsResponse, isLoading } = useCVs({
    params: {
      page: currentPage,
      per_page: perPage,
      q: searchQuery || undefined,
      sort_by: sortField,
      sort_order: sortOrder,
      name: filters.name || undefined,
    },
  });

  const deleteMutation = useDeleteCV({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV berhasil dihapus");
        setDeleteDialogOpen(false);
        setCvToDelete(null);
      },
    },
  });

  const duplicateMutation = useDuplicateCV({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV berhasil diduplikasi");
      },
    },
  });

  const { downloadCV } = useDownloadCV();

  const massDeleteMutation = useMassDeleteCVs({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV terpilih berhasil dihapus");
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

  const cvs = cvsResponse?.items || [];
  const pagination = cvsResponse?.pagination;
  const totalPages = pagination?.total_pages || 1;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id: string) => {
    setCvToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cvToDelete) {
      deleteMutation.mutate(cvToDelete);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === cvs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cvs.map((cv) => cv.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate({ ids: selectedIds });
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id);
  };

  const handleDownload = async (id: string, format: "docx" | "pdf") => {
    try {
      setIsDownloading(true);
      await downloadCV(id, format);
      toast.success(`CV berhasil diunduh dalam format ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Gagal mengunduh CV");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper to get latest experience
  const getLatestExperience = (cv: CV) => {
    if (!cv.experiences || cv.experiences.length === 0) return null;
    return cv.experiences[0];
  };

  // Helper to get latest education
  const getLatestEducation = (cv: CV) => {
    if (!cv.educations || cv.educations.length === 0) return null;
    return cv.educations[0];
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent uppercase text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
    </Button>
  );

  return (
    <>
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, headline, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus ({selectedIds.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <CVColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button size="sm" onClick={() => navigate("/cvs/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Buat CV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        cvs.length > 0 && selectedIds.length === cvs.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {columnVisibility.headline && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Headline / Posisi
                    </TableHead>
                  )}
                  {columnVisibility.about && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Ringkasan
                    </TableHead>
                  )}
                  {columnVisibility.latest_experience && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Pengalaman Terakhir
                    </TableHead>
                  )}
                  {columnVisibility.latest_education && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Pendidikan Terakhir
                    </TableHead>
                  )}
                  {columnVisibility.skills_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Jumlah Skill
                    </TableHead>
                  )}
                  {columnVisibility.language && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Bahasa
                    </TableHead>
                  )}
                  {columnVisibility.name && (
                    <TableHead>
                      <SortableHeader field="name">Nama</SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.email && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Email
                    </TableHead>
                  )}
                  {columnVisibility.phone && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      No. Telepon
                    </TableHead>
                  )}
                  {columnVisibility.address && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Alamat
                    </TableHead>
                  )}
                  {columnVisibility.photo && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Foto
                    </TableHead>
                  )}
                  {columnVisibility.certificates_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Jumlah Sertifikat
                    </TableHead>
                  )}
                  {columnVisibility.awards_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Jumlah Penghargaan
                    </TableHead>
                  )}
                  {columnVisibility.organizations_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Organisasi
                    </TableHead>
                  )}
                  {columnVisibility.updated_at && (
                    <TableHead>
                      <SortableHeader field="updated_at">
                        Terakhir Diperbarui
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.created_at && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Tanggal Dibuat
                    </TableHead>
                  )}
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={16} className="text-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : cvs.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={16}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-10 w-10 text-muted-foreground/50" />
                        <p className="text-base font-medium">Tidak ada CV</p>
                        <p className="text-sm">Mulai buat CV pertama Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  cvs.map((cv, index) => {
                    const latestExp = getLatestExperience(cv);
                    const latestEdu = getLatestEducation(cv);

                    return (
                      <TableRow
                        key={cv.id}
                        className={cn(
                          index % 2 === 0 ? "bg-background" : "bg-muted/20",
                          selectedIds.includes(cv.id) && "bg-primary/5"
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(cv.id)}
                            onCheckedChange={() => handleSelectOne(cv.id)}
                          />
                        </TableCell>
                        {columnVisibility.headline && (
                          <TableCell className="font-medium max-w-[200px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block truncate">
                                  {cv.headline}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{cv.headline}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        )}
                        {columnVisibility.about && (
                          <TableCell className="max-w-[200px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block truncate text-muted-foreground">
                                  {cv.about || "-"}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[300px]">
                                <p>{cv.about || "-"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        )}
                        {columnVisibility.latest_experience && (
                          <TableCell>
                            {latestExp ? (
                              <div className="text-sm">
                                <p className="font-medium truncate max-w-[150px]">
                                  {latestExp.job_title}
                                </p>
                                <p className="text-muted-foreground text-xs truncate max-w-[150px]">
                                  {latestExp.company_name}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                        )}
                        {columnVisibility.latest_education && (
                          <TableCell>
                            {latestEdu ? (
                              <div className="text-sm">
                                <p className="font-medium truncate max-w-[150px]">
                                  {DEGREE_OPTIONS.find(
                                    (d) => d.value === latestEdu.degree
                                  )?.label || latestEdu.degree}
                                </p>
                                <p className="text-muted-foreground text-xs truncate max-w-[150px]">
                                  {latestEdu.school_name}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                        )}
                        {columnVisibility.skills_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.skills?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.language && (
                          <TableCell>
                            <Badge
                              variant={
                                cv.language === "id" ? "default" : "secondary"
                              }
                            >
                              {cv.language === "id" ? "ID" : "EN"}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.name && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={cv.photo} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {cv.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{cv.name}</span>
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.email && (
                          <TableCell>{cv.email}</TableCell>
                        )}
                        {columnVisibility.phone && (
                          <TableCell>{cv.phone}</TableCell>
                        )}
                        {columnVisibility.address && (
                          <TableCell className="max-w-[150px] truncate">
                            {cv.address}
                          </TableCell>
                        )}
                        {columnVisibility.photo && (
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={cv.photo} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                        )}
                        {columnVisibility.certificates_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.certificates?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.awards_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.awards?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.organizations_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.organizations?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.updated_at && (
                          <TableCell className="text-muted-foreground">
                            {dayjs(cv.updated_at).format("DD MMM YYYY")}
                          </TableCell>
                        )}
                        {columnVisibility.created_at && (
                          <TableCell className="text-muted-foreground">
                            {dayjs(cv.created_at).format("DD MMM YYYY")}
                          </TableCell>
                        )}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="z-50 bg-popover"
                            >
                              <DropdownMenuItem
                                onClick={() => navigate(`/cvs/${cv.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/cvs/${cv.id}/edit`)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDuplicate(cv.id)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplikasi
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDownload(cv.id, "docx")}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Docx
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled
                                className="text-muted-foreground"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF (Segera Hadir)
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(cv.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* Pagination */}
        {pagination && pagination.total_items > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan</span>
              <Select
                value={String(perPage)}
                onValueChange={(value) => {
                  setPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>dari {pagination?.total_items || 0} data</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <CVFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus CV</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus CV ini? Tindakan ini tidak dapat
              dibatalkan.
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

      {/* Bulk Delete Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.length} CV</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {selectedIds.length} CV yang
              dipilih? Tindakan ini tidak dapat dibatalkan.
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
                confirmBulkDelete();
              }}
              disabled={massDeleteMutation.isPending}
            >
              {massDeleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Loading Overlay for Download */}
      <LoadingOverlay show={isDownloading} message="Sedang mengunduh CV..." />
    </>
  );
};

export default CVList;
