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
  MoreVertical,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  CheckCircle2,
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
import { BlogStatusModal } from "@/features/admin/blogs/components/BlogStatusModal";
import {
  BlogFilterModal,
  type FilterValues,
} from "@/features/admin/blogs/components/BlogFilterModal";
import {
  BlogColumnToggle,
  type ColumnVisibility,
} from "@/features/admin/blogs/components/BlogColumnToggle";
import { defaultBlogColumnVisibility } from "@/features/admin/blogs/types/blog-column-toggle.constants";
import {
  type Blog,
  type BlogStatus,
  BLOG_STATUS_OPTIONS,
  getStatusBadgeVariant,
} from "@/types/blog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { paths } from "@/config/paths";
import {
  useBlogs,
  type GetBlogsParams,
} from "@/features/admin/blogs/api/get-blogs";
import { useDeleteBlog } from "@/features/admin/blogs/api/delete-blog";
import { useMassDeleteBlogs } from "@/features/admin/blogs/api/mass-delete-blogs";
import { useUpdateBlog } from "@/features/admin/blogs/api/update-blog";
import { useBlogCategories } from "@/features/blogs/api/get-blog-categories";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useUrlParams } from "@/hooks/use-url-params";
import { SortableHeader } from "@/components/SortableHeader";

type SortField =
  | "created_at"
  | "updated_at"
  | "published_at"
  | "views"
  | "title"
  | "read_time";
type SortOrder = "asc" | "desc";

