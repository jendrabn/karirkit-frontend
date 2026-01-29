import { useState } from "react";
import { dayjs } from "@/lib/date";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Tag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CategoryFormModal } from "./CategoryFormModal";
import {
  CategoryFilterModal,
  type CategoryFilterValues,
} from "./CategoryFilterModal";
import { useBlogCategories } from "../api/get-blog-categories";
import { useDeleteBlogCategory } from "../api/delete-blog-category";
import { useCreateBlogCategory } from "../api/create-blog-category";
import { useUpdateBlogCategory } from "../api/update-blog-category";
import { useMassDeleteBlogCategories } from "../api/mass-delete-blog-categories";
import type { BlogCategory } from "../api/get-blog-categories";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useUrlParams } from "@/hooks/use-url-params";
import { SortableHeader } from "@/components/SortableHeader";
import {
  CategoryColumnToggle,
  type CategoryColumnVisibility,
} from "./CategoryColumnToggle";
import { defaultCategoryColumnVisibility } from "../types/category-column-toggle.constants";

type SortField = "name" | "created_at" | "updated_at" | "blog_count";
type SortOrder = "asc" | "desc";

export const CategoryList = () => {
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
    sort_by: "name" as SortField,
    sort_order: "desc" as SortOrder,
    blog_count_from: "",
    blog_count_to: "",
    created_at_from: "",
    created_at_to: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null,
  );
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<CategoryColumnVisibility>(
      "admin-blog-category-columns",
      defaultCategoryColumnVisibility,
    );

  const { data: categoriesResponse, isLoading } = useBlogCategories({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      blog_count_from: params.blog_count_from
        ? Number(params.blog_count_from)
        : undefined,
      blog_count_to: params.blog_count_to
        ? Number(params.blog_count_to)
        : undefined,
      created_at_from: params.created_at_from || undefined,
      created_at_to: params.created_at_to || undefined,
    },
  });

  const deleteMutation = useDeleteBlogCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Kategori berhasil dihapus");
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      },
    },
  });

  const createMutation = useCreateBlogCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Kategori berhasil ditambahkan");
        setModalOpen(false);
        setEditingCategory(null);
      },
    },
  });

  const updateMutation = useUpdateBlogCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Kategori berhasil diperbarui");
        setModalOpen(false);
        setEditingCategory(null);
      },
    },
  });

  const massDeleteMutation = useMassDeleteBlogCategories({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Kategori terpilih berhasil dihapus");
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

  const categories = categoriesResponse?.items || [];
  const pagination = categoriesResponse?.pagination;
  const totalPages = pagination?.total_pages || 1;

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
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((cat) => cat.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate({ ids: selectedIds });
  };

  const handleOpenModal = (category?: BlogCategory) => {
    setEditingCategory(category || null);
    setModalOpen(true);
  };

  const handleSubmit = (data: { name: string; description: string }) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <>
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, slug, deskripsi..."
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <CategoryColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button size="sm" onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
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
                      categories.length > 0 &&
                      selectedIds.length === categories.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columnVisibility.name && (
                  <TableHead>
                    <SortableHeader field="name" onSort={handleSort}>
                      Nama
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.slug && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Slug
                  </TableHead>
                )}
                {columnVisibility.blog_count && (
                  <TableHead>
                    <SortableHeader field="blog_count" onSort={handleSort}>
                      Blog
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.description && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Deskripsi
                  </TableHead>
                )}
                {columnVisibility.created_at && (
                  <TableHead>
                    <SortableHeader field="created_at" onSort={handleSort}>
                      Dibuat
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.updated_at && (
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
                  <TableCell colSpan={8} className="py-14 text-center">
                    <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Memuat data…
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Tag className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-base font-medium">
                        Tidak ada kategori
                      </p>
                      <p className="text-sm">
                        Mulai buat kategori pertama Anda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <TableRow
                    key={category.id}
                    className={cn(
                      index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      selectedIds.includes(category.id) && "bg-primary/5",
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(category.id)}
                        onCheckedChange={() => handleSelectOne(category.id)}
                      />
                    </TableCell>
                    {columnVisibility.name && (
                      <TableCell className="font-medium whitespace-nowrap">
                        {category.name}
                      </TableCell>
                    )}
                    {columnVisibility.slug && (
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {category.slug}
                      </TableCell>
                    )}
                    {columnVisibility.blog_count && (
                      <TableCell className="text-muted-foreground">
                        {category.blog_count || 0}
                      </TableCell>
                    )}
                    {columnVisibility.description && (
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {category.description || "-"}
                      </TableCell>
                    )}
                    {columnVisibility.created_at && (
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {category.created_at
                          ? dayjs(category.created_at).format(
                              "DD MMM YYYY, HH:mm",
                            )
                          : "-"}
                      </TableCell>
                    )}
                    {columnVisibility.updated_at && (
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {category.updated_at
                          ? dayjs(category.updated_at).format(
                              "DD MMM YYYY, HH:mm",
                            )
                          : "-"}
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenModal(category)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(category.id)}
                            className="text-destructive"
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Menampilkan</span>
            <Select
              value={params.per_page.toString()}
              onValueChange={(value) => {
                setParam("per_page", Number(value), true);
              }}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>dari {pagination?.total_items || 0} data</span>
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
              {params.page} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setParam("page", params.page + 1, false)}
              disabled={params.page === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setParam("page", totalPages, false)}
              disabled={params.page === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={editingCategory}
        onSubmit={handleSubmit}
        error={editingCategory ? updateMutation.error : createMutation.error}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <CategoryFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={{
          blog_count_from: params.blog_count_from || "",
          blog_count_to: params.blog_count_to || "",
          created_at_from: params.created_at_from || "",
          created_at_to: params.created_at_to || "",
        }}
        onApply={(newFilters: CategoryFilterValues) => {
          setParams(
            {
              blog_count_from: newFilters.blog_count_from || "",
              blog_count_to: newFilters.blog_count_to || "",
              created_at_from: newFilters.created_at_from || "",
              created_at_to: newFilters.created_at_to || "",
            },
            true,
          );
          setFilterModalOpen(false);
        }}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kategori akan dihapus secara
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
              Hapus {selectedIds.length} Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua kategori yang dipilih
              akan dihapus secara permanen.
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
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
