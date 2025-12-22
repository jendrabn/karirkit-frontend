/* eslint-disable react-hooks/static-components */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { id } from "date-fns/locale";
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
  UserCheck,
  UserX,
  Ban,
  Users as UsersIcon,
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
import { mockUsers } from "@/data/mockUsers";
import {
  type User,
  type UserRole,
  type UserStatus,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "@/types/user";
import { cn } from "@/lib/utils";

const getRoleBadgeVariant = (role: UserRole) => {
  return role === "admin" ? "default" : "secondary";
};

const getStatusBadgeVariant = (status: UserStatus) => {
  const variants: Record<
    UserStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    active: "default",
    suspended: "secondary",
    banned: "destructive",
  };
  return variants[status];
};

type SortField =
  | "name"
  | "username"
  | "email"
  | "role"
  | "created_at"
  | "updated_at";
type SortOrder = "asc" | "desc";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    defaultColumnVisibility
  );
  const [sortField, setSortField] = useState<SortField | null>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusChange, setStatusChange] = useState<{
    id: string;
    status: UserStatus;
  } | null>(null);

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

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.toLowerCase().includes(query)
      );
    }

    // Filters
    if (filters.role) {
      result = result.filter((user) => user.role === filters.role);
    }
    if (filters.status) {
      result = result.filter((user) => user.status === filters.status);
    }
    if (filters.created_from) {
      result = result.filter(
        (user) => new Date(user.created_at) >= filters.created_from!
      );
    }
    if (filters.created_to) {
      result = result.filter(
        (user) => new Date(user.created_at) <= filters.created_to!
      );
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }

    return result;
  }, [users, searchQuery, filters, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / perPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUsers.map((user) => user.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = () => {
    setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
    setSelectedIds([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleStatusChange = (id: string, status: UserStatus) => {
    setStatusChange({ id, status });
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (statusChange) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === statusChange.id
            ? {
                ...user,
                status: statusChange.status,
                updated_at: new Date().toISOString(),
              }
            : user
        )
      );
      setStatusDialogOpen(false);
      setStatusChange(null);
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

  return (
    <DashboardLayout>
      <PageHeader
        title="Manajemen Users"
        subtitle="Kelola semua pengguna aplikasi."
      />

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
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      paginatedUsers.length > 0 &&
                      selectedIds.length === paginatedUsers.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
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
                {columnVisibility.status && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Status
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
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <UsersIcon className="h-10 w-10 mb-2 opacity-50" />
                      <p>Tidak ada user ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={cn(index % 2 === 1 && "bg-muted/30")}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={() => handleSelectOne(user.id)}
                      />
                    </TableCell>
                    {columnVisibility.name && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
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
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {
                            USER_ROLE_OPTIONS.find(
                              (opt) => opt.value === user.role
                            )?.label
                          }
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {
                            USER_STATUS_OPTIONS.find(
                              (opt) => opt.value === user.status
                            )?.label
                          }
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.created_at && (
                      <TableCell className="text-muted-foreground">
                        {format(new Date(user.created_at), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </TableCell>
                    )}
                    {columnVisibility.updated_at && (
                      <TableCell className="text-muted-foreground">
                        {format(new Date(user.updated_at), "dd MMM yyyy", {
                          locale: id,
                        })}
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
                          {user.status !== "active" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(user.id, "active")
                              }
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Aktifkan
                            </DropdownMenuItem>
                          )}
                          {user.status !== "suspended" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(user.id, "suspended")
                              }
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {user.status !== "banned" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(user.id, "banned")
                              }
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Banned
                            </DropdownMenuItem>
                          )}
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
        {filteredAndSortedUsers.length > 0 && (
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
              <span>dari {filteredAndSortedUsers.length} data</span>
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
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
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
            <AlertDialogTitle>Hapus {selectedIds.length} User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {selectedIds.length} user yang
              dipilih? Tindakan ini tidak dapat dibatalkan.
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

      {/* Status Change Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ubah Status User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengubah status user ini menjadi "
              {statusChange?.status}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Ya, Ubah Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminUsers;
