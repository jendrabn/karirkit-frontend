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
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { ApplicationLetterFilterModal } from "./ApplicationLetterFilterModal";
import type { FilterValues } from "./ApplicationLetterFilterModal";
import {
  ApplicationLetterColumnToggle,
  defaultColumnVisibility,
} from "./ApplicationLetterColumnToggle";
import type { ColumnVisibility } from "./ApplicationLetterColumnToggle";
import { useApplicationLetters } from "../api/get-application-letters";
import { useDeleteApplicationLetter } from "../api/delete-application-letter";
import { useDuplicateApplicationLetter } from "../api/duplicate-application-letter";
import { useMassDeleteApplicationLetters } from "../api/mass-delete-application-letters";
import type { ApplicationLetter } from "../api/get-application-letters";
import { useDownloadApplicationLetter } from "../api/download-application-letter";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "@/types/applicationLetter";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";

type SortField =
  | "application_date"
  | "company_name"
  | "subject"
  | "created_at"
  | "updated_at";
type SortOrder = "asc" | "desc";

export function ApplicationLetterList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  // Use useLocalStorage for column visibility persistence
  const [storedVisibility, setStoredVisibility] =
    useLocalStorage<ColumnVisibility>(
      "application-letters-columns",
      defaultColumnVisibility
    );

  // Merge stored visibility with defaults to handle new columns that might be missing in storage
  const columnVisibility = { ...defaultColumnVisibility, ...storedVisibility };
  const setColumnVisibility = setStoredVisibility;

  const [sortField, setSortField] = useState<SortField>("application_date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // API calls
  const { data: lettersResponse, isLoading } = useApplicationLetters({
    params: {
      page: currentPage,
      per_page: perPage,
      q: searchQuery || undefined,
      sort_by: sortField,
      sort_order: sortOrder,
      company_name: filters.company_name || undefined,
      application_date: filters.dateFrom
        ? dayjs(filters.dateFrom).format("YYYY-MM-DD")
        : undefined,
    },
  });

  const deleteMutation = useDeleteApplicationLetter({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Surat lamaran berhasil dihapus");
        setDeleteDialogOpen(false);
        setLetterToDelete(null);
      },
    },
  });

  const duplicateMutation = useDuplicateApplicationLetter({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("Surat lamaran berhasil diduplikasi");
      },
    },
  });

  const massDeleteMutation = useMassDeleteApplicationLetters({
    mutationConfig: {
      onSuccess: () => {
        toast.success(`${selectedIds.length} surat lamaran berhasil dihapus`);
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

  const letters = lettersResponse?.items || [];
  const pagination = lettersResponse?.pagination;
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
    setLetterToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (letterToDelete) {
      deleteMutation.mutate(letterToDelete);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(letters.map((letter) => letter.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate({ ids: selectedIds });
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id);
  };

  const downloadMutation = useDownloadApplicationLetter();

  const handleDownload = (
    letter: ApplicationLetter,
    format: "docx" | "pdf"
  ) => {
    // Toast removed, using LoadingOverlay instead
    downloadMutation.mutate({ id: letter.id, format });
  };

  const getLabel = (
    value: string,
    options: { value: string; label: string }[]
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
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
            placeholder="Cari nama, perusahaan, subjek, email..."
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
          <ApplicationLetterColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button
            size="sm"
            onClick={() => navigate("/application-letters/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Surat Lamaran
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
                        letters.length > 0 &&
                        selectedIds.length === letters.length
                      }
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                  </TableHead>
                  {columnVisibility.subject && (
                    <TableHead>
                      <SortableHeader field="subject">Subjek</SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.company_name && (
                    <TableHead>
                      <SortableHeader field="company_name">
                        Perusahaan
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.application_date && (
                    <TableHead>
                      <SortableHeader field="application_date">
                        Tanggal
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.language && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Bahasa
                    </TableHead>
                  )}
                  {columnVisibility.name && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Nama Pelamar
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
                  {columnVisibility.applicant_city && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Kota Pelamar
                    </TableHead>
                  )}
                  {columnVisibility.company_city && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Kota Perusahaan
                    </TableHead>
                  )}
                  {columnVisibility.education && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Pendidikan
                    </TableHead>
                  )}
                  {columnVisibility.marital_status && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Status Pernikahan
                    </TableHead>
                  )}
                  {columnVisibility.gender && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Gender
                    </TableHead>
                  )}
                  {columnVisibility.updated_at && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Terakhir Diperbarui
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
                    <TableCell
                      colSpan={14}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-base font-medium">Memuat data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : letters.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={14}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-10 w-10 text-muted-foreground/50" />
                        <p className="text-base font-medium">
                          Tidak ada surat lamaran
                        </p>
                        <p className="text-sm">
                          Mulai buat surat lamaran pertama Anda
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  letters.map((letter: ApplicationLetter, index: number) => (
                    <TableRow
                      key={letter.id}
                      className={cn(
                        index % 2 === 0 ? "bg-background" : "bg-muted/20",
                        selectedIds.includes(letter.id) && "bg-primary/5"
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(letter.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(letter.id, !!checked)
                          }
                        />
                      </TableCell>
                      {columnVisibility.subject && (
                        <TableCell className="max-w-[200px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block truncate font-medium">
                                {letter.subject}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{letter.subject}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      )}
                      {columnVisibility.company_name && (
                        <TableCell>{letter.company_name}</TableCell>
                      )}
                      {columnVisibility.application_date && (
                        <TableCell className="text-muted-foreground">
                          {dayjs(letter.application_date).format("DD MMM YYYY")}
                        </TableCell>
                      )}
                      {columnVisibility.language && (
                        <TableCell>
                          <Badge
                            variant={
                              letter.language === "id" ? "default" : "secondary"
                            }
                          >
                            {letter.language === "id" ? "ID" : "EN"}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.name && (
                        <TableCell>{letter.name}</TableCell>
                      )}
                      {columnVisibility.email && (
                        <TableCell>{letter.email}</TableCell>
                      )}
                      {columnVisibility.phone && (
                        <TableCell>{letter.phone}</TableCell>
                      )}
                      {columnVisibility.applicant_city && (
                        <TableCell>{letter.applicant_city}</TableCell>
                      )}
                      {columnVisibility.company_city && (
                        <TableCell>{letter.company_city}</TableCell>
                      )}
                      {columnVisibility.education && (
                        <TableCell>{letter.education}</TableCell>
                      )}
                      {columnVisibility.marital_status && (
                        <TableCell>
                          {getLabel(
                            letter.marital_status,
                            MARITAL_STATUS_OPTIONS
                          )}
                        </TableCell>
                      )}
                      {columnVisibility.gender && (
                        <TableCell>
                          {getLabel(letter.gender, GENDER_OPTIONS)}
                        </TableCell>
                      )}
                      {columnVisibility.updated_at && (
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {dayjs(letter.updated_at).format("DD MMM YYYY")}
                        </TableCell>
                      )}
                      {columnVisibility.created_at && (
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {dayjs(letter.created_at).format("DD MMM YYYY")}
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
                              onClick={() =>
                                navigate(`/application-letters/${letter.id}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/application-letters/${letter.id}/edit`
                                )
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(letter.id)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplikasi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDownload(letter, "docx")}
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
                              onClick={() => handleDelete(letter.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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
              <span>dari {pagination.total_items} data</span>
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
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <ApplicationLetterFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogTitle>
              Hapus {selectedIds.length} Surat Lamaran
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {selectedIds.length} surat
              lamaran yang dipilih? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Loading Overlay for Download */}
      <LoadingOverlay
        show={downloadMutation.isPending}
        message="Sedang mengunduh surat lamaran..."
      />
    </>
  );
}
