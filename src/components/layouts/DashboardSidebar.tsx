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

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: FileText,
  },
  {
    title: "Application Letter",
    url: "/application-letters",
    icon: FileText,
  },
  {
    title: "CV",
    url: "/cvs",
    icon: FileText,
  },
  {
    title: "Portfolio",
    url: "/portfolios",
    icon: FolderOpen,
  },
];

const blogMenuItems = [
  { title: "Semua Blog", url: "/blogs" },
  { title: "Buat Blog", url: "/blogs/create" },
  { title: "Kategori", url: "/categories" },
  { title: "Tag", url: "/tags" },
];

const templateMenuItems = [
  { title: "Semua Template", url: "/templates" },
  { title: "Buat Template", url: "/templates/create" },
];

// Mock user data - replace with actual user data later
const mockUser = {
  name: "Jendra Bayu",
  email: "jendra455@gmail.com",
  avatar: "",
};

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const isCollapsed = state === "collapsed";
  const [blogOpen, setBlogOpen] = useState(
    location.pathname.startsWith("/blogs") ||
      location.pathname === "/categories" ||
      location.pathname === "/tags"
  );
  const [templateOpen, setTemplateOpen] = useState(
    location.pathname.startsWith("/templates")
  );
  const [donationOpen, setDonationOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/applications") {
      return location.pathname.startsWith("/applications");
    }
    return location.pathname === path;
  };

  const isBlogActive =
    location.pathname.startsWith("/blogs") ||
    location.pathname === "/categories" ||
    location.pathname === "/tags";
  const isTemplateActive = location.pathname.startsWith("/templates");

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
                <AvatarImage src={mockUser.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {mockUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">
                      {mockUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {mockUser.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover z-50">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground">{mockUser.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/change-password")}>
              <Lock className="h-4 w-4 mr-2" />
              Change Password
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
              onClick={() => navigate("/auth/login")}
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
                <SidebarMenuButton asChild size="lg" tooltip="Dashboard Admin">
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
                      <span className="font-medium">Dashboard Admin</span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Users Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" tooltip="Users">
                  <NavLink
                    to="/admin/users"
                    className={cn(
                      "flex items-center rounded-lg transition-colors",
                      isCollapsed
                        ? "justify-center px-2 py-3"
                        : "gap-3 px-3 py-3",
                      location.pathname.startsWith("/admin/users")
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <Users className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium">Users</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Blog Menu with Dropdown */}
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

              {/* Template Menu with Dropdown */}
              <SidebarMenuItem>
                <Collapsible open={templateOpen} onOpenChange={setTemplateOpen}>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("border-t", isCollapsed ? "p-2" : "p-4")}>
        <Button
          onClick={() => setDonationOpen(true)}
          className={cn(
            "w-full bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300",
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
