import { useEffect, useState } from "react";
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
  Loader2,
  FileStack,
  Shield,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  UserFilterModal,
  type FilterValues,
} from "@/features/admin/users/components/UserFilterModal";
import {
  UserColumnToggle,
  type ColumnVisibility,
  defaultColumnVisibility,
} from "@/features/admin/users/components/UserColumnToggle";
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS, type User } from "@/types/user";
import {
  buildImageUrl,
  bytesToMegabytes,
  cn,
  formatBytes,
  megabytesToBytes,
} from "@/lib/utils";
import { useUsers } from "../api/get-users";
import { useDeleteUser } from "../api/delete-user";
import { useMassDeleteUsers } from "../api/mass-delete-users";
import { useUpdateUser } from "../api/update-user";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/contexts/AuthContext";
import { useFormErrors } from "@/hooks/use-form-errors";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type SortField =
  | "name"
  | "username"
  | "email"
  | "role"
  | "created_at"
  | "updated_at";

const getStatusBadgeVariant = (status: User["status"]) => {
  switch (status) {
    case "active":
      return "default";
    case "suspended":
      return "secondary";
    case "banned":
      return "destructive";
    default:
      return "outline";
  }
};

const userStatusSchema = z
  .object({
    status: z.enum(["active", "suspended", "banned"]),
    status_reason: z.string().optional(),
    suspended_until: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "suspended" && !data.suspended_until) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tanggal suspend wajib diisi",
        path: ["suspended_until"],
      });
    }
  });

