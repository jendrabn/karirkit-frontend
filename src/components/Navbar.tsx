import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  Home,
  FileText,
  Briefcase,
  FolderOpen,
  Globe,
  Sun,
  Moon,
  LayoutDashboard,
  Bookmark,
} from "lucide-react";
import logo from "@/assets/images/logo.png";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { paths } from "@/config/paths";
import { useAuth } from "@/contexts/AuthContext";
import { buildImageUrl } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "react-router";

const navLinks = [
  { href: paths.home.getHref(), label: "Beranda", icon: Home },
  { href: "/#application-tracker", label: "Fitur", icon: Briefcase },
  { href: paths.jobs.list.getHref(), label: "Info Loker", icon: Briefcase },
  { href: paths.blog.list.getHref(), label: "Blog", icon: Globe },
];

interface NavbarProps {
  onLoginToggle?: () => void;
}

export function Navbar({ onLoginToggle }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const [mobileLanguageOpen] = useState(false);
  const [mobileThemeOpen, setMobileThemeOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    if (onLoginToggle) {
      onLoginToggle();
    }
  };

  const handleHashNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Check if the href contains a hash
    if (href.includes("#")) {
      e.preventDefault();
      const hash = href.split("#")[1];

      const scrollToElement = () => {
        const element = document.getElementById(hash);
        if (element) {
          // Get navbar height for offset (64px = h-16)
          const navbarHeight = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      };

      // If we're not on the home page, navigate to home first
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete, then scroll
        setTimeout(scrollToElement, 150);
      } else {
        // If we're already on home page, just scroll
        scrollToElement();
      }
    }
  };

  // Handle hash navigation on page load or location change
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1); // Remove the '#' character
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link to={paths.home.getHref()} className="flex items-center gap-2">
            <img src={logo} alt="KarirKit Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => handleHashNavigation(e, link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={buildImageUrl(user.avatar)}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={paths.dashboard.getHref()}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={paths.applications.list.getHref()}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Lamaran Kerja
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={paths.applicationLetters.list.getHref()}>
                      <FileText className="mr-2 h-4 w-4" />
                      Surat Lamaran
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={paths.cvs.list.getHref()}>
                      <FileText className="mr-2 h-4 w-4" />
                      CV
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={paths.portfolios.list.getHref()}>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Portofolio
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={paths.jobs.savedJobs.getHref()}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Pekerjaan Tersimpan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={paths.account.profile.getHref()}>
                      <User className="mr-2 h-4 w-4" />
                      Akun
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="pointer-events-none opacity-60 select-none">
                      <Globe className="mr-2 h-4 w-4" />
                      Bahasa Indonesia
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-popover">
                        <DropdownMenuItem className="cursor-pointer">
                          Bahasa Indonesia
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          English
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                  >
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    {theme === "dark" ? "Terang" : "Gelap"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to={paths.auth.login.getHref()}>Masuk</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to={paths.auth.register.getHref()}>Daftar</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Theme Toggle & Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {/* Mobile User Profile Section - When Logged In */}
              {isAuthenticated && user && (
                <div className="pb-4 mb-2 border-b border-border">
                  <Collapsible
                    open={mobileUserMenuOpen}
                    onOpenChange={setMobileUserMenuOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={buildImageUrl(user.avatar)}
                            alt={user.name}
                          />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          mobileUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-1">
                      <Link
                        to={paths.account.profile.getHref()}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Akun
                      </Link>
                      <Link
                        to={paths.portfolios.list.getHref()}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FolderOpen className="h-4 w-4" />
                        Portofolio
                      </Link>
                      <Link
                        to={paths.jobs.savedJobs.getHref()}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Bookmark className="h-4 w-4" />
                        Pekerjaan Tersimpan
                      </Link>

                      {/* Language Submenu */}
                      <Collapsible
                        open={mobileLanguageOpen}
                        className="pointer-events-none opacity-60 select-none"
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4" />
                            Bahasa Indonesia
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              mobileLanguageOpen ? "rotate-180" : ""
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-10 pt-1 space-y-1">
                          <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                            Bahasa Indonesia
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                            English
                          </button>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Theme Submenu */}
                      <Collapsible
                        open={mobileThemeOpen}
                        onOpenChange={setMobileThemeOpen}
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                          <div className="flex items-center gap-3">
                            {theme === "dark" ? (
                              <Moon className="h-4 w-4" />
                            ) : (
                              <Sun className="h-4 w-4" />
                            )}
                            Tema
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              mobileThemeOpen ? "rotate-180" : ""
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-10 pt-1 space-y-1">
                          <button
                            onClick={() => setTheme("light")}
                            className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                          >
                            <Sun className="h-4 w-4" />
                            Terang
                          </button>
                          <button
                            onClick={() => setTheme("dark")}
                            className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                          >
                            <Moon className="h-4 w-4" />
                            Gelap
                          </button>
                        </CollapsibleContent>
                      </Collapsible>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              {/* Navigation Links */}
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={(e) => {
                      handleHashNavigation(e, link.href);
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Auth Section */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-border">
                {isAuthenticated && user ? (
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to={paths.auth.login.getHref()}>Masuk</Link>
                    </Button>
                    <Button variant="default" className="flex-1" asChild>
                      <Link to={paths.auth.register.getHref()}>Daftar</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
