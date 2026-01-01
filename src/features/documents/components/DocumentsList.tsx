import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileText,
  FileStack,
  Image,
  File,
  MoreVertical,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DocumentFilterModal,
  type DocumentFilterValues,
} from "@/features/documents/components/DocumentFilterModal";
import {
  DocumentUploadModal,
  type CompressionLevel,
} from "@/features/documents/components/DocumentUploadModal";
import {
  DocumentsColumnToggle,
  defaultColumnVisibility,
  type ColumnVisibility,
} from "@/features/documents/components/DocumentsColumnToggle";
import {
  type Document,
  documentTypeLabels,
  type DocumentType,
} from "@/types/document";
import { toast } from "@/components/ui/sonner";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { buildImageUrl, cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useDocuments } from "@/features/documents/api/get-documents";
import { useUploadDocument } from "@/features/documents/api/upload-document";
import { useDeleteDocument } from "@/features/documents/api/delete-document";
import { useMassDeleteDocuments } from "@/features/documents/api/mass-delete-documents";
import { useDownloadDocument } from "@/features/documents/api/download-document";
import { useLocalStorage } from "@/hooks/use-local-storage";

type SortField = "uploaded_at" | "original_name" | "size" | "type";
type SortOrder = "asc" | "desc";

type SortableHeaderProps = {
  field: SortField;
  children: React.ReactNode;
  onSort: (field: SortField) => void;
};

