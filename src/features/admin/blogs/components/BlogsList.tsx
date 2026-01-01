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
  MoreVertical,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import {
  BlogFilterModal,
  type FilterValues,
} from "@/features/admin/blogs/components/BlogFilterModal";
import {
  BlogColumnToggle,
  type ColumnVisibility,
  defaultColumnVisibility,
} from "@/features/admin/blogs/components/BlogColumnToggle";
import {
  type BlogStatus,
  BLOG_STATUS_OPTIONS,
  getStatusBadgeVariant,
} from "@/types/blog";
import { cn, buildImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { paths } from "@/config/paths";
import {
  useBlogs,
  type GetBlogsParams,
} from "@/features/admin/blogs/api/get-blogs";
import { useDeleteBlog } from "@/features/admin/blogs/api/delete-blog";
import { useMassDeleteBlogs } from "@/features/admin/blogs/api/mass-delete-blogs";
import { useBlogCategories } from "@/features/blogs/api/get-blog-categories";
import { useLocalStorage } from "@/hooks/use-local-storage";

type SortField = "updated_at" | "published_at" | "views" | "title";
type SortOrder = "asc" | "desc";

export const BlogsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "blogs-table-columns",
      defaultColumnVisibility
    );
  const [sortField, setSortField] = useState<SortField | null>("updated_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Build API params
  const apiParams: GetBlogsParams = {
    page: currentPage,
    per_page: perPage,
    q: searchQuery || undefined,
    sort_order: sortOrder,
    sort_by: sortField || undefined,
    status: filters.status as "draft" | "published" | "archived" | undefined,
    category_id: filters.category_id?.toString(),
  };

  // Fetch blogs
  const { data: blogsData, isLoading } = useBlogs({ params: apiParams });
  const { data: categoriesData } = useBlogCategories();
  const deleteBlogMutation = useDeleteBlog();
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
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
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
      } catch (error) {
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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = () => {
    massDeleteBlogsMutation.mutate({ ids: selectedIds });
  };

  // Note: Status change would require update API - simplified for now
  const handleStatusChange = async (_id: string, _newStatus: BlogStatus) => {
    // TODO: Implement status change using updateBlog mutation
    toast.info("Fitur perubahan status akan segera tersedia");
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
            placeholder="Cari judul, excerpt..."
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
                      <SortableHeader field="title">Judul</SortableHeader>
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
                      <SortableHeader field="views">Views</SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.min_read && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Waktu Baca
                    </TableHead>
                  )}
                  {columnVisibility.published_at && (
                    <TableHead>
                      <SortableHeader field="published_at">
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
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Dibuat
                    </TableHead>
                  )}
                  {columnVisibility.updated_at && (
                    <TableHead>
                      <SortableHeader field="updated_at">
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
                    <TableCell
                      colSpan={14}
                      className="text-center py-16 text-muted-foreground"
                    >
                      Memuat...
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
                        selectedIds.includes(blog.id) && "bg-primary/5"
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
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={
                                    blog.user.avatar
                                      ? buildImageUrl(blog.user.avatar)
                                      : undefined
                                  }
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {blog.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{blog.user.name}</span>
                            </div>
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
                                (s) => s.value === blog.status
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
                                "DD MMM YYYY, HH:mm"
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
                                  paths.admin.blogs.detail.getHref(blog.id)
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  paths.admin.blogs.edit.getHref(blog.id)
                                )
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast.info(
                                  "Fitur duplikat akan segera tersedia"
                                )
                              }
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplikat
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                Ubah Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {BLOG_STATUS_OPTIONS.filter(
                                  (opt) => opt.value !== "scheduled"
                                ).map((opt) => (
                                  <DropdownMenuItem
                                    key={opt.value}
                                    onClick={() =>
                                      handleStatusChange(blog.id, opt.value)
                                    }
                                    disabled={blog.status === opt.value}
                                  >
                                    {opt.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
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
            <span>dari {totalItems} data</span>
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
      <BlogFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApply={setFilters}
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
    </>
  );
};
