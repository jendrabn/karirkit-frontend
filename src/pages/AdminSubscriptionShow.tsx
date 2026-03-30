import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { paths } from "@/config/paths";
import { dayjs } from "@/lib/date";
import { useAdminSubscription } from "@/features/admin/subscriptions/api/get-subscription";
import { useApproveAdminSubscription } from "@/features/admin/subscriptions/api/approve-subscription";
import { useCancelAdminSubscription } from "@/features/admin/subscriptions/api/cancel-subscription";
import { useDowngradeAdminSubscriptionUser } from "@/features/admin/subscriptions/api/downgrade-user-subscription";
import { useFailAdminSubscription } from "@/features/admin/subscriptions/api/fail-subscription";
import {
  formatSubscriptionPrice,
  SUBSCRIPTION_PLAN_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
} from "@/features/subscriptions/utils";
import type { SubscriptionStatus } from "@/types/subscription";

const getStatusBadgeVariant = (status: SubscriptionStatus) => {
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

type ConfirmAction = "approve" | "cancel" | "fail" | "downgrade" | null;

export default function AdminSubscriptionShow() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const { data: subscription, isLoading, error } = useAdminSubscription({
    id: id!,
    queryConfig: {
      enabled: !!id,
    },
  });

  const approveMutation = useApproveAdminSubscription({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Subscription berhasil di-approve");
        setConfirmAction(null);
      },
    },
  });
  const cancelMutation = useCancelAdminSubscription({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Subscription berhasil dibatalkan");
        setConfirmAction(null);
      },
    },
  });
  const failMutation = useFailAdminSubscription({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Subscription berhasil ditandai gagal");
        setConfirmAction(null);
      },
    },
  });
  const downgradeMutation = useDowngradeAdminSubscriptionUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("User berhasil didowngrade ke Free");
        setConfirmAction(null);
      },
    },
  });

  const isPendingAction =
    approveMutation.isPending ||
    cancelMutation.isPending ||
    failMutation.isPending ||
    downgradeMutation.isPending;

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: paths.dashboard.getHref() },
          { label: "Langganan", href: paths.admin.subscriptions.list.getHref() },
          { label: "Detail Subscription" },
        ]}
      >
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat detail subscription...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !subscription) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: paths.dashboard.getHref() },
          { label: "Langganan", href: paths.admin.subscriptions.list.getHref() },
          { label: "Subscription Tidak Ditemukan" },
        ]}
      >
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Data subscription tidak ditemukan.</p>
          <Button onClick={() => navigate(paths.admin.subscriptions.list.getHref())}>
            Kembali ke daftar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const canApprove = subscription.status === "pending";
  const canFail = subscription.status === "pending";
  const canCancel = ["pending", "paid"].includes(subscription.status);
  const canDowngrade = !!subscription.user?.id;

  const confirmDescription =
    confirmAction === "approve"
      ? "Subscription pending akan diaktifkan."
      : confirmAction === "cancel"
        ? "Subscription akan dibatalkan dan user tidak lagi menggunakan transaksi ini."
        : confirmAction === "fail"
          ? "Subscription pending akan ditandai gagal."
          : "User akan dipaksa kembali ke plan Free.";

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: paths.dashboard.getHref() },
        { label: "Langganan", href: paths.admin.subscriptions.list.getHref() },
        { label: "Detail Subscription" },
      ]}
    >
      <MinimalSEO
        title="Detail Subscription"
        description="Detail transaksi subscription user."
        noIndex={true}
      />
      <PageHeader
        title="Detail Subscription"
        subtitle={subscription.midtrans_order_id || subscription.id}
        showBackButton
        backButtonUrl={paths.admin.subscriptions.list.getHref()}
      >
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirmAction("approve")}
            disabled={!canApprove || isPendingAction}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirmAction("fail")}
            disabled={!canFail || isPendingAction}
          >
            Tandai Gagal
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirmAction("cancel")}
            disabled={!canCancel || isPendingAction}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setConfirmAction("downgrade")}
            disabled={!canDowngrade || isPendingAction}
          >
            Force Downgrade
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span>Ringkasan Subscription</span>
                <Badge variant={getStatusBadgeVariant(subscription.status)}>
                  {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Plan
                </p>
                <p className="text-lg font-semibold">
                  {SUBSCRIPTION_PLAN_LABELS[subscription.plan]}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Nominal
                </p>
                <p className="text-lg font-semibold">
                  {formatSubscriptionPrice(subscription.amount)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Payment Type
                </p>
                <p>{subscription.midtrans_payment_type || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Order ID
                </p>
                <p className="break-all font-mono text-sm">
                  {subscription.midtrans_order_id || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Dibuat
                </p>
                <p>{subscription.created_at ? dayjs(subscription.created_at).format("DD MMM YYYY, HH:mm") : "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Diperbarui
                </p>
                <p>{subscription.updated_at ? dayjs(subscription.updated_at).format("DD MMM YYYY, HH:mm") : "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Paid At
                </p>
                <p>{subscription.paid_at ? dayjs(subscription.paid_at).format("DD MMM YYYY, HH:mm") : "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Expires At
                </p>
                <p>{subscription.expires_at ? dayjs(subscription.expires_at).format("DD MMM YYYY, HH:mm") : "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">
                    {subscription.user?.name || subscription.user?.email || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{subscription.user?.username || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.user?.email || subscription.user_id || "-"}
                  </p>
                </div>
              </div>
              {subscription.user?.id ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    navigate(paths.admin.users.detail.getHref(subscription.user!.id))
                  }
                >
                  Buka Detail User
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Subscription ID
                  </p>
                  <p className="break-all font-mono">{subscription.id}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Plan User Saat Ini
                  </p>
                  <p>
                    {subscription.user?.subscription_plan
                      ? SUBSCRIPTION_PLAN_LABELS[subscription.user.subscription_plan]
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Subscription User Expire
                  </p>
                  <p>
                    {subscription.user?.subscription_expires_at
                      ? dayjs(subscription.user.subscription_expires_at).format(
                          "DD MMM YYYY, HH:mm",
                        )
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Notes
                  </p>
                  <p>{subscription.notes || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={confirmAction !== null} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "approve"
                ? "Approve subscription?"
                : confirmAction === "cancel"
                  ? "Cancel subscription?"
                  : confirmAction === "fail"
                    ? "Tandai gagal?"
                    : "Force downgrade user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPendingAction}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmAction === "downgrade"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
              disabled={isPendingAction}
              onClick={(event) => {
                event.preventDefault();

                if (confirmAction === "approve") {
                  approveMutation.mutate({ id: subscription.id });
                  return;
                }

                if (confirmAction === "cancel") {
                  cancelMutation.mutate({ id: subscription.id });
                  return;
                }

                if (confirmAction === "fail") {
                  failMutation.mutate({ id: subscription.id });
                  return;
                }

                if (confirmAction === "downgrade" && subscription.user?.id) {
                  downgradeMutation.mutate({ userId: subscription.user.id });
                }
              }}
            >
              {isPendingAction ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
