import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, ExternalLink, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { useUser } from "@/features/admin/users/api/get-user";
import { UserDetail } from "@/features/admin/users/components/UserDetail";
import { Spinner } from "@/components/ui/spinner";
import { MinimalSEO } from "@/components/MinimalSEO";
import { paths } from "@/config/paths";
import { useDeleteUser } from "@/features/admin/users/api/delete-user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { dayjs } from "@/lib/date";
import { SOCIAL_PLATFORM_LABELS } from "@/types/social";
import type { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStatus } from "@/features/admin/users/api/update-user-status";
import { useForm } from "react-hook-form";
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
import { USER_STATUS_OPTIONS } from "@/types/user";

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

const InfoItem = ({
  label,
  value,
  isLink,
}: {
  label: string;
  value: string | number;
  isLink?: boolean;
}) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    {isLink && value ? (
      <a
        href={String(value)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline flex items-center gap-1 break-all"
      >
        {String(value)}
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    ) : (
      <p className="font-medium">{value === 0 ? "0" : value || "-"}</p>
    )}
  </div>
);

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

  const { data: user, isLoading } = useUser({
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
      onError: () => {
        toast.error("Gagal memperbarui status user");
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
  const statusValue = statusForm.watch("status");

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
        <div className="flex bg-background h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pengguna", href: paths.admin.users.list.getHref() },
          { label: "User Tidak Ditemukan" },
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">User tidak ditemukan.</p>
        </div>
      </DashboardLayout>
    );
  }

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
        title="Detail User"
        subtitle="Informasi lengkap tentang pengguna."
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

      <UserDetail user={user} />

      <div className="grid gap-6 mt-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profil & Personal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label="Headline" value={user.headline || "-"} />
            <InfoItem label="Lokasi" value={user.location || "-"} />
            <InfoItem label="Gender" value={getGenderLabel(user.gender)} />
            <InfoItem
              label="Tanggal Lahir"
              value={
                user.birth_date
                  ? dayjs(user.birth_date).format("DD MMMM YYYY")
                  : "-"
              }
            />
            <InfoItem label="Bio" value={user.bio || "-"} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Verifikasi & Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label="User ID" value={user.id} />
            <InfoItem
              label="Email Terverifikasi"
              value={
                user.email_verified_at
                  ? dayjs(user.email_verified_at).format("DD MMMM YYYY, HH:mm")
                  : "-"
              }
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Batasan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem
              label="Batas Download Harian"
              value={user.daily_download_limit}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Statistik Unduhan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem
              label="Batas Harian"
              value={user.download_stats?.daily_limit ?? "-"}
            />
            <InfoItem
              label="Unduhan Hari Ini"
              value={user.download_stats?.today_count ?? "-"}
            />
            <InfoItem
              label="Sisa Unduhan Hari Ini"
              value={user.download_stats?.remaining ?? "-"}
            />
            <InfoItem
              label="Total Unduhan"
              value={user.download_stats?.total_count ?? "-"}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          {user.social_links && user.social_links.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.social_links.map((link) => (
                <InfoItem
                  key={`${link.platform}-${link.url}`}
                  label={SOCIAL_PLATFORM_LABELS[link.platform] || link.platform}
                  value={link.url}
                  isLink
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">-</p>
          )}
        </Card>
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
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminUserShow;
