import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ArrowDownToLine,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  FileStack,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { SortableHeader } from "@/components/SortableHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paths } from "@/config/paths";
import { dayjs } from "@/lib/date";
import {
  createAdminSubscriptionInputSchema,
  useCreateAdminSubscription,
  type CreateAdminSubscriptionInput,
} from "@/features/admin/subscriptions/api/create-subscription";
import {
  normalizeAdminSubscriptionSortField,
  useAdminSubscriptions,
  type AdminSubscriptionSortField,
} from "@/features/admin/subscriptions/api/get-subscriptions";
import { useApproveAdminSubscription } from "@/features/admin/subscriptions/api/approve-subscription";
import { useCancelAdminSubscription } from "@/features/admin/subscriptions/api/cancel-subscription";
import { useDowngradeAdminSubscriptionUser } from "@/features/admin/subscriptions/api/downgrade-user-subscription";
import { useFailAdminSubscription } from "@/features/admin/subscriptions/api/fail-subscription";
import { displayFormErrors } from "@/lib/form-errors";
import { useServerValidation } from "@/hooks/use-server-validation";
import { useUrlParams } from "@/hooks/use-url-params";
import { cn } from "@/lib/utils";
import {
  formatSubscriptionPrice,
  SUBSCRIPTION_PLAN_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
} from "@/features/subscriptions/utils";
import type {
  AdminSubscription,
  SubscriptionPlanId,
  SubscriptionStatus,
} from "@/types/subscription";

type ConfirmAction = "approve" | "cancel" | "fail" | "downgrade";

const STATUS_OPTIONS: SubscriptionStatus[] = [
  "active",
  "pending",
  "paid",
  "expired",
  "failed",
  "cancelled",
];

const PLAN_OPTIONS: SubscriptionPlanId[] = ["free", "pro", "max"];

