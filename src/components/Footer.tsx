import {
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from "lucide-react";
import logo from "@/assets/images/logo.png";
import { env } from "@/config/env";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground dark:bg-muted text-background dark:text-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="KarirKit"
                className="h-8 w-auto brightness-0 invert dark:brightness-100 dark:invert-0"
              />
            </div>
            <p className="text-sm text-background/70 dark:text-muted-foreground leading-relaxed">
              Platform all-in-one untuk mengelola lamaran kerja, membuat CV
              profesional, dan membangun portofolio digital.
            </p>
            <div className="flex items-center gap-2 text-sm text-background/70 dark:text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>Jakarta, Indonesia</span>
            </div>
            <a
              href={`mailto:${env.SUPPORT_EMAIL}`}
              className="flex items-center gap-2 text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>{env.SUPPORT_EMAIL}</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-background dark:text-foreground">
              KarirKit
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Karier
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-background dark:text-foreground">
              Produk
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#application-tracker"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Application Tracker
                </a>
              </li>
              <li>
                <a
                  href="#cv"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  CV Builder
                </a>
              </li>
              <li>
                <a
                  href="#surat-lamaran"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Surat Lamaran
                </a>
              </li>
              <li>
                <a
                  href="#portofolio"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Portofolio
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-background dark:text-foreground">
              Bantuan
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-background dark:text-foreground">
              Ikuti Kami
            </h3>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/karirkit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 dark:bg-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/karirkit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 dark:bg-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/karirkit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 dark:bg-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10 dark:border-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60 dark:text-muted-foreground text-center md:text-left">
              © {currentYear} KarirKit. Semua hak dilindungi.
            </p>
            <p className="text-sm text-background/60 dark:text-muted-foreground flex items-center gap-1">
              Dibuat dengan{" "}
              <Heart className="w-4 h-4 text-red-400 fill-red-400" /> di
              Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
