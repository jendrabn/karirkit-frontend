import { useNavigate } from "react-router";
import { dayjs } from "@/lib/date";
import {
  Pencil,
  Mail,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  USER_ROLE_OPTIONS,
  type UserRole,
} from "@/types/user";
import type { User } from "../api/get-users";

const getRoleBadgeVariant = (role: UserRole) => {
  return role === "admin" ? "default" : "secondary";
};

export const UserDetail = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  return (
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
                    {user.created_at ? dayjs(user.created_at).format("DD MMMM YYYY, HH:mm") : "-"}
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
                    {user.updated_at ? dayjs(user.updated_at).format("DD MMMM YYYY, HH:mm") : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