const getSubscriptionStatusBadgeVariant = (status: SubscriptionStatus) => {
  switch (status) {
    case "active":
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

const getSubscriptionUserLabel = (subscription: AdminSubscription) => {
  if (subscription.user?.name) {
    return subscription.user.name;
  }

  if (subscription.user?.email) {
    return subscription.user.email;
  }

  return subscription.user_id || "-";
};

const getSubscriptionUserMeta = (subscription: AdminSubscription) => {
  return (
    subscription.user?.email ||
    subscription.user?.phone ||
    subscription.user_id ||
    "-"
  );
};

const getSubscriptionActionAvailability = (subscription: AdminSubscription) => ({
  canApprove: subscription.status === "pending",
  canFail: subscription.status === "pending",
  canCancel: ["pending", "paid"].includes(subscription.status),
  canDowngrade: Boolean(subscription.user_id || subscription.user?.id),
});

export function AdminSubscriptionsList() {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    action: ConfirmAction;
    subscription: AdminSubscription;
  } | null>(null);
  const normalizedSortBy = normalizeAdminSubscriptionSortField;

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
    plan: "",
    status: "",
    sort_by: "created_at" as AdminSubscriptionSortField,
    sort_order: "desc" as "asc" | "desc",
  });

  const currentSortBy = normalizedSortBy(params.sort_by) ?? "created_at";

  const { data, isLoading } = useAdminSubscriptions({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
      plan: (params.plan as SubscriptionPlanId) || undefined,
      status: (params.status as SubscriptionStatus) || undefined,
      sort_by: currentSortBy,
      sort_order: params.sort_order,
    },
  });

  const form = useForm<CreateAdminSubscriptionInput>({
    resolver: zodResolver(createAdminSubscriptionInputSchema),
    defaultValues: {
      user_id: "",
      plan: "pro",
    },
  });

  const createMutation = useCreateAdminSubscription({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Subscription manual berhasil dibuat");
        setCreateDialogOpen(false);
        form.reset({ user_id: "", plan: "pro" });
      },
    },
  });

  const approveMutation = useApproveAdminSubscription({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Subscription berhasil di-approve");
        setConfirmState(null);
      },
    },
  });

  const cancelMutation = useCancelAdminSubscription({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Subscription berhasil dibatalkan");
        setConfirmState(null);
      },
    },
  });

  const failMutation = useFailAdminSubscription({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Subscription berhasil ditandai gagal");
        setConfirmState(null);
      },
    },
  });

  const downgradeMutation = useDowngradeAdminSubscriptionUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("User berhasil didowngrade ke Free");
        setConfirmState(null);
      },
    },
  });

  useServerValidation(createMutation.error, form);

  const selectedPlan = useWatch({ control: form.control, name: "plan" }) ?? "pro";
  const items = data?.items || [];
  const pagination = data?.pagination || {
    page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
  };
  const hasActiveFilters = params.plan || params.status;
  const isPendingAction =
    approveMutation.isPending ||
    cancelMutation.isPending ||
    failMutation.isPending ||
    downgradeMutation.isPending;

  const handleSort = (field: AdminSubscriptionSortField) => {
    if (currentSortBy === field) {
      setParam(
        "sort_order",
        params.sort_order === "asc" ? "desc" : "asc",
        false,
      );
      return;
    }

    setParams({ sort_by: field, sort_order: "asc" }, false);
  };

  const handleConfirmAction = () => {
    if (!confirmState) {
      return;
    }

    const { action, subscription } = confirmState;

    if (action === "approve") {
      approveMutation.mutate({ id: subscription.id });
      return;
    }

    if (action === "cancel") {
      cancelMutation.mutate({ id: subscription.id });
      return;
    }

    if (action === "fail") {
      failMutation.mutate({ id: subscription.id });
      return;
    }

    if (subscription.user?.id || subscription.user_id) {
      downgradeMutation.mutate({
        userId: subscription.user?.id || subscription.user_id || "",
      });
    }
  };

  const confirmTitle =
    confirmState?.action === "approve"
      ? "Approve subscription?"
      : confirmState?.action === "cancel"
        ? "Batalkan subscription?"
        : confirmState?.action === "fail"
          ? "Tandai subscription gagal?"
          : "Force downgrade user?";

  const confirmDescription =
    confirmState?.action === "approve"
      ? "Subscription pending akan diaktifkan untuk user."
      : confirmState?.action === "cancel"
        ? "Subscription ini akan dibatalkan dan tidak lagi dipakai sebagai transaksi aktif."
        : confirmState?.action === "fail"
          ? "Subscription pending akan ditandai sebagai gagal."
          : "User akan dipaksa kembali ke plan Free.";

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari user, email, order ID, payment type..."
            value={searchInput}
            onChange={(event) => handleSearchInput(event.target.value)}
            onKeyDown={handleSearchSubmit}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={params.plan || "all"}
            onValueChange={(value) =>
              setParam("plan", value === "all" ? "" : value, true)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Pilih plan" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">Semua Plan</SelectItem>
              {PLAN_OPTIONS.map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {SUBSCRIPTION_PLAN_LABELS[plan]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={params.status || "all"}
            onValueChange={(value) =>
              setParam("status", value === "all" ? "" : value, true)
            }
          >
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">Semua Status</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {SUBSCRIPTION_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setParams({ plan: "", status: "" }, true)}
              className="text-muted-foreground"
            >
              Reset Filter
            </Button>
          ) : null}

          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Manual Subscription
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="uppercase text-xs font-medium tracking-wide min-w-[240px]">
                  Pengguna
                </TableHead>
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Plan
                </TableHead>
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Status
                </TableHead>
                <TableHead>
                  <SortableHeader
                    field="amount"
                    onSort={handleSort}
                    activeField={currentSortBy}
                    sortOrder={params.sort_order}
                  >
                    Nominal
                  </SortableHeader>
                </TableHead>
                <TableHead className="uppercase text-xs font-medium tracking-wide min-w-[260px]">
                  Pembayaran
                </TableHead>
                <TableHead>
                  <SortableHeader
                    field="expires_at"
                    onSort={handleSort}
                    activeField={currentSortBy}
                    sortOrder={params.sort_order}
                  >
                    Aktif Sampai
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    field="created_at"
                    onSort={handleSort}
                    activeField={currentSortBy}
                    sortOrder={params.sort_order}
                  >
                    Dibuat
                  </SortableHeader>
                </TableHead>
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
                        Memuat data langganan...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileStack className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-base font-medium">
                        Tidak ada data langganan
                      </p>
                      <p className="text-sm">
                        Transaksi subscription user akan muncul di halaman ini.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((subscription, index) => {
                  const {
                    canApprove,
                    canFail,
                    canCancel,
                    canDowngrade,
                  } = getSubscriptionActionAvailability(subscription);

                  return (
                    <TableRow
                      key={subscription.id}
                      className={cn(
                        index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      )}
                    >
                      <TableCell className="max-w-[240px]">
                        <div className="space-y-1">
                          <p className="font-medium truncate">
                            {getSubscriptionUserLabel(subscription)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {getSubscriptionUserMeta(subscription)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">
                          {SUBSCRIPTION_PLAN_LABELS[subscription.plan]}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={getSubscriptionStatusBadgeVariant(
                            subscription.status,
                          )}
                        >
                          {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        {formatSubscriptionPrice(subscription.amount)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[260px]">
                        <div className="space-y-1">
                          {subscription.midtrans_payment_type ? (
                            <p className="truncate text-sm">
                              {subscription.midtrans_payment_type}
                            </p>
                          ) : null}
                          <p className="truncate text-xs">
                            {subscription.midtrans_order_id || subscription.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {subscription.expires_at
                          ? dayjs(subscription.expires_at).format(
                              "DD MMM YYYY, HH:mm",
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {subscription.created_at
                          ? dayjs(subscription.created_at).format(
                              "DD MMM YYYY, HH:mm",
                            )
                          : "-"}
                      </TableCell>
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
                            className="w-56 bg-popover z-50"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  paths.admin.subscriptions.detail.getHref(
                                    subscription.id,
                                  ),
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>

                            {(subscription.user?.id || subscription.user_id) && (
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    paths.admin.users.detail.getHref(
                                      subscription.user?.id ||
                                      subscription.user_id ||
                                        "",
                                    ),
                                  )
                                }
                              >
                                <User className="mr-2 h-4 w-4" />
                                Buka Detail User
                              </DropdownMenuItem>
                            )}

                            {(canApprove || canFail || canCancel || canDowngrade) && (
                              <DropdownMenuSeparator />
                            )}

                            {canApprove ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmState({
                                    action: "approve",
                                    subscription,
                                  })
                                }
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            ) : null}

                            {canFail ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmState({
                                    action: "fail",
                                    subscription,
                                  })
                                }
                              >
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Tandai Gagal
                              </DropdownMenuItem>
                            ) : null}

                            {canCancel ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmState({
                                    action: "cancel",
                                    subscription,
                                  })
                                }
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Batalkan
                              </DropdownMenuItem>
                            ) : null}

                            {canDowngrade ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmState({
                                    action: "downgrade",
                                    subscription,
                                  })
                                }
                                className="text-destructive focus:text-destructive"
                              >
                                <ArrowDownToLine className="mr-2 h-4 w-4" />
                                Force Downgrade
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.total_items > 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan</span>
              <Select
                value={String(params.per_page)}
                onValueChange={(value) => setParam("per_page", Number(value), true)}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {[10, 20, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
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
        ) : null}
      </div>

      <Dialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);

          if (!open) {
            form.reset({ user_id: "", plan: "pro" });
          }
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Buat Manual Subscription</DialogTitle>
            <DialogDescription>
              Masukkan User ID dan pilih plan untuk membuat transaksi subscription manual.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(
              (values) => createMutation.mutate(values),
              displayFormErrors,
            )}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>User ID</FieldLabel>
              <Input
                {...form.register("user_id")}
                placeholder="Masukkan ID user"
              />
              <FieldError>{form.formState.errors.user_id?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Plan</FieldLabel>
              <Select
                value={selectedPlan}
                onValueChange={(value) =>
                  form.setValue("plan", value as "pro" | "max", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih plan" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="max">Max</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{form.formState.errors.plan?.message}</FieldError>
            </Field>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={createMutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmState !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmState(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPendingAction}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleConfirmAction();
              }}
              disabled={isPendingAction}
              className={
                confirmState?.action === "downgrade"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {isPendingAction ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
