import { dayjs } from "@/lib/date";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
  UserCheck,
  Clock,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  type UserRole,
} from "@/types/user";
import type { User } from "@/types/user";
import { SUBSCRIPTION_PLAN_LABELS } from "@/features/subscriptions/utils";

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

export const UserDetail = ({ user }: { user: User }) => {
  const subscriptionPlanLabel = user.subscription_plan
    ? SUBSCRIPTION_PLAN_LABELS[user.subscription_plan]
    : "-";
  const lastLoginLabel = user.last_login_at
    ? dayjs(user.last_login_at).format("DD MMMM YYYY, HH:mm")
    : "Belum pernah login";

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
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Login Terakhir</p>
                  <p className="font-medium">
                    {lastLoginLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/70 pt-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Plan Langganan</p>
              <p className="font-medium">{subscriptionPlanLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Langganan Berakhir</p>
              <p className="font-medium">
                {user.subscription_expires_at
                  ? dayjs(user.subscription_expires_at).format(
                      "DD MMMM YYYY, HH:mm",
                    )
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Unduhan Hari Ini</p>
              <p className="font-medium">{user.download_today_count ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Unduhan</p>
              <p className="font-medium">{user.download_total_count ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4">Status Akun</h3>
        {(user.status_reason || user.suspended_until) ? (
          <div className="space-y-1 text-sm text-muted-foreground">
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
        ) : (
          <p className="text-sm text-muted-foreground">-</p>
        )}
      </div>
    </div>
  );
};
