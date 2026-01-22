import { useState } from "react";
import { useNavigate } from "react-router";
import { dayjs } from "@/lib/date";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  FileStack,
  Crown,
  Loader2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { TemplatesFilterModal } from "./TemplatesFilterModal";
import {
  TemplatesColumnToggle,
  defaultColumnVisibility,
  type ColumnVisibility,
} from "./TemplatesColumnToggle";
import { cn, buildImageUrl } from "@/lib/utils";
import { useTemplates } from "../api/get-templates";
import { useDeleteTemplate } from "../api/delete-template";
import { useMassDeleteTemplates } from "../api/mass-delete-templates";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import { useUrlParams } from "@/hooks/use-url-params";
import { getTemplateTypeLabel } from "@/types/template";
import type { TemplateType, Language } from "@/types/template";
import { SortableHeader } from "@/components/SortableHeader";

type SortField =
  | "created_at"
  | "updated_at"
  | "name"
  | "type"
  | "language"
  | "is_premium";

export const TemplatesList = () => {
  const navigate = useNavigate();

  // Use URL params hook
  const {
    params,
    setParam,
    setParams,
    searchInput,
    handleSearchInput,
    handleSearchSubmit,
  } = useUrlParams({
    page: 1,
    per_page: 10,
    q: "",
    sort_by: "created_at" as SortField,
    sort_order: "desc" as "asc" | "desc",
    type: "",
    language: "",
    is_premium: undefined as boolean | undefined,
    created_at_from: "",
    created_at_to: "",
    updated_at_from: "",
    updated_at_to: "",
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [visibility, setVisibility] = useLocalStorage<ColumnVisibility>(
    "templates-table-columns",
    defaultColumnVisibility,
  );

  const { data: templatesData, isLoading } = useTemplates({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      type: (params.type as TemplateType) || undefined,
      language: (params.language as Language) || undefined,
      is_premium:
        params.is_premium !== undefined
          ? (params.is_premium as any)
          : undefined,
      created_at_from: params.created_at_from || undefined,
      created_at_to: params.created_at_to || undefined,
      updated_at_from: params.updated_at_from || undefined,
      updated_at_to: params.updated_at_to || undefined,
    },
  });

  const deleteTemplateMutation = useDeleteTemplate({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Template berhasil dihapus");
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
      },
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (params.sort_by === field) {
      setParam(
        "sort_order",
        params.sort_order === "asc" ? "desc" : "asc",
        false,
      );
    } else {
      setParams({ sort_by: field, sort_order: "asc" }, false);
    }
  };

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      deleteTemplateMutation.mutate(templateToDelete);
    }
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const massDeleteMutation = useMassDeleteTemplates({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Template terpilih berhasil dihapus");
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

  const handleSelectAll = () => {
    if (selectedIds.length === templates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(templates.map((t) => t.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate(selectedIds);
  };

  const hasActiveFilters =
    params.type ||
    params.language ||
    params.is_premium !== undefined ||
    params.created_at_from ||
    params.created_at_to ||
    params.updated_at_from ||
    params.updated_at_to;

  const templates = templatesData?.items || [];
  const pagination = templatesData?.pagination || {
    page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
  };

  const handleApplyFilters = (newFilters: any) => {
    setParams(
      {
        type: newFilters.type || "",
        language: newFilters.language || "",
        is_premium:
          newFilters.is_premium === undefined
            ? undefined
            : newFilters.is_premium,
        created_at_from: newFilters.created_at_from || "",
        created_at_to: newFilters.created_at_to || "",
        updated_at_from: newFilters.updated_at_from || "",
        updated_at_to: newFilters.updated_at_to || "",
      },
      true,
    );
    setFilterModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, tipe, bahasa, path..."
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyDown={handleSearchSubmit}
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
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setParams(
                  {
                    type: "" as any,
                    language: "" as any,
                    is_premium: undefined,
                    created_at_from: "",
                    created_at_to: "",
                    updated_at_from: "",
                    updated_at_to: "",
                  },
                  true,
                )
              }
              className="text-muted-foreground"
            >
              Reset Filter
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
          <TemplatesColumnToggle
            visibility={visibility}
            onVisibilityChange={setVisibility}
          />
          <Button size="sm" onClick={() => navigate("/admin/templates/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Template
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      templates.length > 0 &&
                      selectedIds.length === templates.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {visibility.preview && (
                  <TableHead className="uppercase text-xs font-medium tracking-wider">
                    Preview
                  </TableHead>
                )}
                {visibility.name && (
                  <TableHead>
                    <SortableHeader field="name" onSort={handleSort}>
                      Nama
                    </SortableHeader>
                  </TableHead>
                )}
                {visibility.type && (
                  <TableHead>
                    <SortableHeader field="type" onSort={handleSort}>
                      Tipe
                    </SortableHeader>
                  </TableHead>
                )}
                {visibility.language && (
                  <TableHead>
                    <SortableHeader field="language" onSort={handleSort}>
                      Bahasa
                    </SortableHeader>
                  </TableHead>
                )}
                {visibility.is_premium && (
                  <TableHead className="uppercase text-xs font-medium tracking-wider">
                    <SortableHeader field="is_premium" onSort={handleSort}>
                      Premium
                    </SortableHeader>
                  </TableHead>
                )}
                {visibility.path && (
                  <TableHead className="uppercase text-xs font-medium tracking-wider">
                    Path
                  </TableHead>
                )}
                {visibility.created_at && (
                  <TableHead>
                    <SortableHeader field="created_at" onSort={handleSort}>
                      Dibuat
                    </SortableHeader>
                  </TableHead>
                )}
                {visibility.updated_at && (
                  <TableHead>
                    <SortableHeader field="updated_at" onSort={handleSort}>
                      Diperbarui
                    </SortableHeader>
                  </TableHead>
                )}
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={12} className="py-14 text-center">
                    <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Memuat data…
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : templates.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={12}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileStack className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-base font-medium">
                        Tidak ada data template
                      </p>
                      <p className="text-sm">
                        Mulai tambahkan template pertama Anda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template, index) => (
                  <TableRow
                    key={template.id}
                    className={cn(
                      index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      selectedIds.includes(template.id) && "bg-primary/5",
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(template.id)}
                        onCheckedChange={() => handleSelectOne(template.id)}
                      />
                    </TableCell>
                    {visibility.preview && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {template.preview ? (
                            <a
                              href={buildImageUrl(template.preview)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={buildImageUrl(template.preview)}
                                alt={template.name}
                                className="w-16 h-20 object-cover rounded border hover:opacity-80 transition-opacity"
                              />
                            </a>
                          ) : (
                            <div className="w-16 h-20 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibility.name && (
                      <TableCell className="font-medium whitespace-nowrap">
                        {template.name}
                      </TableCell>
                    )}
                    {visibility.type && (
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">
                          {getTemplateTypeLabel(template.type)}
                        </Badge>
                      </TableCell>
                    )}
                    {visibility.language && (
                      <TableCell className="whitespace-nowrap uppercase">
                        <Badge variant="secondary">{template.language}</Badge>
                      </TableCell>
                    )}
                    {visibility.is_premium && (
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
                    {visibility.path && (
                      <TableCell className="text-muted-foreground truncate max-w-[200px]">
                        {template.path || "-"}
                      </TableCell>
                    )}
                    {visibility.created_at && (
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {dayjs(template.created_at).format(
                          "DD MMM YYYY, HH:mm",
                        )}
                      </TableCell>
                    )}
                    {visibility.updated_at && (
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {dayjs(template.updated_at).format(
                          "DD MMM YYYY, HH:mm",
                        )}
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
                              navigate(`/admin/templates/${template.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/templates/${template.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
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
        {pagination.total_items > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan</span>
              <Select
                value={String(params.per_page)}
                onValueChange={(val) => {
                  setParam("per_page", Number(val), true);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {[10, 25, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
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
                onClick={() => setParam("page", 1, false)}
                disabled={params.page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", params.page - 1, false)}
                disabled={params.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm">
                {params.page} / {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", params.page + 1, false)}
                disabled={params.page === pagination.total_pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", pagination.total_pages, false)}
                disabled={params.page === pagination.total_pages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <TemplatesFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={{
          type: (params.type as any) || "",
          language: (params.language as any) || "",
          is_premium:
            params.is_premium !== undefined ? params.is_premium : undefined,
          created_at_from: params.created_at_from || "",
          created_at_to: params.created_at_to || "",
          updated_at_from: params.updated_at_from || "",
          updated_at_to: params.updated_at_to || "",
        }}
        onApply={handleApplyFilters}
      />

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
              disabled={deleteTemplateMutation.isPending}
            >
              {deleteTemplateMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus {selectedIds.length} Template
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus template yang dipilih? Tindakan
              ini tidak dapat dibatalkan.
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
    </>
  );
};
