import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Ban,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { mockUsers } from "@/data/mockUsers";
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  type UserRole,
  type UserStatus,
} from "@/types/user";

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

const getStatusIcon = (status: UserStatus) => {
  if (status === "active") return <UserCheck className="h-4 w-4" />;
  if (status === "suspended") return <UserX className="h-4 w-4" />;
  return <Ban className="h-4 w-4" />;
};

const AdminUserShow = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams<{ id: string }>();

  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">User tidak ditemukan.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Detail User"
        subtitle="Informasi lengkap tentang pengguna."
      />

      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <Badge
                  variant={getRoleBadgeVariant(user.role)}
                  className="gap-1"
                >
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
                  {getStatusIcon(user.status)}
                  {
                    USER_STATUS_OPTIONS.find((opt) => opt.value === user.status)
                      ?.label
                  }
                </Badge>
              </div>
            </div>
            <Button onClick={() => navigate(`/admin/users/${user.id}/edit`)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit User
            </Button>
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
                      {format(
                        new Date(user.created_at),
                        "dd MMMM yyyy, HH:mm",
                        { locale: id }
                      )}
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
                      {format(
                        new Date(user.updated_at),
                        "dd MMMM yyyy, HH:mm",
                        { locale: id }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUserShow;