export const UsersList = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  const [columnVisibilityState, setColumnVisibilityState] =
    useLocalStorage<ColumnVisibility>(
      "users-table-columns",
      defaultColumnVisibility
    );

  const columnVisibility = {
    ...defaultColumnVisibility,
    ...columnVisibilityState,
  };

  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const updateDownloadLimitMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: (_, variables) => {
        toast.success(
          `Berhasil mengupdate batas unduhan untuk user (Limit: ${
            variables.data.daily_download_limit ?? "-"
          })`
        );
      },
      onError: () => {
        toast.error("Gagal mengupdate batas unduhan user");
      },
    },
  });
  const updateStorageLimitMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: (_, variables) => {
        toast.success(
          `Berhasil mengupdate batas penyimpanan untuk user (Limit: ${formatBytes(
            variables.data.document_storage_limit ?? 0
          )})`
        );
      },
      onError: () => {
        toast.error("Gagal mengupdate batas penyimpanan user");
      },
    },
  });
  const updateStatusMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Status akun berhasil diperbarui");
        setStatusDialogOpen(false);
      },
      onError: () => {
        toast.error("Gagal memperbarui status user");
      },
    },
  });

  const defaultFormatDisplay = (value?: number | null) => {
    if (value == null || Number.isNaN(value)) {
      return "-";
    }
    return String(value);
  };

  const defaultFormatInput = (value?: number | null) => {
    if (value == null || Number.isNaN(value)) {
      return "";
    }
    return String(value);
  };

  const defaultParseValue = (input: string) => {
    if (input.trim() === "") {
      return null;
    }
    const parsed = Number(input);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const EditableCell = ({
    label,
    value,
    onSave,
    type = "number",
    formatDisplay,
    formatInput,
    parseValue,
  }: {
    label: string;
    value?: number | null;
    onSave: (value: number) => void;
    type?: "text" | "number";
    formatDisplay?: (value?: number | null) => string;
    formatInput?: (value?: number | null) => string;
    parseValue?: (input: string) => number | null;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const displayFormatter = formatDisplay ?? defaultFormatDisplay;
    const inputFormatter = formatInput ?? defaultFormatInput;
    const parser = parseValue ?? defaultParseValue;
    const [inputValue, setInputValue] = useState(() => inputFormatter(value));

    useEffect(() => {
      if (!isEditing) {
        setInputValue(inputFormatter(value));
      }
    }, [inputFormatter, isEditing, value]);

    const handleBlur = () => {
      setIsEditing(false);
      const parsedValue = parser(inputValue);
      if (parsedValue === null) {
        toast.error(`${label} tidak valid`);
        setInputValue(inputFormatter(value));
        return;
      }
      if (parsedValue === value) {
        return;
      }
      onSave(parsedValue);
    };

    if (isEditing) {
      return (
        <Input
          type={type}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={(event) => event.key === "Enter" && handleBlur()}
          autoFocus
          className="h-8 w-24 px-2"
        />
      );
    }

    return (
      <span
        className="cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors whitespace-nowrap block min-h-[1.5rem]"
        onClick={() => setIsEditing(true)}
      >
        {displayFormatter(value)}
      </span>
    );
  };

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

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [userForStatus, setUserForStatus] = useState<User | null>(null);

  const statusForm = useForm<z.infer<typeof userStatusSchema>>({
    resolver: zodResolver(userStatusSchema),
    defaultValues: {
      status: "active",
      status_reason: "",
      suspended_until: "",
    },
  });

  useFormErrors(statusForm);

  useEffect(() => {
    if (!userForStatus) return;

    statusForm.reset({
      status: userForStatus.status || "active",
      status_reason: userForStatus.status_reason || "",
      suspended_until: userForStatus.suspended_until
        ? dayjs(userForStatus.suspended_until).local().format("YYYY-MM-DDTHH:mm")
        : "",
    });
  }, [statusForm, userForStatus]);

  const massDeleteMutation = useMassDeleteUsers({
    mutationConfig: {
      onSuccess: () => {
        toast.success("User terpilih berhasil dihapus");
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

  const handleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((user) => user.id));
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

  const handleOpenStatusDialog = (user: User) => {
    setUserForStatus(user);
    setStatusDialogOpen(true);
  };

  const applySuspendDays = (days: number) => {
    const nextDate = dayjs().add(days, "day").format("YYYY-MM-DDTHH:mm");
    statusForm.setValue("suspended_until", nextDate, {
      shouldDirty: true,
      shouldValidate: true,
    });
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
    filters.role || filters.created_from || filters.created_to;

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
            onVisibilityChange={setColumnVisibilityState}
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
                      users.length > 0 && selectedIds.length === users.length
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
                {columnVisibility.phone && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Telepon
                  </TableHead>
                )}
                {columnVisibility.daily_download_limit && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Batas Unduhan
                  </TableHead>
                )}
                {columnVisibility.document_storage_limit && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Batas Penyimpanan
                  </TableHead>
                )}
                {columnVisibility.total_downloads && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Total Unduhan
                  </TableHead>
                )}
                {columnVisibility.created_at && (
                  <TableHead>
                    <SortableHeader field="created_at">Dibuat</SortableHeader>
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
                  <TableCell colSpan={12} className="py-14 text-center">
                    <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Memuat data…
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={12}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileStack className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-base font-medium">
                        Tidak ada data user
                      </p>
                      <p className="text-sm">
                        Mulai tambahkan user pertama Anda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={cn(
                      index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      selectedIds.includes(user.id) && "bg-primary/5"
                    )}
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
                    {columnVisibility.status && (
                      <TableCell>
                        {user.suspended_until ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={getStatusBadgeVariant(user.status)}>
                                {
                                  USER_STATUS_OPTIONS.find(
                                    (opt) => opt.value === user.status
                                  )?.label
                                }
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              Suspend sampai{" "}
                              {dayjs(user.suspended_until).format(
                                "DD MMM YYYY, HH:mm"
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge variant={getStatusBadgeVariant(user.status)}>
                            {
                              USER_STATUS_OPTIONS.find(
                                (opt) => opt.value === user.status
                              )?.label
                            }
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.phone && (
                      <TableCell className="text-muted-foreground">
                        {user.phone || "-"}
                      </TableCell>
                    )}
                    {columnVisibility.daily_download_limit && (
                      <TableCell>
                        <EditableCell
                          label="Batas Unduhan"
                          value={user.daily_download_limit}
                          onSave={(value) =>
                            updateDownloadLimitMutation.mutate({
                              id: user.id,
                              data: { daily_download_limit: value },
                            })
                          }
                          type="number"
                        />
                      </TableCell>
                    )}
                    {columnVisibility.document_storage_limit && (
                      <TableCell>
                        <EditableCell
                          label="Batas Penyimpanan"
                          value={user.document_storage_limit}
                          onSave={(value) =>
                            updateStorageLimitMutation.mutate({
                              id: user.id,
                              data: { document_storage_limit: value },
                            })
                          }
                          type="number"
                          formatDisplay={(val) =>
                            formatBytes(val ?? 0)
                          }
                          formatInput={(val) =>
                            String(Math.round(bytesToMegabytes(val ?? 0)))
                          }
                          parseValue={(input) => {
                            const parsed = Number(input);
                            if (!Number.isFinite(parsed) || parsed < 0) {
                              return null;
                            }

                            return megabytesToBytes(parsed);
                          }}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.total_downloads && (
                      <TableCell className="text-muted-foreground">
                        {user.total_count ?? 0}
                      </TableCell>
                    )}
                    {columnVisibility.created_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {dayjs(user.created_at).format("DD MMM YYYY, HH:mm")}
                      </TableCell>
                    )}
                    {columnVisibility.updated_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {dayjs(user.updated_at).format("DD MMM YYYY, HH:mm")}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
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
                          <DropdownMenuItem
                            onClick={() => handleOpenStatusDialog(user)}
                            disabled={authUser?.id === user.id}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Ubah Status
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

      <Dialog
        open={statusDialogOpen}
        onOpenChange={(open) => {
          setStatusDialogOpen(open);
          if (!open) {
            setUserForStatus(null);
            statusForm.reset({
              status: "active",
              status_reason: "",
              suspended_until: "",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ubah Status User</DialogTitle>
            <DialogDescription>
              {userForStatus
                ? `Perbarui status akun ${userForStatus.name}.`
                : "Pilih status akun yang sesuai."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={statusForm.handleSubmit((data) => {
              if (!userForStatus) return;

              const suspendedUntil =
                data.status === "suspended" && data.suspended_until
                  ? new Date(data.suspended_until).toISOString()
                  : undefined;

              updateStatusMutation.mutate({
                id: userForStatus.id,
                data: {
                  status: data.status,
                  status_reason: data.status_reason || undefined,
                  suspended_until: suspendedUntil,
                },
              });
            })}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={statusForm.watch("status")}
                onValueChange={(value) => {
                  statusForm.setValue("status", value as User["status"], {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                disabled={updateStatusMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {USER_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Status menentukan akses user ke aplikasi.
              </FieldDescription>
              <FieldError>{statusForm.formState.errors.status?.message}</FieldError>
            </Field>

            {statusForm.watch("status") === "suspended" && (
              <Field>
                <FieldLabel>Suspend Sampai</FieldLabel>
                <Input
                  type="datetime-local"
                  {...statusForm.register("suspended_until")}
                  disabled={updateStatusMutation.isPending}
                />
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 7, 14, 30].map((days) => (
                    <Button
                      key={days}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applySuspendDays(days)}
                      disabled={updateStatusMutation.isPending}
                    >
                      +{days} hari
                    </Button>
                  ))}
                </div>
                <FieldError>
                  {statusForm.formState.errors.suspended_until?.message}
                </FieldError>
              </Field>
            )}

            <Field>
              <FieldLabel>Catatan Status</FieldLabel>
              <Textarea
                {...statusForm.register("status_reason")}
                rows={2}
                placeholder="Catatan untuk audit (opsional)"
                disabled={updateStatusMutation.isPending}
              />
              <FieldDescription>
                Catatan ini hanya terlihat oleh admin.
              </FieldDescription>
              <FieldError>
                {statusForm.formState.errors.status_reason?.message}
              </FieldError>
            </Field>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStatusDialogOpen(false)}
                disabled={updateStatusMutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={updateStatusMutation.isPending}>
                {updateStatusMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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

      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.length} User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user yang dipilih? Tindakan ini
              tidak dapat dibatalkan.
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
