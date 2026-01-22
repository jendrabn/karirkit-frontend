import { useState } from "react";
import { dayjs } from "@/lib/date";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Tag as TagIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
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
import { TagModal } from "./TagModal";
import { TagFilterModal, type TagFilterValues } from "./TagFilterModal";
import { useBlogTags } from "../api/get-blog-tags";
import { useDeleteBlogTag } from "../api/delete-blog-tag";
import { useCreateBlogTag } from "../api/create-blog-tag";
import { useUpdateBlogTag } from "../api/update-blog-tag";
import { useMassDeleteBlogTags } from "../api/mass-delete-blog-tags";
import type { BlogTag } from "../api/get-blog-tags";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useUrlParams } from "@/hooks/use-url-params";
import {
  TagColumnToggle,
  defaultTagColumnVisibility,
  type TagColumnVisibility,
} from "./TagColumnToggle";
import { cn } from "@/lib/utils";
import { SortableHeader } from "@/components/SortableHeader";

type SortField = "name" | "created_at" | "updated_at" | "blog_count";
type SortOrder = "asc" | "desc";

export const TagList = () => {
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
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<TagColumnVisibility>(
      "admin-blog-tag-columns",
      defaultTagColumnVisibility,
    );

  const { data: tagsData, isLoading } = useBlogTags({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
      sort_by: params.sort_by || undefined,
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

  const tags = tagsData?.items || [];
  const pagination = tagsData?.pagination || {
    page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
  };
  const totalPages = pagination?.total_pages || 1;

  const deleteMutation = useDeleteBlogTag({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Tag berhasil dihapus");
        setDeleteDialogOpen(false);
        setTagToDelete(null);
      },
    },
  });

  const createMutation = useCreateBlogTag({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Tag berhasil ditambahkan");
        setModalOpen(false);
        setEditingTag(null);
      },
    },
  });

  const updateMutation = useUpdateBlogTag({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Tag berhasil diperbarui");
        setModalOpen(false);
        setEditingTag(null);
      },
    },
  });

  const massDeleteMutation = useMassDeleteBlogTags({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Tag terpilih berhasil dihapus");
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

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
    setTagToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tagToDelete) {
      deleteMutation.mutate(tagToDelete);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tags.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tags.map((tag) => tag.id));
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

  const handleOpenModal = (tag?: BlogTag) => {
    setEditingTag(tag || null);
    setModalOpen(true);
  };

  const handleSubmit = (data: { name: string }) => {
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data });
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
            placeholder="Cari nama atau slug..."
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
          <TagColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button size="sm" onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tag
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
                      tags.length > 0 && selectedIds.length === tags.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columnVisibility.name && (
                  <TableHead>
                    <SortableHeader field="name" onSort={handleSort}>
                      Nama Tag
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
                  <TableCell colSpan={7} className="py-14 text-center">
                    <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Memuat data…
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tags.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <TagIcon className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-base font-medium">Tidak ada tag</p>
                      <p className="text-sm">Mulai buat tag pertama Anda</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag, index) => (
                  <TableRow
                    key={tag.id}
                    className={cn(
                      index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      selectedIds.includes(tag.id) && "bg-primary/5",
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(tag.id)}
                        onCheckedChange={() => handleSelectOne(tag.id)}
                      />
                    </TableCell>
                    {columnVisibility.name && (
                      <TableCell className="font-medium">{tag.name}</TableCell>
                    )}
                    {columnVisibility.slug && (
                      <TableCell className="text-muted-foreground">
                        {tag.slug}
                      </TableCell>
                    )}
                    {columnVisibility.blog_count && (
                      <TableCell className="text-muted-foreground">
                        {tag.blog_count || 0}
                      </TableCell>
                    )}
                    {columnVisibility.created_at && (
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {tag.created_at
                          ? dayjs(tag.created_at).format("DD MMM YYYY, HH:mm")
                          : "-"}
                      </TableCell>
                    )}
                    {columnVisibility.updated_at && (
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {tag.updated_at
                          ? dayjs(tag.updated_at).format("DD MMM YYYY, HH:mm")
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
                            onClick={() => handleOpenModal(tag)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(tag.id)}
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
              {params.page} / {totalPages}
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

      <TagModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tag={editingTag}
        onSubmit={handleSubmit}
        error={editingTag ? updateMutation.error : createMutation.error}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <TagFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={{
          blog_count_from: params.blog_count_from || "",
          blog_count_to: params.blog_count_to || "",
          created_at_from: params.created_at_from || "",
          created_at_to: params.created_at_to || "",
        }}
        onApply={(newFilters: TagFilterValues) => {
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
            <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Tag akan dihapus secara
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
            <AlertDialogTitle>Hapus {selectedIds.length} Tag?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua tag yang dipilih akan
              dihapus secara permanen.
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
