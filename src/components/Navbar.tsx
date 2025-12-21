import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildImageUrl } from "@/lib/utils";
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
  FileText,
  Briefcase,
  FolderOpen,
  Globe,
  LayoutDashboard,
} from "lucide-react";
import { DonationModal } from "./DonationModal";
import { useAuth } from "@/contexts/AuthContext";
import logo from "../assets/images/logo.png";
import { paths } from "@/config/paths";

const navLinks = [
  { href: paths.home.getHref(), label: "Beranda" },
  { href: "/#application-tracker", label: "Pelacak Lamaran" },
  { href: "/#surat-lamaran", label: "Surat Lamaran" },
  { href: "/#cv", label: "CV" },
  { href: "/#portofolio", label: "Portofolio" },
  { href: paths.blog.list.getHref(), label: "Blog" },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link to={paths.home.getHref()} className="flex items-center gap-2">
            <img src={logo} alt="KarirKit Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </NavLink>
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
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={buildImageUrl(user.avatar)}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
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
                      Pelacak Lamaran
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={paths.account.profile.getHref()}>
                      <User className="mr-2 h-4 w-4" />
                      Akun
                    </Link>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
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
                {isAuthenticated && user ? (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
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

      <DonationModal
        open={donationModalOpen}
        onOpenChange={setDonationModalOpen}
      />
    </>
  );
}
