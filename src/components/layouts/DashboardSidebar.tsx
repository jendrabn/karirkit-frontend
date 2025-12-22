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
} from "lucide-react";
import { paths } from "@/config/paths";
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
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    url: paths.dashboard.getHref(),
    icon: LayoutDashboard,
  },
  {
    title: "Applications",
    url: paths.applications.list.getHref(),
    icon: FileText,
  },
  {
    title: "Application Letter",
    url: paths.applicationLetters.list.getHref(),
    icon: FileText,
  },
  {
    title: "CV",
    url: paths.cvs.list.getHref(),
    icon: FileText,
  },
  {
    title: "Portfolio",
    url: paths.portfolios.list.getHref(),
    icon: FolderOpen,
  },
];

const blogMenuItems = [
  { title: "Semua Blog", url: paths.admin.blogs.list.getHref() },
  { title: "Buat Blog", url: paths.admin.blogs.create.getHref() },
  { title: "Kategori", url: paths.admin.blogs.categories.getHref() },
  { title: "Tag", url: paths.admin.blogs.tags.getHref() },
];

const templateMenuItems = [
  { title: "Semua Template", url: paths.admin.templates.list.getHref() },
  { title: "Buat Template", url: paths.admin.templates.create.getHref() },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";
  const [blogOpen, setBlogOpen] = useState(
    location.pathname.startsWith(paths.admin.blogs.list.getHref()) ||
      location.pathname === paths.admin.blogs.categories.getHref() ||
      location.pathname === paths.admin.blogs.tags.getHref()
  );
  const [templateOpen, setTemplateOpen] = useState(
    location.pathname.startsWith(paths.admin.templates.list.getHref())
  );
  const [donationOpen, setDonationOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === paths.applications.list.getHref()) {
      return location.pathname.startsWith(paths.applications.list.getHref());
    }
    return location.pathname === path;
  };

  const isBlogActive =
    location.pathname.startsWith(paths.admin.blogs.list.getHref()) ||
    location.pathname === paths.admin.blogs.categories.getHref() ||
    location.pathname === paths.admin.blogs.tags.getHref();
  const isTemplateActive = location.pathname.startsWith(
    paths.admin.templates.list.getHref()
  );

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className={cn("border-b", isCollapsed ? "p-2" : "p-4")}>
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
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover z-50">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="h-4 w-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/change-password")}>
              <Lock className="h-4 w-4 mr-2" />
              Ubah Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/auth/login");
              }}
              className="text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

              {/* Admin Section - Only visible to admins */}
              {user?.role === "admin" && (
                <>
                  {/* Admin Section Divider */}
                  {!isCollapsed && (
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
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      tooltip="Dashboard Admin"
                    >
                      <NavLink
                        to="/admin/dashboard"
                        className={cn(
                          "flex items-center rounded-lg transition-colors",
                          isCollapsed
                            ? "justify-center px-2 py-3"
                            : "gap-3 px-3 py-3",
                          isActive("/admin/dashboard")
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

                  {/* Users Management */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild size="lg" tooltip="Users">
                      <NavLink
                        to={paths.admin.users.list.getHref()}
                        className={cn(
                          "flex items-center rounded-lg transition-colors",
                          isCollapsed
                            ? "justify-center px-2 py-3"
                            : "gap-3 px-3 py-3",
                          location.pathname.startsWith(
                            paths.admin.users.list.getHref()
                          )
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

                  {/* Admin Blog Menu with Dropdown */}
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

                  {/* Admin Template Menu with Dropdown */}
                  <SidebarMenuItem>
                    <Collapsible
                      open={templateOpen}
                      onOpenChange={setTemplateOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          tooltip="Template"
                          className={cn(
                            "flex items-center rounded-lg transition-colors w-full",
                            isCollapsed
                              ? "justify-center px-2 py-3"
                              : "gap-3 px-3 py-3",
                            isTemplateActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-foreground"
                          )}
                        >
                          <FileStack className="h-5 w-5 shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="font-medium flex-1 text-left">
                                Template
                              </span>
                              {templateOpen ? (
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
                          {templateMenuItems.map((item) => (
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
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("border-t", isCollapsed ? "p-2" : "p-4")}>
        <Button
          onClick={() => setDonationOpen(true)}
          className={cn(
            "w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300",
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
