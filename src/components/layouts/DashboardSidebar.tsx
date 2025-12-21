import { NavLink, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FileText,
  ChevronDown,
  User,
  Lock,
  LogOut,
  FolderOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildImageUrl, cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";

const menuItems = [
  {
    title: "Dashboard",
    url: paths.dashboard.getHref(),
    icon: LayoutDashboard,
  },
  {
    title: "Pelacak Lamaran",
    url: paths.applications.list.getHref(),
    icon: FileText,
  },
  {
    title: "Surat Lamaran",
    url: paths.applicationLetters.list.getHref(),
    icon: FileText,
  },
  {
    title: "CV",
    url: paths.cvs.list.getHref(),
    icon: FileText,
  },
  {
    title: "Portofolio",
    url: paths.portfolios.list.getHref(),
    icon: FolderOpen,
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, isLoading, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === paths.applications.list.getHref()) {
      return location.pathname.startsWith(paths.applications.list.getHref());
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate(paths.auth.login.getHref());
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className={cn("border-b", isCollapsed ? "p-2" : "p-4")}>
        {isLoading ? (
          <div
            className={cn(
              "flex items-center w-full",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <Skeleton
              className={cn(
                "shrink-0 rounded-full",
                isCollapsed ? "h-8 w-8" : "h-10 w-10"
              )}
            />
            {!isCollapsed && (
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            )}
          </div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center w-full rounded-lg hover:bg-muted transition-colors",
                  isCollapsed ? "justify-center p-2" : "gap-3 p-2"
                )}
              >
                <Avatar
                  className={cn(
                    "shrink-0",
                    isCollapsed ? "h-8 w-8" : "h-10 w-10"
                  )}
                >
                  <AvatarImage src={buildImageUrl(user.avatar)} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-popover z-50">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(paths.account.profile.getHref())}
              >
                <User className="h-4 w-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(paths.account.changePassword.getHref())}
              >
                <Lock className="h-4 w-4 mr-2" />
                Ubah Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg" tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        isCollapsed
                          ? "justify-center px-2 py-3"
                          : "gap-3 px-3 py-3",
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
