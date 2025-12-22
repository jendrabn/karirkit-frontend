import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
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
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  Copy,
  Crown,
  CheckCircle,
  XCircle,
  FileStack,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { mockTemplates } from "@/data/mockTemplates";
import { type Template, getTemplateTypeLabel } from "@/types/template";
import { TemplateFilterModal } from "@/components/templates/TemplateFilterModal";
import { TemplateColumnToggle } from "@/components/templates/TemplateColumnToggle";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SortField = "created_at" | "updated_at" | "name" | "type";
type SortOrder = "asc" | "desc";

const AdminTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filters, setFilters] = useState<{
    type?: string;
    is_premium?: string;
    is_active?: string;
  }>({});
  const [visibleColumns, setVisibleColumns] = useState({
    preview_image: true,
    type: true,
    name: true,
    is_premium: true,
    is_active: true,
    created_at: true,
  });

  const filteredAndSortedTemplates = useMemo(() => {
    let result = [...templates];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.slug.toLowerCase().includes(query)
      );
    }

    // Filters
    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.is_premium !== undefined && filters.is_premium !== "") {
      result = result.filter(
        (t) => t.is_premium === (filters.is_premium === "true")
      );
    }
    if (filters.is_active !== undefined && filters.is_active !== "") {
      result = result.filter(
        (t) => t.is_active === (filters.is_active === "true")
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
        case "created_at":
        case "updated_at":
          comparison =
            new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [templates, searchQuery, filters, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedTemplates.length / perPage);
  const paginatedTemplates = filteredAndSortedTemplates.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleDelete = (id: number) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      setTemplates(templates.filter((t) => t.id !== templateToDelete));
      toast.success("Template berhasil dihapus");
    }
    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  const handleDuplicate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Math.max(...templates.map((t) => t.id)) + 1,
      name: `${template.name} (Copy)`,
      slug: `${template.slug}-copy`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTemplates([newTemplate, ...templates]);
    toast.success("Template berhasil diduplikasi");
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedTemplates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedTemplates.map((t) => t.id));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = () => {
    setTemplates(templates.filter((t) => !selectedIds.includes(t.id)));
    setSelectedIds([]);
    setBulkDeleteDialogOpen(false);
    toast.success(`${selectedIds.length} template berhasil dihapus`);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
    <DashboardLayout>
      <PageHeader
        title="Template"
        subtitle="Kelola template CV dan Surat Lamaran."
      />

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau slug template..."
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
          <TemplateColumnToggle
            visibleColumns={visibleColumns}
            onToggle={(column) =>
              setVisibleColumns((prev) => ({
                ...prev,
                [column]: !prev[column],
              }))
            }
          />
          <Button size="sm" onClick={() => navigate("/templates/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Template
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      paginatedTemplates.length > 0 &&
                      selectedIds.length === paginatedTemplates.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {visibleColumns.preview_image && (
                  <TableHead className="uppercase text-xs font-medium tracking-wider">
                    Preview
                  </TableHead>
                )}
                {visibleColumns.name && (
                  <TableHead>
                    <SortableHeader field="name">Nama</SortableHeader>
                  </TableHead>
                )}
                {visibleColumns.type && (
                  <TableHead>
                    <SortableHeader field="type">Tipe</SortableHeader>
                  </TableHead>
                )}
                {visibleColumns.is_premium && (
                  <TableHead className="uppercase text-xs font-medium tracking-wider">
                    Premium
                  </TableHead>
                )}
                {visibleColumns.is_active && (
                  <TableHead className="uppercase text-xs font-medium tracking-wider">
                    Status
                  </TableHead>
                )}
                {visibleColumns.created_at && (
                  <TableHead>
                    <SortableHeader field="created_at">Dibuat</SortableHeader>
                  </TableHead>
                )}
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTemplates.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={
                      Object.values(visibleColumns).filter(Boolean).length + 2
                    }
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileStack className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-base font-medium">
                        Tidak ada template
                      </p>
                      <p className="text-sm">
                        Mulai buat template pertama Anda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTemplates.map((template, index) => (
                  <TableRow
                    key={template.id}
                    className={cn(
                      index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      selectedIds.includes(template.id) && "bg-primary/5"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(template.id)}
                        onCheckedChange={() => handleSelectOne(template.id)}
                      />
                    </TableCell>
                    {visibleColumns.preview_image && (
                      <TableCell>
                        {template.preview_image ? (
                          <img
                            src={template.preview_image}
                            alt={template.name}
                            className="w-16 h-20 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-16 h-20 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.name && (
                      <TableCell className="font-medium whitespace-nowrap">
                        {template.name}
                      </TableCell>
                    )}
                    {visibleColumns.type && (
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">
                          {getTemplateTypeLabel(template.type)}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.is_premium && (
                      <TableCell>
                        {template.is_premium ? (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Gratis</Badge>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.is_active && (
                      <TableCell>
                        {template.is_active ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Nonaktif
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.created_at && (
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {format(new Date(template.created_at), "dd MMM yyyy")}
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
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
                              navigate(`/templates/${template.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/templates/${template.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(template)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplikasi
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(template.id)}
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
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Menampilkan</span>
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
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>dari {filteredAndSortedTemplates.length} data</span>
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
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
      </div>

      {/* Filter Modal */}
      <TemplateFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApply={handleApplyFilters}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Template akan dihapus secara
              permanen.
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
              Hapus {selectedIds.length} Template?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua template yang dipilih
              akan dihapus secara permanen.
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
    </DashboardLayout>
  );
};

export default AdminTemplates;
