import { useNavigate, useParams } from "react-router";
import { createElement, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Shield,
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { useUser } from "@/features/admin/users/api/get-user";
import { MinimalSEO } from "@/components/MinimalSEO";
import { paths } from "@/config/paths";
import { useDeleteUser } from "@/features/admin/users/api/delete-user";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dayjs, formatDate, formatDateTime } from "@/lib/date";
import { formatNumber } from "@/lib/utils";
import { SOCIAL_PLATFORM_LABELS } from "@/types/social";
import type { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStatus } from "@/features/admin/users/api/update-user-status";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerValidation } from "@/hooks/use-server-validation";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ContactItem, InfoItem, RichText } from "@/components/ui/display-info";
import { SUBSCRIPTION_PLAN_LABELS } from "@/features/subscriptions/utils";
import { getEnumBadgeClassName } from "@/lib/enum-badges";

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

const STATUS_ICON_MAP: Partial<
  Record<User["status"], typeof CheckCircle>
> = {
  active: CheckCircle,
  suspended: AlertCircle,
  banned: XCircle,
};

const getGenderLabel = (gender: User["gender"]) => {
  if (gender === "male") {
    return "Laki-laki";
  }

  if (gender === "female") {
    return "Perempuan";
  }

  return "-";
};

const AdminUserShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { data: user, isLoading, error } = useUser({
    id: id!,
    queryConfig: {
      enabled: !!id,
    },
  });

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

  const statusForm = useForm<z.infer<typeof userStatusSchema>>({
    resolver: zodResolver(userStatusSchema),
    defaultValues: {
      status: "active",
      status_reason: "",
      suspended_until: "",
    },
  });

  useServerValidation(updateStatusMutation.error, statusForm);

  useEffect(() => {
    if (!user) return;

    statusForm.reset({
      status: user.status || "active",
      status_reason: user.status_reason || "",
      suspended_until: user.suspended_until
        ? dayjs(user.suspended_until).local().format("YYYY-MM-DDTHH:mm")
        : "",
    });
  }, [statusForm, user]);

  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("User berhasil dihapus");
        navigate("/admin/users");
      },
    },
  });

  const isSelf = authUser?.id === user?.id;
  const statusValue = useWatch({
    control: statusForm.control,
    name: "status",
  });

  const applySuspendDays = (days: number) => {
    const nextDate = dayjs().add(days, "day").format("YYYY-MM-DDTHH:mm");
    statusForm.setValue("suspended_until", nextDate, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleDelete = () => {
    if (id) {
      deleteUserMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pengguna", href: paths.admin.users.list.getHref() },
          { label: "Detail Pengguna" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data pengguna...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pengguna", href: paths.admin.users.list.getHref() },
          { label: "User Tidak Ditemukan" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">User tidak ditemukan.</p>
          <Button onClick={() => navigate(paths.admin.users.list.getHref())}>
            Kembali ke Daftar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const roleLabel =
    USER_ROLE_OPTIONS.find((option) => option.value === user.role)?.label ||
    user.role;
  const statusLabel =
    USER_STATUS_OPTIONS.find((option) => option.value === user.status)?.label ||
    user.status;
  const statusIconComponent = STATUS_ICON_MAP[user.status] ?? AlertCircle;
  const totalDownloads =
    user.download_total_count ?? user.download_stats?.total_count ?? 0;
  const downloadTodayCount =
    user.download_today_count ?? user.download_stats?.today_count ?? 0;
  const emailVerifiedLabel = user.email_verified_at
    ? formatDateTime(user.email_verified_at)
    : "Belum terverifikasi";
  const lastLoginLabel = user.last_login_at
    ? formatDateTime(user.last_login_at)
    : "Belum pernah login";
  const subscriptionPlanLabel = user.subscription_plan
    ? SUBSCRIPTION_PLAN_LABELS[user.subscription_plan]
    : "-";

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pengguna", href: paths.admin.users.list.getHref() },
        { label: "Detail Pengguna" },
      ]}
    >
      <MinimalSEO
        title={user.name}
        description={`Informasi pengguna ${user.name}`}
        noIndex={true}
      />
      <PageHeader
        title={user.name}
        subtitle={`@${user.username}`}
        backButtonUrl={paths.admin.users.list.getHref()}
        showBackButton
      >
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStatusDialogOpen(true)}
            disabled={isSelf}
          >
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Ubah Status
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">Profil Pengguna</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={getEnumBadgeClassName("userRole", user.role)}
                  >
                    <Shield className="h-3 w-3" />
                    {roleLabel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getEnumBadgeClassName("userStatus", user.status)}
                  >
                    {createElement(statusIconComponent, {
                      className: "h-3 w-3",
                    })}
                    {statusLabel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 rounded-lg shrink-0">
                  <AvatarImage
                    src={user.avatar || undefined}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 space-y-1">
                  <p className="text-base font-semibold truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    @{user.username}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Headline"
                  value={user.headline}
                  icon={Briefcase}
                />
                <InfoItem label="Lokasi" value={user.location} icon={MapPin} />
                <InfoItem
                  label="Gender"
                  value={getGenderLabel(user.gender)}
                  icon={UserIcon}
                />
                <InfoItem
                  label="Tanggal Lahir"
                  value={user.birth_date ? formatDate(user.birth_date) : "-"}
                  icon={Calendar}
                />
              </div>

              {user.bio && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Bio
                    </p>
                    <RichText content={user.bio} emptyText="Belum ada bio" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">Aktivitas & Statistik</CardTitle>
                <Badge variant="outline" className="gap-1 text-xs uppercase">
                  <CheckCircle className="h-3 w-3" />
                  {formatNumber(totalDownloads)} total
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Unduhan Hari Ini"
                  value={formatNumber(downloadTodayCount)}
                  icon={Calendar}
                />
                <InfoItem
                  label="Total Unduhan"
                  value={formatNumber(totalDownloads)}
                  icon={CheckCircle}
                />
                <InfoItem
                  label="Login Terakhir"
                  value={lastLoginLabel}
                  icon={Clock}
                />
                <InfoItem
                  label="Email Terverifikasi"
                  value={
                    <Badge
                      variant="outline"
                      className={getEnumBadgeClassName(
                        "verificationStatus",
                        user.email_verified_at ? "true" : "false",
                      )}
                    >
                      {emailVerifiedLabel}
                    </Badge>
                  }
                  icon={Shield}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContactItem
                type="email"
                value={user.email}
                label="Email"
                icon={Mail}
              />
              <ContactItem
                type="phone"
                value={user.phone}
                label="Telepon"
                icon={Phone}
              />

              {user.social_links && user.social_links.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    {user.social_links.map((link) => (
                      <ContactItem
                        key={`${link.platform}-${link.url}`}
                        type="url"
                        value={link.url}
                        label={
                          SOCIAL_PLATFORM_LABELS[link.platform] || link.platform
                        }
                        icon={ExternalLink}
                      />
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="Role" value={roleLabel} icon={Shield} />
                <InfoItem
                  label="Status"
                  value={statusLabel}
                  icon={statusIconComponent}
                />
                <InfoItem
                  label="Plan Langganan"
                  value={
                    <Badge
                      variant="outline"
                      className={getEnumBadgeClassName(
                        "subscriptionPlan",
                        user.subscription_plan,
                      )}
                    >
                      {subscriptionPlanLabel}
                    </Badge>
                  }
                  icon={Briefcase}
                />
                <InfoItem
                  label="Email Terverifikasi"
                  value={
                    <Badge
                      variant="outline"
                      className={getEnumBadgeClassName(
                        "verificationStatus",
                        user.email_verified_at ? "true" : "false",
                      )}
                    >
                      {emailVerifiedLabel}
                    </Badge>
                  }
                  icon={CheckCircle}
                />
                <InfoItem
                  label="Login Terakhir"
                  value={lastLoginLabel}
                  icon={Clock}
                />
                <InfoItem
                  label="Tanggal Registrasi"
                  value={user.created_at ? formatDate(user.created_at) : "-"}
                  icon={Calendar}
                />
                <InfoItem
                  label="Langganan Berakhir"
                  value={
                    user.subscription_expires_at
                      ? formatDateTime(user.subscription_expires_at)
                      : "-"
                  }
                  icon={Clock}
                />
              </div>

              {(user.status_reason || user.suspended_until) && (
                <>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Detail Status
                    </p>
                    {user.status_reason && (
                      <p>
                        Alasan: <span className="font-medium">{user.status_reason}</span>
                      </p>
                    )}
                    {user.suspended_until && (
                      <p>
                        Suspend sampai:{" "}
                        <span className="font-medium">
                          {formatDateTime(user.suspended_until)}
                        </span>
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  User ID
                </p>
                <p className="text-xs font-mono bg-muted px-2 py-1.5 rounded break-all">
                  {user.id}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Dibuat"
                  value={user.created_at ? formatDateTime(user.created_at) : "-"}
                  icon={Clock}
                />
                <InfoItem
                  label="Diperbarui"
                  value={user.updated_at ? formatDateTime(user.updated_at) : "-"}
                  icon={Clock}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={statusDialogOpen}
        onOpenChange={(open) => {
          setStatusDialogOpen(open);
          if (!open && user) {
            statusForm.reset({
              status: user.status || "active",
              status_reason: user.status_reason || "",
              suspended_until: user.suspended_until
                ? dayjs(user.suspended_until).local().format("YYYY-MM-DDTHH:mm")
                : "",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ubah Status User</DialogTitle>
            <DialogDescription>
              {user
                ? `Perbarui status akun ${user.name}.`
                : "Pilih status akun yang sesuai."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={statusForm.handleSubmit((data) => {
              if (!user) return;

              const suspendedUntil =
                data.status === "suspended" && data.suspended_until
                  ? new Date(data.suspended_until).toISOString()
                  : undefined;

              updateStatusMutation.mutate({
                id: user.id,
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. User "{user.name}" akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminUserShow;
