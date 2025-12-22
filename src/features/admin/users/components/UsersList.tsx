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
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Users as UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  UserFilterModal,
  type FilterValues,
} from "@/components/users/UserFilterModal";
import {
  UserColumnToggle,
  type ColumnVisibility,
  defaultColumnVisibility,
} from "@/components/users/UserColumnToggle";
import { USER_ROLE_OPTIONS } from "@/types/user";
import { cn, buildImageUrl } from "@/lib/utils";
import { useUsers } from "../api/get-users";
import { useDeleteUser } from "../api/delete-user";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

type SortField =
  | "name"
  | "username"
  | "email"
  | "role"
  | "created_at"
  | "updated_at";

export const UsersList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    defaultColumnVisibility
  );

  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: usersData, isLoading } = useUsers({
    params: {
      page: currentPage,
      per_page: perPage,
      q: debouncedSearch,
      sort_by: sortField,
      sort_order: sortOrder,
      role: filters.role,
      created_from: filters.created_from?.toISOString(),
      created_to: filters.created_to?.toISOString(),
    },
  });

  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("User berhasil dihapus");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      },
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate({ id: userToDelete });
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

  const hasActiveFilters =
    filters.role ||
    filters.status ||
    filters.created_from ||
    filters.created_to;

  const users = usersData?.items || [];
  const pagination = usersData?.pagination || {
    page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
  };

  return (
    <>
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, username, email, telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
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
          <UserColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button size="sm" onClick={() => navigate("/admin/users/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columnVisibility.name && (
                  <TableHead>
                    <SortableHeader field="name">Nama</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.username && (
                  <TableHead>
                    <SortableHeader field="username">Username</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.email && (
                  <TableHead>
                    <SortableHeader field="email">Email</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.phone && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Telepon
                  </TableHead>
                )}
                {columnVisibility.role && (
                  <TableHead>
                    <SortableHeader field="role">Role</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.created_at && (
                  <TableHead>
                    <SortableHeader field="created_at">Dibuat</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.updated_at && (
                  <TableHead>
                    <SortableHeader field="updated_at">Diupdate</SortableHeader>
                  </TableHead>
                )}
                <TableHead className="text-right uppercase text-xs font-medium tracking-wide">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <UsersIcon className="h-10 w-10 mb-2 opacity-50" />
                      <p>Tidak ada user ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={cn(index % 2 === 1 && "bg-muted/30")}
                  >
                    {columnVisibility.name && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={buildImageUrl(user.avatar)} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.username && (
                      <TableCell className="text-muted-foreground">
                        @{user.username}
                      </TableCell>
                    )}
                    {columnVisibility.email && (
                      <TableCell>{user.email}</TableCell>
                    )}
                    {columnVisibility.phone && (
                      <TableCell className="text-muted-foreground">
                        {user.phone || "-"}
                      </TableCell>
                    )}
                    {columnVisibility.role && (
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {
                            USER_ROLE_OPTIONS.find(
                              (opt) => opt.value === user.role
                            )?.label
                          }
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.created_at && (
                      <TableCell className="text-muted-foreground">
                        {dayjs(user.created_at).format("DD MMM YYYY")}
                      </TableCell>
                    )}
                    {columnVisibility.updated_at && (
                      <TableCell className="text-muted-foreground">
                        {dayjs(user.updated_at).format("DD MMM YYYY")}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
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
                          className="w-48 bg-popover z-50"
                        >
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/users/${user.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id)}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan</span>
              <Select
                value={String(perPage)}
                onValueChange={(val) => {
                  setPerPage(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {[5, 10, 20, 50].map((n) => (
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
                {currentPage} / {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))
                }
                disabled={currentPage === pagination.total_pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(pagination.total_pages)}
                disabled={currentPage === pagination.total_pages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <UserFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApply={setFilters}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
