import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/images/logo.png";
import { env } from "@/config/env";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation("common");

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
                alt={t("appName")}
                className="h-8 w-auto transition-opacity hover:opacity-90 [filter:brightness(0)_invert(1)_sepia(1)_saturate(0.75)_hue-rotate(355deg)_brightness(1.12)_contrast(0.92)]"
              />
            </div>
            <p className="text-sm text-background/70 dark:text-muted-foreground leading-relaxed">
              {t("footer.brandDescription")}
            </p>
            <div className="flex items-center gap-2 text-sm text-background/70 dark:text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{t("footer.location")}</span>
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
              {t("footer.companyTitle")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.aboutUs")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.career")}
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("nav.blog")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-background dark:text-foreground">
              {t("footer.productsTitle")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#application-tracker"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.applicationTracker")}
                </a>
              </li>
              <li>
                <a
                  href="#cv"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.cvBuilder")}
                </a>
              </li>
              <li>
                <a
                  href="#surat-lamaran"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.coverLetter")}
                </a>
              </li>
              <li>
                <a
                  href="#portofolio"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.portfolio")}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-background dark:text-foreground">
              {t("footer.supportTitle")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.helpCenter")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.faq")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.privacyPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-background/70 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t("footer.terms")}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-background dark:text-foreground">
              {t("footer.followUs")}
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
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-sm text-background/60 dark:text-muted-foreground text-center">
              © {currentYear} {t("appName")}. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
