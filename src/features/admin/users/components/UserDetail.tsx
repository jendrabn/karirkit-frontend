import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dayjs } from "@/lib/date";
import { Mail, Phone, Calendar, Shield, Ban, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  type UserRole,
} from "@/types/user";
import type { User } from "@/types/user";
import { useUpdateUser } from "../api/update-user";
import { useAuth } from "@/contexts/AuthContext";
import { useServerValidation } from "@/hooks/use-server-validation";
import { formatBytes } from "@/lib/utils";
import { toast } from "sonner";

const getRoleBadgeVariant = (role: UserRole) => {
  return role === "admin" ? "default" : "secondary";
};

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

export const UserDetail = ({ user }: { user: User }) => {
  const { user: authUser } = useAuth();
  const isSelf = authUser?.id === user.id;
  const storageStats = user.document_storage_stats;
  const storageLimit = user.document_storage_limit || 0;
  const storageUsed = storageStats?.used ?? 0;
  const storageRemaining =
    storageStats?.remaining ?? Math.max(storageLimit - storageUsed, 0);
  const storagePercentage = storageLimit
    ? Math.min(100, Math.round((storageUsed / storageLimit) * 100))
    : 0;
  const updateStatusMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Status akun berhasil diperbarui");
      },
      onError: () => {
        toast.error("Gagal memperbarui status user");
      },
    },
  });

  const form = useForm<z.infer<typeof userStatusSchema>>({
    resolver: zodResolver(userStatusSchema),
    defaultValues: {
      status: user.status || "active",
      status_reason: user.status_reason || "",
      suspended_until: user.suspended_until
        ? dayjs(user.suspended_until).local().format("YYYY-MM-DDTHH:mm")
        : "",
    },
  });

  useServerValidation(updateStatusMutation.error, form);

  useEffect(() => {
    form.reset({
      status: user.status || "active",
      status_reason: user.status_reason || "",
      suspended_until: user.suspended_until
        ? dayjs(user.suspended_until).local().format("YYYY-MM-DDTHH:mm")
        : "",
    });
  }, [form, user]);

  const statusValue = useWatch({
    control: form.control,
    name: "status",
  });
  const showSuspendedUntil = statusValue === "suspended";

  const handleStatusSubmit = form.handleSubmit((data) => {
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
  });

  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage
              src={user.avatar || undefined}
              className="object-cover"
            />

            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                <Shield className="h-3 w-3" />
                {
                  USER_ROLE_OPTIONS.find((opt) => opt.value === user.role)
                    ?.label
                }
              </Badge>
              <Badge
                variant={getStatusBadgeVariant(user.status)}
                className="gap-1"
              >
                {user.status === "active" ? (
                  <UserCheck className="h-3 w-3" />
                ) : (
                  <Ban className="h-3 w-3" />
                )}
                {
                  USER_STATUS_OPTIONS.find((opt) => opt.value === user.status)
                    ?.label
                }
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informasi Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Telepon</p>
                  <p className="font-medium">{user.phone || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informasi Akun</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Dibuat</p>
                  <p className="font-medium">
                    {user.created_at
                      ? dayjs(user.created_at).format("DD MMMM YYYY, HH:mm")
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Terakhir Diupdate
                  </p>
                  <p className="font-medium">
                    {user.updated_at
                      ? dayjs(user.updated_at).format("DD MMMM YYYY, HH:mm")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-3 border-t border-border/70 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">Penyimpanan Dokumen</p>
            <p className="text-sm text-muted-foreground">
              {formatBytes(user.document_storage_limit)}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Digunakan {formatBytes(storageUsed)}</span>
            <span>Tersisa {formatBytes(storageRemaining)}</span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </div>
      </div>

      <Separator />

      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4">Status Akun</h3>
        {(user.status_reason || user.suspended_until) && (
          <div className="mb-4 space-y-1 text-sm text-muted-foreground">
            {user.status_reason && (
              <p>
                Alasan:{" "}
                <span className="text-foreground">{user.status_reason}</span>
              </p>
            )}
            {user.suspended_until && (
              <p>
                Sampai:{" "}
                <span className="text-foreground">
                  {dayjs(user.suspended_until).format("DD MMMM YYYY, HH:mm")}
                </span>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={statusValue}
                onValueChange={(value) => {
                  form.setValue("status", value as User["status"], {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                disabled={isSelf || updateStatusMutation.isPending}
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
              <FieldError>{form.formState.errors.status?.message}</FieldError>
            </Field>

            {showSuspendedUntil && (
              <Field>
                <FieldLabel>Suspend Sampai</FieldLabel>
                <Input
                  type="datetime-local"
                  {...form.register("suspended_until")}
                  disabled={isSelf || updateStatusMutation.isPending}
                />
                <FieldError>
                  {form.formState.errors.suspended_until?.message}
                </FieldError>
              </Field>
            )}
          </div>

          <Field>
            <FieldLabel>Catatan Status</FieldLabel>
            <Textarea
              {...form.register("status_reason")}
              rows={2}
              placeholder="Catatan untuk audit (opsional)"
              disabled={isSelf || updateStatusMutation.isPending}
            />
            <FieldDescription>
              Tampilkan alasan status ini pada admin lain.
            </FieldDescription>
            <FieldError>
              {form.formState.errors.status_reason?.message}
            </FieldError>
          </Field>

          {isSelf && (
            <p className="text-sm text-muted-foreground">
              Anda tidak dapat mengubah status akun Anda sendiri.
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSelf || updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending
                ? "Menyimpan..."
                : "Simpan Status"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
