import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { dayjs } from "@/lib/date";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Copy,
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
  TooltipProvider,
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
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  type User,
} from "@/types/user";
import { cn } from "@/lib/utils";
import { SUBSCRIPTION_PLAN_LABELS } from "@/features/subscriptions/utils";
import { getEnumBadgeClassName } from "@/lib/enum-badges";
import { useUsers } from "../api/get-users";
import { useDeleteUser } from "../api/delete-user";
import { useMassDeleteUsers } from "../api/mass-delete-users";
import { useUpdateUserStatus } from "../api/update-user-status";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/contexts/AuthContext";
import { useServerValidation } from "@/hooks/use-server-validation";
import { toast } from "sonner";
import { useUrlParams } from "@/hooks/use-url-params";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { SortableHeader } from "@/components/SortableHeader";

type SortField =
  | "name"
  | "email"
  | "role"
  | "status"
  | "created_at"
  | "updated_at"
  | "download_total_count";

const getUserTodayDownloads = (user: User) =>
  user.download_today_count ?? user.download_stats?.today_count ?? 0;

const getUserTotalDownloads = (user: User) =>
  user.download_total_count ??
  user.download_stats?.total_count ??
  user.total_downloads ??
  0;

const getSubscriptionPlanLabel = (user: User) =>
  user.subscription_plan
    ? SUBSCRIPTION_PLAN_LABELS[user.subscription_plan]
    : "-";

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
    role: "",
    status: "",
    gender: "",
    email_verified: "",
    suspended: "",
    created_at_from: "",
    created_at_to: "",
    download_total_count_from: "",
    download_total_count_to: "",
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [columnVisibilityState, setColumnVisibilityState] =
    useLocalStorage<ColumnVisibility>(
      "users-table-columns",
      defaultColumnVisibility,
    );

  const columnVisibility = {
    ...defaultColumnVisibility,
    ...columnVisibilityState,
  };

  const updateStatusMutation = useUpdateUserStatus({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Status akun berhasil diperbarui");
        setStatusDialogOpen(false);
      },
      onError: (error) => {
        console.error("Error: ", error);
      },
    },
  });

  const { data: usersData, isLoading } = useUsers({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      role: params.role ? (params.role as User["role"]) : undefined,
      status: params.status
        ? (params.status as FilterValues["status"])
        : undefined,
      gender: params.gender
        ? (params.gender as FilterValues["gender"])
        : undefined,
      email_verified: params.email_verified
        ? (params.email_verified as FilterValues["email_verified"])
        : undefined,
      suspended: params.suspended
        ? (params.suspended as FilterValues["suspended"])
        : undefined,
      created_at_from: params.created_at_from || undefined,
      created_at_to: params.created_at_to || undefined,
      download_total_count_from: params.download_total_count_from
        ? Number(params.download_total_count_from)
        : undefined,
      download_total_count_to: params.download_total_count_to
        ? Number(params.download_total_count_to)
        : undefined,
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
  const statusValue = useWatch({
    control: statusForm.control,
    name: "status",
  });

  useServerValidation(updateStatusMutation.error, statusForm);

  useEffect(() => {
    if (!userForStatus) return;

    statusForm.reset({
      status: userForStatus.status || "active",
      status_reason: userForStatus.status_reason || "",
      suspended_until: userForStatus.suspended_until
        ? dayjs(userForStatus.suspended_until)
            .local()
            .format("YYYY-MM-DDTHH:mm")
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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate({ ids: selectedIds });
  };

  const handleOpenStatusDialog = (user: User) => {
    setUserForStatus(user);
    setStatusDialogOpen(true);
  };

  const handleCopyUserId = async (id: string) => {
    if (!navigator.clipboard) {
      toast.error("Clipboard tidak didukung di browser ini");
      return;
    }

    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID user berhasil disalin");
    } catch {
      toast.error("Gagal menyalin ID user");
    }
  };

  const applySuspendDays = (days: number) => {
    const nextDate = dayjs().add(days, "day").format("YYYY-MM-DDTHH:mm");
    statusForm.setValue("suspended_until", nextDate, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const hasActiveFilters =
    params.role ||
    params.status ||
    params.gender ||
    params.email_verified ||
    params.suspended ||
    params.created_at_from ||
    params.created_at_to ||
    params.download_total_count_from ||
    params.download_total_count_to;

  const users = usersData?.items || [];
  const pagination = usersData?.pagination || {
    page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
  };
  const visibleColumnCount =
    Object.values(columnVisibility).filter(Boolean).length + 2;

  return (
    <>
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, username, email, telepon, lokasi..."
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
                    role: "",
                    status: "",
                    gender: "",
                    email_verified: "",
                    suspended: "",
                    created_at_from: "",
                    created_at_to: "",
                    download_total_count_from: "",
                    download_total_count_to: "",
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
          <TooltipProvider>
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
                {columnVisibility.id && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    ID
                  </TableHead>
                )}
                {columnVisibility.name && (
                  <TableHead>
                    <SortableHeader field="name" onSort={handleSort}>
                      Nama
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.username && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Username
                  </TableHead>
                )}
                {columnVisibility.email && (
                  <TableHead>
                    <SortableHeader field="email" onSort={handleSort}>
                      Email
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.phone && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Telepon
                  </TableHead>
                )}
                {columnVisibility.headline && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Headline
                  </TableHead>
                )}
                {columnVisibility.location && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Lokasi
                  </TableHead>
                )}
                {columnVisibility.role && (
                  <TableHead>
                    <SortableHeader field="role" onSort={handleSort}>
                      Role
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.status && (
                  <TableHead>
                    <SortableHeader field="status" onSort={handleSort}>
                      Status
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.email_verified_at && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Email Verified
                  </TableHead>
                )}
                {columnVisibility.last_login_at && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Login Terakhir
                  </TableHead>
                )}
                {columnVisibility.subscription_plan && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Paket
                  </TableHead>
                )}
                {columnVisibility.subscription_expires_at && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Masa Aktif
                  </TableHead>
                )}
                {columnVisibility.download_today_count && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Unduhan Hari Ini
                  </TableHead>
                )}
                {columnVisibility.download_total_count && (
                  <TableHead>
                    <SortableHeader
                      field="download_total_count"
                      onSort={handleSort}
                    >
                      Total Unduhan
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
                  <TableCell
                    colSpan={visibleColumnCount}
                    className="py-14 text-center"
                  >
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
                    colSpan={visibleColumnCount}
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
                      selectedIds.includes(user.id) && "bg-primary/5",
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={() => handleSelectOne(user.id)}
                      />
                    </TableCell>
                    {columnVisibility.id && (
                      <TableCell className="max-w-[220px]">
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block truncate font-mono text-xs text-muted-foreground">
                                {user.id}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{user.id}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={() => handleCopyUserId(user.id)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.name && (
                      <TableCell className="min-w-[220px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium block truncate">
                              {user.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columnVisibility.username && (
                      <TableCell className="text-muted-foreground max-w-[120px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate">
                              {user.username}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.username}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columnVisibility.email && (
                      <TableCell className="max-w-[200px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate">
                              {user.email}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.email}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columnVisibility.phone && (
                      <TableCell className="text-muted-foreground max-w-[150px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate">
                              {user.phone || "-"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.phone || "-"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columnVisibility.headline && (
                      <TableCell className="text-muted-foreground max-w-[220px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate">
                              {user.headline || "-"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.headline || "-"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columnVisibility.location && (
                      <TableCell className="text-muted-foreground max-w-[150px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate">
                              {user.location || "-"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.location || "-"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columnVisibility.role && (
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getEnumBadgeClassName("userRole", user.role)}
                        >
                          {
                            USER_ROLE_OPTIONS.find(
                              (opt) => opt.value === user.role,
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
                              <Badge
                                variant="outline"
                                className={getEnumBadgeClassName(
                                  "userStatus",
                                  user.status,
                                )}
                              >
                                {
                                  USER_STATUS_OPTIONS.find(
                                    (opt) => opt.value === user.status,
                                  )?.label
                                }
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              Suspend sampai{" "}
                              {dayjs(user.suspended_until).format(
                                "DD MMM YYYY, HH:mm",
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge
                            variant="outline"
                            className={getEnumBadgeClassName(
                              "userStatus",
                              user.status,
                            )}
                          >
                            {
                              USER_STATUS_OPTIONS.find(
                                (opt) => opt.value === user.status,
                              )?.label
                            }
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.email_verified_at && (
                      <TableCell className="whitespace-nowrap">
                        {user.email_verified_at ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className={getEnumBadgeClassName(
                                  "verificationStatus",
                                  "true",
                                )}
                              >
                                Terverifikasi
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {dayjs(user.email_verified_at).format(
                                  "DD MMM YYYY, HH:mm",
                                )}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge
                            variant="outline"
                            className={getEnumBadgeClassName(
                              "verificationStatus",
                              "false",
                            )}
                          >
                            Belum
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.last_login_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {user.last_login_at
                          ? dayjs(user.last_login_at).format(
                              "DD MMM YYYY, HH:mm",
                            )
                          : "-"}
                      </TableCell>
                    )}
                    {columnVisibility.subscription_plan && (
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={getEnumBadgeClassName(
                            "subscriptionPlan",
                            user.subscription_plan,
                          )}
                        >
                          {getSubscriptionPlanLabel(user)}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.subscription_expires_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {user.subscription_expires_at
                          ? dayjs(user.subscription_expires_at).format(
                              "DD MMM YYYY, HH:mm",
                            )
                          : "-"}
                      </TableCell>
                    )}
                    {columnVisibility.download_today_count && (
                      <TableCell className="text-muted-foreground max-w-[120px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate">
                              {getUserTodayDownloads(user)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getUserTodayDownloads(user)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columnVisibility.download_total_count && (
                      <TableCell className="text-muted-foreground max-w-[120px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate">
                              {getUserTotalDownloads(user)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getUserTotalDownloads(user)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columnVisibility.created_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {user.created_at
                          ? dayjs(user.created_at).format("DD MMM YYYY, HH:mm")
                          : "-"}
                      </TableCell>
                    )}
                    {columnVisibility.updated_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {user.updated_at
                          ? dayjs(user.updated_at).format("DD MMM YYYY, HH:mm")
                          : "-"}
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
        </TooltipProvider>
        </div>

        {/* Pagination */}
        {pagination.total_items > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
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

      {/* Filter Modal */}
      <UserFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={{
          role: params.role ? (params.role as FilterValues["role"]) : undefined,
          status: params.status
            ? (params.status as FilterValues["status"])
            : undefined,
          gender: params.gender
            ? (params.gender as FilterValues["gender"])
            : undefined,
          email_verified: params.email_verified
            ? (params.email_verified as FilterValues["email_verified"])
            : undefined,
          suspended: params.suspended
            ? (params.suspended as FilterValues["suspended"])
            : undefined,
          created_at_from: params.created_at_from || "",
          created_at_to: params.created_at_to || "",
          download_total_count_from: params.download_total_count_from || "",
          download_total_count_to: params.download_total_count_to || "",
        }}
        onApply={(newFilters) => {
          setParams(
            {
              role: newFilters.role || "",
              status: newFilters.status || "",
              gender: newFilters.gender || "",
              email_verified: newFilters.email_verified || "",
              suspended: newFilters.suspended || "",
              created_at_from: newFilters.created_at_from || "",
              created_at_to: newFilters.created_at_to || "",
              download_total_count_from:
                newFilters.download_total_count_from || "",
              download_total_count_to: newFilters.download_total_count_to || "",
            },
            true,
          );
          setFilterModalOpen(false);
        }}
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
                value={statusValue}
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
              <FieldError>
                {statusForm.formState.errors.status?.message}
              </FieldError>
            </Field>

            {statusValue === "suspended" && (
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
                placeholder="Catatan untuk audit"
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