const SortableHeader = ({ field, children, onSort }: SortableHeaderProps) => (
  <Button
    variant="ghost"
    size="sm"
    className="-ml-3 h-8 data-[state=open]:bg-accent uppercase text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground"
    onClick={() => onSort(field)}
  >
    {children}
    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
  </Button>
);

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return <Image className="h-5 w-5 text-primary" />;
  }
  if (mimeType === "application/pdf") {
    return <FileText className="h-5 w-5 text-destructive" />;
  }
  return <File className="h-5 w-5 text-muted-foreground" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function DocumentsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [filters, setFilters] = useState<DocumentFilterValues>({});
  const [sortField, setSortField] = useState<SortField>("uploaded_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [massDeleteDialogOpen, setMassDeleteDialogOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "documents-table-columns",
      defaultColumnVisibility
    );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const effectiveQuery = searchQuery || filters.q || undefined;

  const { data: documentsResponse, isLoading } = useDocuments({
    params: {
      page: currentPage,
      per_page: perPage,
      q: effectiveQuery,
      type: filters.type,
      sort_by: sortField,
      sort_order: sortOrder,
    },
  });

  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument({
    mutationConfig: {
      onSuccess: (_data, id) => {
        toast.success("Dokumen berhasil dihapus");
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
        setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
      },
    },
  });

  const massDeleteMutation = useMassDeleteDocuments({
    mutationConfig: {
      onSuccess: (_data, variables) => {
        toast.success(`${variables.ids.length} dokumen berhasil dihapus`);
        setSelectedIds([]);
        setMassDeleteDialogOpen(false);
      },
    },
  });

  const downloadMutation = useDownloadDocument();

  const documents = documentsResponse?.items || [];
  const pagination = documentsResponse?.pagination;
  const totalPages = pagination?.total_pages || 1;
  const displayPage = Math.min(currentPage, totalPages);

  const activeSelectedIds = useMemo(
    () => selectedIds.filter((id) => documents.some((doc) => doc.id === id)),
    [documents, selectedIds]
  );

  const visibleColumnsCount = useMemo(
    () => Object.values(columnVisibility).filter(Boolean).length,
    [columnVisibility]
  );
  const tableColumnCount = visibleColumnsCount + 2;

  const handleSelectAll = () => {
    if (activeSelectedIds.length === documents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(documents.map((doc) => doc.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleApplyFilters = (nextFilters: DocumentFilterValues) => {
    setFilters(nextFilters);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      deleteMutation.mutate(documentToDelete);
    }
  };

  const handleMassDelete = () => {
    if (activeSelectedIds.length === 0) {
      toast.error("Pilih dokumen yang akan dihapus");
      return;
    }
    setMassDeleteDialogOpen(true);
  };

  const confirmMassDelete = () => {
    if (activeSelectedIds.length === 0) {
      toast.error("Pilih dokumen yang akan dihapus");
      return;
    }
    massDeleteMutation.mutate({ ids: activeSelectedIds });
  };

  const handleUpload = async (
    file: File,
    type: DocumentType,
    compression?: CompressionLevel
  ) => {
    await uploadMutation.mutateAsync({ file, type, compression });
  };

  const handleDownload = (doc: Document) => {
    downloadMutation.mutate({
      id: doc.id,
      originalName: doc.original_name,
    });
  };

  const handlePreview = (doc: Document) => {
    const previewUrl = buildImageUrl(doc.path);
    if (previewUrl) {
      window.open(previewUrl, "_blank");
      toast.info(`Membuka preview ${doc.original_name}`);
    }
  };

  const handleSortField = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <>
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama file..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {activeSelectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleMassDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus ({activeSelectedIds.length})
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
          <DocumentsColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />

          <Button size="sm" onClick={() => setUploadModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Dokumen
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      documents.length > 0 &&
                      activeSelectedIds.length === documents.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columnVisibility.original_name && (
                  <TableHead className="min-w-[250px]">
                    <SortableHeader
                      field="original_name"
                      onSort={handleSortField}
                    >
                      Nama File
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.type && (
                  <TableHead>
                    <SortableHeader field="type" onSort={handleSortField}>
                      Tipe
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.size && (
                  <TableHead>
                    <SortableHeader field="size" onSort={handleSortField}>
                      Ukuran
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.uploaded_at && (
                  <TableHead>
                    <SortableHeader
                      field="uploaded_at"
                      onSort={handleSortField}
                    >
                      Tanggal Upload
                    </SortableHeader>
                  </TableHead>
                )}
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={tableColumnCount}
                    className="h-24 text-center"
                  >
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : documents.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={tableColumnCount}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileStack className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-base font-medium">Tidak ada dokumen</p>
                      <p className="text-sm">
                        Mulai upload dokumen pertama Anda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc, index) => (
                  <TableRow
                    key={doc.id}
                    className={cn(
                      index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      activeSelectedIds.includes(doc.id) && "bg-primary/5"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={activeSelectedIds.includes(doc.id)}
                        onCheckedChange={() => handleSelectOne(doc.id)}
                      />
                    </TableCell>
                    {columnVisibility.original_name && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            {getFileIcon(doc.mime_type)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[200px]">
                              {doc.original_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.mime_type}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.type && (
                      <TableCell>
                        <Badge variant="secondary">
                          {documentTypeLabels[doc.type]}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.size && (
                      <TableCell className="text-muted-foreground">
                        {formatFileSize(doc.size)}
                      </TableCell>
                    )}
                    {columnVisibility.uploaded_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {format(
                          new Date(doc.created_at),
                          "dd MMM yyyy, HH:mm",
                          {
                            locale: id,
                          }
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
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
                          className="w-40 bg-popover z-50"
                        >
                          <DropdownMenuItem onClick={() => handlePreview(doc)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(doc.id)}
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
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.total_items > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Menampilkan</span>
            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurrentPage(1);
                setSelectedIds([]);
              }}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>dari {pagination.total_items} data</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setCurrentPage(1);
                setSelectedIds([]);
              }}
              disabled={displayPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setCurrentPage(Math.max(displayPage - 1, 1));
                setSelectedIds([]);
              }}
              disabled={displayPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">
              {displayPage} / {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setCurrentPage(Math.min(displayPage + 1, totalPages));
                setSelectedIds([]);
              }}
              disabled={displayPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setCurrentPage(totalPages);
                setSelectedIds([]);
              }}
              disabled={displayPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <DocumentFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApply={handleApplyFilters}
      />

      <DocumentUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={handleUpload}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Dokumen</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mass Delete Confirmation */}
      <AlertDialog
        open={massDeleteDialogOpen}
        onOpenChange={setMassDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus {activeSelectedIds.length} Dokumen
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {activeSelectedIds.length}{" "}
              dokumen yang dipilih? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmMassDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

      <LoadingOverlay
        show={downloadMutation.isPending}
        message="Sedang mengunduh dokumen..."
      />
    </>
  );
}
