import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Plus,
  ArrowUpDown,
  Pencil,
  Trash2,
  MoreVertical,
  Hash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
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
import { TagModal } from "@/features/admin/blogs/components/TagModal";
import { type BlogTag } from "@/types/blog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBlogTags } from "@/features/admin/blogs/api/get-blog-tags";
import { useCreateBlogTag } from "@/features/admin/blogs/api/create-blog-tag";
import { useUpdateBlogTag } from "@/features/admin/blogs/api/update-blog-tag";
import { useDeleteBlogTag } from "@/features/admin/blogs/api/delete-blog-tag";
import { useMassDeleteBlogTags } from "@/features/admin/blogs/api/mass-delete-blog-tags";
import { useDebounce } from "@/hooks/use-debounce";

type SortField = "name" | "created_at";
type SortOrder = "asc" | "desc";

const AdminBlogTags = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [sortField, setSortField] = useState<SortField | null>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: tagsData, isLoading } = useBlogTags({
    params: {
      page: currentPage,
      per_page: perPage,
      q: debouncedSearch,
      sort_by: sortField || undefined,
      sort_order: sortOrder,
    },
  });

  const tags = tagsData?.items || [];
  const pagination = tagsData?.pagination || {
    page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
  };

  const createTagMutation = useCreateBlogTag({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Tag berhasil ditambahkan");
        setModalOpen(false);
      },
    },
  });

  const updateTagMutation = useUpdateBlogTag({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Tag berhasil diperbarui");
        setModalOpen(false);
        setEditingTag(null);
      },
    },
  });

  const deleteTagMutation = useDeleteBlogTag({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Tag berhasil dihapus");
        setDeleteDialogOpen(false);
        setTagToDelete(null);
      },
    },
  });

  const massDeleteMutation = useMassDeleteBlogTags({
    mutationConfig: {
      onSuccess: () => {
        toast.success(`${selectedIds.length} tag berhasil dihapus`);
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id: string) => {
    setTagToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tagToDelete) {
      deleteTagMutation.mutate(tagToDelete);
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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate({ ids: selectedIds });
  };

  const handleOpenModal = (tag?: BlogTag) => {
    setEditingTag(tag || null);
    setModalOpen(true);
  };

  const handleSubmit = (data: { name: string; slug: string }) => {
    if (editingTag) {
      updateTagMutation.mutate({ id: editingTag.id, data });
    } else {
      createTagMutation.mutate(data);
    }
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
        title="Tag Blog"
        subtitle="Kelola tag untuk artikel blog Anda."
      />

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau slug..."
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
                <TableHead>
                  <SortableHeader field="name">Nama</SortableHeader>
                </TableHead>
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Slug
                </TableHead>
                <TableHead>
                  <SortableHeader field="created_at">
                    Tanggal Dibuat
                  </SortableHeader>
                </TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : tags.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Hash className="h-10 w-10 text-muted-foreground/50" />
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
                      selectedIds.includes(tag.id) && "bg-primary/5"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(tag.id)}
                        onCheckedChange={() => handleSelectOne(tag.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {tag.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tag.created_at
                        ? format(new Date(tag.created_at), "dd MMM yyyy")
                        : "-"}
                    </TableCell>
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
        {pagination.total_items > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
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
                {currentPage} / {pagination.total_pages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))
                }
                disabled={
                  currentPage === pagination.total_pages ||
                  pagination.total_pages === 0
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(pagination.total_pages)}
                disabled={
                  currentPage === pagination.total_pages ||
                  pagination.total_pages === 0
                }
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tag Modal */}
      <TagModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tag={editingTag}
        onSubmit={handleSubmit}
        isLoading={createTagMutation.isPending || updateTagMutation.isPending}
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
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTagMutation.isPending}
            >
              {deleteTagMutation.isPending ? "Menghapus..." : "Hapus"}
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
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmBulkDelete();
              }}
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
    </DashboardLayout>
  );
};

export default AdminBlogTags;
