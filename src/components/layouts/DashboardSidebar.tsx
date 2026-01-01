import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FileText,
  ChevronDown,
  ChevronRight,
  User,
  Lock,
  LogOut,
  FolderOpen,
  BookOpen,
  FileStack,
  Shield,
  Heart,
  Users,
  Sun,
  Moon,
  Briefcase,
  Bookmark,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DonationModal } from "@/components/DonationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { paths } from "@/config/paths";
import { useAuth } from "@/contexts/AuthContext";
import { buildImageUrl } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: paths.dashboard.getHref(),
    icon: LayoutDashboard,
  },
  {
    title: "Lamaran Kerja",
    url: paths.applications.list.getHref(),
    icon: Briefcase,
  },
  {
    title: "Surat Lamaran Kerja",
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

const blogMenuItems = [
  { title: "Blog", url: paths.admin.blogs.list.getHref() },
  { title: "Kategori", url: paths.admin.blogs.categories.getHref() },
  { title: "Tag", url: paths.admin.blogs.tags.getHref() },
];

const jobMenuItems = [
  { title: "Lowongan Kerja", url: paths.admin.jobs.list.getHref() },
  { title: "Perusahaan", url: paths.admin.jobs.companies.getHref() },
  { title: "Role Pekerjaan", url: paths.admin.jobs.roles.getHref() },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const isCollapsed = state === "collapsed";
  const [blogOpen, setBlogOpen] = useState(
    location.pathname.startsWith("/admin/blogs") ||
      location.pathname.startsWith("/admin/blogs/m")
  );
  const [jobOpen, setJobOpen] = useState(
    location.pathname.startsWith("/admin/jobs")
  );
  const [donationOpen, setDonationOpen] = useState(false);

  const isAdmin =
    isAuthenticated &&
    user &&
    (user.role === "admin" || user.role === "superadmin");

  const handleLogout = () => {
    logout();
    navigate(paths.auth.login.getHref());
  };

  const isActive = (path: string) => {
    if (path === paths.dashboard.getHref()) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isBlogActive =
    location.pathname.startsWith("/admin/blogs") ||
    location.pathname.startsWith("/admin/blogs/m");

  const isJobActive = location.pathname.startsWith("/admin/jobs");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {isAuthenticated && user && (
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
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.charAt(0)}
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
              <DropdownMenuItem
                onClick={() => navigate(paths.jobs.savedJobs.getHref())}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Pekerjaan Tersimpan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground mb-2">Tema</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors ${
                      theme === "light"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Sun className="h-3 w-3" />
                    Terang
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors ${
                      theme === "dark"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Moon className="h-3 w-3" />
                    Gelap
                  </button>
                </div>
              </div>
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
        )}
      </SidebarHeader>

      <SidebarContent className="pt-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/30 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-border/80">
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

              {/* Admin Section Divider */}
              {isAdmin && !isCollapsed && (
                <div className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      ADMIN
                    </span>
                    <Separator className="flex-1" />
                  </div>
                </div>
              )}

              {/* Admin Dashboard */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="lg" tooltip="Dashboard">
                    <NavLink
                      to={paths.admin.dashboard.getHref()}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        isCollapsed
                          ? "justify-center px-2 py-3"
                          : "gap-3 px-3 py-3",
                        isActive(paths.admin.dashboard.getHref())
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <LayoutDashboard className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">Dashboard</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Users Management */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="lg" tooltip="Users">
                    <NavLink
                      to={paths.admin.users.list.getHref()}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        isCollapsed
                          ? "justify-center px-2 py-3"
                          : "gap-3 px-3 py-3",
                        isActive(paths.admin.users.list.getHref())
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <Users className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">Users</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Jobs Menu with Dropdown */}
              {isAdmin && (
                <SidebarMenuItem>
                  <Collapsible open={jobOpen} onOpenChange={setJobOpen}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        tooltip="Lowongan Kerja"
                        className={cn(
                          "flex items-center rounded-lg transition-colors w-full",
                          isCollapsed
                            ? "justify-center px-2 py-3"
                            : "gap-3 px-3 py-3",
                          isJobActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <Briefcase className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="font-medium flex-1 text-left">
                              Lowongan Kerja
                            </span>
                            {jobOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent className="mt-1">
                        {jobMenuItems.map((item) => (
                          <NavLink
                            key={item.url}
                            to={item.url}
                            className={cn(
                              "flex items-center gap-3 py-2 pl-8 pr-3 rounded-lg text-sm transition-colors",
                              location.pathname === item.url
                                ? "text-foreground font-medium"
                                : "hover:bg-muted/50 text-muted-foreground"
                            )}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {item.title}
                          </NavLink>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </SidebarMenuItem>
              )}

              {/* Blog Menu with Dropdown */}
              {isAdmin && (
                <SidebarMenuItem>
                  <Collapsible open={blogOpen} onOpenChange={setBlogOpen}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        tooltip="Blog"
                        className={cn(
                          "flex items-center rounded-lg transition-colors w-full",
                          isCollapsed
                            ? "justify-center px-2 py-3"
                            : "gap-3 px-3 py-3",
                          isBlogActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <BookOpen className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="font-medium flex-1 text-left">
                              Blog
                            </span>
                            {blogOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent className="mt-1">
                        {blogMenuItems.map((item) => (
                          <NavLink
                            key={item.url}
                            to={item.url}
                            className={cn(
                              "flex items-center gap-3 py-2 pl-8 pr-3 rounded-lg text-sm transition-colors",
                              location.pathname === item.url
                                ? "text-foreground font-medium"
                                : "hover:bg-muted/50 text-muted-foreground"
                            )}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {item.title}
                          </NavLink>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </SidebarMenuItem>
              )}

              {/* Template Menu - Changed to regular button */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="lg" tooltip="Template">
                    <NavLink
                      to={paths.admin.templates.list.getHref()}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        isCollapsed
                          ? "justify-center px-2 py-3"
                          : "gap-3 px-3 py-3",
                        isActive(paths.admin.templates.list.getHref())
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <FileStack className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">Template</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn(isCollapsed ? "p-2" : "p-4")}>
        <Button
          onClick={() => setDonationOpen(true)}
          className={cn(
            "w-full bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer",
            isCollapsed ? "p-2" : "gap-2"
          )}
          size={isCollapsed ? "icon" : "default"}
        >
          <Heart className="h-5 w-5 fill-white" />
          {!isCollapsed && (
            <span className="font-semibold">Donasi Sekarang</span>
          )}
        </Button>
      </SidebarFooter>

      <DonationModal open={donationOpen} onOpenChange={setDonationOpen} />
    </Sidebar>
  );
}
