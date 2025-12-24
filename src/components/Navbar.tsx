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
} from "lucide-react";
import logo from "@/assets/images/logo.png";
import { DonationModal } from "./DonationModal";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/hooks/use-theme";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#application-tracker", label: "Application Tracker" },
  { href: "#surat-lamaran", label: "Surat Lamaran" },
  { href: "#cv", label: "CV" },
  { href: "#portofolio", label: "Portofolio" },
  { href: "/blog", label: "Blog" },
];

interface NavbarProps {
  isLoggedIn?: boolean;
  onLoginToggle?: () => void;
}

export function Navbar({ isLoggedIn = false, onLoginToggle }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <a href="#beranda" className="flex items-center gap-2">
            <img src={logo} alt="KarirKit Logo" className="h-8 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
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
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
                        alt="Selena Gomez"
                      />
                      <AvatarFallback>SG</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      Selena Gomez
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuItem className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Halaman Utama
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Application Tracker
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    Surat Lamaran
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    CV
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Portofolio
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Akun
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
                    onClick={onLoginToggle}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <a href="/auth/login">Masuk</a>
                </Button>
                <Button variant="default" asChild>
                  <a href="/auth/register">Daftar</a>
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
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
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
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onLoginToggle}
                  >
                    Keluar
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" asChild>
                      <a href="/auth/login">Masuk</a>
                    </Button>
                    <Button variant="default" className="flex-1" asChild>
                      <a href="/auth/register">Daftar</a>
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
