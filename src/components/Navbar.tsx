import { useState } from "react";
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
} from "lucide-react";
import logo from "@/assets/images/logo.png";
import { DonationModal } from "./DonationModal";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { paths } from "@/config/paths";
import { useAuth } from "@/contexts/AuthContext";
import { buildImageUrl } from "@/lib/utils";
import { Link } from "react-router";

const navLinks = [
  { href: paths.home.getHref(), label: "Beranda" },
  { href: "/#application-tracker", label: "Fitur" },
  { href: paths.blog.list.getHref(), label: "Blog" },
];

interface NavbarProps {
  onLoginToggle?: () => void;
}

export function Navbar({ onLoginToggle }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    if (onLoginToggle) {
      onLoginToggle();
    }
  };

  const handleFiturClick = () => {
    // If we're not on the home page, navigate to home with hash
    if (window.location.pathname !== "/") {
      window.location.href = "/#application-tracker";
    } else {
      // If we're already on home page, just scroll to the section
      const element = document.getElementById("application-tracker");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link to={paths.home.getHref()} className="flex items-center gap-2">
            <img src={logo} alt="KarirKit Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.label === "Fitur" ? (
                <button
                  key={link.href}
                  onClick={handleFiturClick}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <button
              onClick={() => setDonationModalOpen(true)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Donasi
            </button>
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
                    <a href={paths.home.getHref()}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <a href={paths.applications.list.getHref()}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Lamaran Kerja
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <a href={paths.applicationLetters.list.getHref()}>
                      <FileText className="mr-2 h-4 w-4" />
                      Surat Lamaran
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <a href={paths.cvs.list.getHref()}>
                      <FileText className="mr-2 h-4 w-4" />
                      CV
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <a href={paths.portfolios.list.getHref()}>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Portofolio
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <a href={paths.account.profile.getHref()}>
                      <User className="mr-2 h-4 w-4" />
                      Akun
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
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
                  <a href={paths.auth.login.getHref()}>Masuk</a>
                </Button>
                <Button variant="default" asChild>
                  <a href={paths.auth.register.getHref()}>Daftar</a>
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
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) =>
                link.label === "Fitur" ? (
                  <button
                    key={link.href}
                    onClick={() => {
                      handleFiturClick();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2 text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDonationModalOpen(true);
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary py-2 text-left"
              >
                Donasi
              </button>
              <div className="flex gap-3 pt-4 border-t border-border">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={buildImageUrl(user.avatar)}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">
                      {user.name}
                    </span>
                    <Button
                      variant="outline"
                      className="ml-auto"
                      onClick={handleLogout}
                    >
                      Keluar
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={paths.auth.login.getHref()}>Masuk</a>
                    </Button>
                    <Button variant="default" className="flex-1" asChild>
                      <a href={paths.auth.register.getHref()}>Daftar</a>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <DonationModal
        open={donationModalOpen}
        onOpenChange={setDonationModalOpen}
      />
    </>
  );
}
