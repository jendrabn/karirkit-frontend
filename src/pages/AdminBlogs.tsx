import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
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
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
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
} from "@/components/blog/BlogFilterModal";
import {
  BlogColumnToggle,
  type ColumnVisibility,
  defaultColumnVisibility,
} from "@/components/blog/BlogColumnToggle";
import { mockBlogs, mockCategories } from "@/data/mockBlogs";
import {
  type Blog,
  type BlogStatus,
  BLOG_STATUS_OPTIONS,
  getStatusBadgeVariant,
} from "@/types/blog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { paths } from "@/config/paths";

type SortField = "updated_at" | "published_at" | "views_count" | "title";
type SortOrder = "asc" | "desc";

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    defaultColumnVisibility
  );
  const [sortField, setSortField] = useState<SortField | null>("updated_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedBlogs = useMemo(() => {
    let result = [...blogs];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.teaser?.toLowerCase().includes(query)
      );
    }

    // Filters
    if (filters.title) {
      result = result.filter((blog) =>
        blog.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    if (filters.category_id) {
      result = result.filter(
        (blog) => blog.category?.id === filters.category_id
      );
    }
    if (filters.status) {
      result = result.filter((blog) => blog.status === filters.status);
    }
    if (filters.dateFrom) {
      result = result.filter(
        (blog) => new Date(blog.created_at) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      result = result.filter(
        (blog) => new Date(blog.created_at) <= filters.dateTo!
      );
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal: any = a[sortField];
        const bVal: any = b[sortField];

        if (sortField === "views_count") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }

    return result;
  }, [blogs, searchQuery, filters, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / perPage);
  const paginatedBlogs = filteredAndSortedBlogs.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleDelete = (id: number) => {
    setBlogToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogToDelete));
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
      toast.success("Blog berhasil dihapus");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedBlogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBlogs.map((blog) => blog.id));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = () => {
    setBlogs((prev) => prev.filter((blog) => !selectedIds.includes(blog.id)));
    setSelectedIds([]);
    setBulkDeleteDialogOpen(false);
    toast.success(`${selectedIds.length} blog berhasil dihapus`);
  };

  const handleDuplicate = (blog: Blog) => {
    const newBlog: Blog = {
      ...blog,
      id: Date.now(),
      title: `${blog.title} (Copy)`,
      slug: `${blog.slug}-copy`,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBlogs((prev) => [newBlog, ...prev]);
    toast.success("Blog berhasil diduplikasi");
  };

  const handleStatusChange = (id: number, newStatus: BlogStatus) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === id
          ? {
              ...blog,
              status: newStatus,
              published_at:
                newStatus === "published"
                  ? new Date().toISOString()
                  : blog.published_at,
              updated_at: new Date().toISOString(),
            }
          : blog
      )
    );
    toast.success(
      `Status berhasil diubah menjadi ${
        BLOG_STATUS_OPTIONS.find((s) => s.value === newStatus)?.label
      }`
    );
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
        title="Blog"
        subtitle="Kelola artikel dan konten blog Anda."
      />

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul, teaser..."
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
          <Button size="sm" onClick={() => navigate("/blogs/create")}>
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
                        paginatedBlogs.length > 0 &&
                        selectedIds.length === paginatedBlogs.length
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
                      <SortableHeader field="views_count">Views</SortableHeader>
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
                  {columnVisibility.updated_at && (
                    <TableHead>
                      <SortableHeader field="updated_at">
                        Terakhir Diperbarui
                      </SortableHeader>
                    </TableHead>
                  )}
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBlogs.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={11}
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
                  paginatedBlogs.map((blog, index) => (
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
                          {blog.author ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={blog.author.avatar || undefined}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {blog.author.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {blog.author.name}
                              </span>
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
                          {blog.views_count.toLocaleString()}
                        </TableCell>
                      )}
                      {columnVisibility.min_read && (
                        <TableCell className="whitespace-nowrap">
                          {blog.min_read} menit
                        </TableCell>
                      )}
                      {columnVisibility.published_at && (
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {blog.published_at
                            ? format(new Date(blog.published_at), "dd MMM yyyy")
                            : "-"}
                        </TableCell>
                      )}
                      {columnVisibility.updated_at && (
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {format(new Date(blog.updated_at), "dd MMM yyyy")}
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
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(paths.admin.blogs.detail.getHref(String(blog.id)))}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(paths.admin.blogs.edit.getHref(String(blog.id)))}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(blog)}
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
                                {BLOG_STATUS_OPTIONS.map((opt) => (
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
            <span>dari {filteredAndSortedBlogs.length} data</span>
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
        categories={mockCategories}
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

export default AdminBlogs;