export const BlogsList = () => {
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
    sort_by: "updated_at" as SortField,
    sort_order: "desc" as SortOrder,
    status: "",
    category_id: "",
    user_id: "",
    tag_id: "",
    published_at_from: "",
    published_at_to: "",
    created_at_from: "",
    created_at_to: "",
    read_time_from: "",
    read_time_to: "",
    views_from: "",
    views_to: "",
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "blogs-table-columns",
      defaultBlogColumnVisibility,
    );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [blogToUpdateStatus, setBlogToUpdateStatus] = useState<Blog | null>(
    null,
  );
  const [nextStatus, setNextStatus] = useState<BlogStatus>("draft");

  // Build API params
  const apiParams: GetBlogsParams = {
    page: params.page,
    per_page: params.per_page,
    q: params.q || undefined,
    sort_order: params.sort_order,
    sort_by: params.sort_by || undefined,
    status: params.status as "draft" | "published" | "archived" | undefined,
    category_id: params.category_id || undefined,
    user_id: params.user_id || undefined,
    tag_id: params.tag_id || undefined,
    published_at_from: params.published_at_from || undefined,
    published_at_to: params.published_at_to || undefined,
    created_at_from: params.created_at_from || undefined,
    created_at_to: params.created_at_to || undefined,
    read_time_from: params.read_time_from
      ? Number(params.read_time_from)
      : undefined,
    read_time_to: params.read_time_to ? Number(params.read_time_to) : undefined,
    views_from: params.views_from ? Number(params.views_from) : undefined,
    views_to: params.views_to ? Number(params.views_to) : undefined,
  };

  // Fetch blogs
  const { data: blogsData, isLoading } = useBlogs({ params: apiParams });
  const { data: categoriesData } = useBlogCategories();
  const deleteBlogMutation = useDeleteBlog();
  const updateBlogMutation = useUpdateBlog({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Status blog berhasil diperbarui");
        setStatusDialogOpen(false);
        setBlogToUpdateStatus(null);
      },
    },
  });
  const massDeleteBlogsMutation = useMassDeleteBlogs({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Blog terpilih berhasil dihapus");
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

  const blogs = blogsData?.items || [];
  const totalPages = blogsData?.pagination.total_pages || 0;
  const totalItems = blogsData?.pagination.total_items || 0;

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
    setBlogToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      try {
        await deleteBlogMutation.mutateAsync(blogToDelete);
        setDeleteDialogOpen(false);
        setBlogToDelete(null);
        toast.success("Blog berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus blog");
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === blogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(blogs.map((blog) => blog.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const confirmBulkDelete = () => {
    massDeleteBlogsMutation.mutate({ ids: selectedIds });
  };

  const handleOpenStatusDialog = (blog: Blog) => {
    setBlogToUpdateStatus(blog);
    setNextStatus(blog.status);
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!blogToUpdateStatus) return;

    updateBlogMutation.mutate({
      id: blogToUpdateStatus.id,
      data: {
        title: blogToUpdateStatus.title,
        excerpt: blogToUpdateStatus.excerpt || "",
        content: blogToUpdateStatus.content,
        featured_image: blogToUpdateStatus.featured_image || "",
        status: nextStatus,
        category_id: blogToUpdateStatus.category_id,
        author_id: blogToUpdateStatus.user_id,
        tag_ids: blogToUpdateStatus.tags?.map((tag) => tag.id) || [],
      },
    });
  };

  return (
    <>
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul, slug, excerpt, content, penulis..."
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
          <BlogColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button
            size="sm"
            onClick={() => navigate(paths.admin.blogs.create.getHref())}
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Blog
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        blogs.length > 0 && selectedIds.length === blogs.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {columnVisibility.title && (
                    <TableHead>
                      <SortableHeader field="title" onSort={handleSort}>
                        Judul
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.category && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Kategori
                    </TableHead>
                  )}
                  {columnVisibility.author && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Penulis
                    </TableHead>
                  )}
                  {columnVisibility.status && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Status
                    </TableHead>
                  )}
                  {columnVisibility.views_count && (
                    <TableHead>
                      <SortableHeader field="views" onSort={handleSort}>
                        Views
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.min_read && (
                    <TableHead>
                      <SortableHeader field="read_time" onSort={handleSort}>
                        Waktu Baca
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.published_at && (
                    <TableHead>
                      <SortableHeader field="published_at" onSort={handleSort}>
                        Tanggal Publish
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.slug && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Slug
                    </TableHead>
                  )}
                  {columnVisibility.tags && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Tags
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
                    <TableCell colSpan={14} className="py-14 text-center">
                      <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Memuat data…
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={14}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-10 w-10 text-muted-foreground/50" />
                        <p className="text-base font-medium">Tidak ada blog</p>
                        <p className="text-sm">Mulai buat blog pertama Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog, index) => (
                    <TableRow
                      key={blog.id}
                      className={cn(
                        index % 2 === 0 ? "bg-background" : "bg-muted/20",
                        selectedIds.includes(blog.id) && "bg-primary/5",
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(blog.id)}
                          onCheckedChange={() => handleSelectOne(blog.id)}
                        />
                      </TableCell>
                      {columnVisibility.title && (
                        <TableCell className="font-medium max-w-[250px] whitespace-nowrap">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block truncate">
                                {blog.title}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{blog.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      )}
                      {columnVisibility.category && (
                        <TableCell className="whitespace-nowrap">
                          {blog.category ? (
                            <Badge variant="secondary">
                              {blog.category.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      {columnVisibility.author && (
                        <TableCell className="whitespace-nowrap">
                          {blog.user ? (
                            <span className="text-sm">{blog.user.name}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      {columnVisibility.status && (
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(blog.status)}>
                            {
                              BLOG_STATUS_OPTIONS.find(
                                (s) => s.value === blog.status,
                              )?.label
                            }
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.views_count && (
                        <TableCell className="whitespace-nowrap">
                          {blog.views.toLocaleString()}
                        </TableCell>
                      )}
                      {columnVisibility.min_read && (
                        <TableCell className="whitespace-nowrap">
                          {blog.read_time} menit
                        </TableCell>
                      )}
                      {columnVisibility.published_at && (
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {blog.published_at
                            ? dayjs(blog.published_at).format(
                                "DD MMM YYYY, HH:mm",
                              )
                            : "-"}
                        </TableCell>
                      )}
                      {columnVisibility.slug && (
                        <TableCell className="text-muted-foreground truncate max-w-[200px]">
                          {blog.slug}
                        </TableCell>
                      )}
                      {columnVisibility.tags && (
                        <TableCell className="text-muted-foreground">
                          {blog.tags?.length || 0}
                        </TableCell>
                      )}
                      {columnVisibility.created_at && (
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {dayjs(blog.created_at).format("DD MMM YYYY, HH:mm")}
                        </TableCell>
                      )}
                      {columnVisibility.updated_at && (
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {dayjs(blog.updated_at).format("DD MMM YYYY, HH:mm")}
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
                              onClick={() =>
                                navigate(
                                  paths.admin.blogs.detail.getHref(blog.id),
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  paths.admin.blogs.edit.getHref(blog.id),
                                )
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenStatusDialog(blog)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Ubah Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(blog.id)}
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
          </TooltipProvider>
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
            <span>dari {totalItems} data</span>
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

      {/* Filter Modal */}
      <BlogFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={{
          status: params.status as FilterValues["status"],
          category_id: params.category_id,
          user_id: params.user_id || "",
          tag_id: params.tag_id || "",
          published_at_from: params.published_at_from || "",
          published_at_to: params.published_at_to || "",
          created_at_from: params.created_at_from || "",
          created_at_to: params.created_at_to || "",
          read_time_from: params.read_time_from || "",
          read_time_to: params.read_time_to || "",
          views_from: params.views_from || "",
          views_to: params.views_to || "",
        }}
        onApply={(newFilters) => {
          setParams(
            {
              status: newFilters.status || "",
              category_id: newFilters.category_id || "",
              user_id: newFilters.user_id || "",
              tag_id: newFilters.tag_id || "",
              published_at_from: newFilters.published_at_from || "",
              published_at_to: newFilters.published_at_to || "",
              created_at_from: newFilters.created_at_from || "",
              created_at_to: newFilters.created_at_to || "",
              read_time_from: newFilters.read_time_from || "",
              read_time_to: newFilters.read_time_to || "",
              views_from: newFilters.views_from || "",
              views_to: newFilters.views_to || "",
            },
            true,
          );
          setFilterModalOpen(false);
        }}
        categories={
          categoriesData?.items.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          })) || []
        }
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Blog?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Blog akan dihapus secara
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
              Hapus {selectedIds.length} Blog?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua blog yang dipilih akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={massDeleteBlogsMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                confirmBulkDelete();
              }}
              disabled={massDeleteBlogsMutation.isPending}
            >
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BlogStatusModal
        open={statusDialogOpen}
        blog={blogToUpdateStatus}
        status={nextStatus}
        onStatusChange={setNextStatus}
        onClose={() => {
          setStatusDialogOpen(false);
          setBlogToUpdateStatus(null);
        }}
        onSave={handleUpdateStatus}
        isSaving={updateBlogMutation.isPending}
      />
    </>
  );
};
