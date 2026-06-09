import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { env } from "@/config/env";

const ADMIN_SEO_SELECTOR = [
  'meta[name="application-name"]',
  'meta[name="author"]',
  'meta[name="keywords"]',
  'meta[name="language"]',
  'meta[name="revisit-after"]',
  'meta[name="robots"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'meta[property^="twitter:"]',
  'link[rel="canonical"]',
  'script[type="application/ld+json"]',
].join(",");

interface MinimalSEOProps {
  title: string;
  description?: string;
  noIndex?: boolean;
}

export const MinimalSEO = ({
  title,
  description = "KarirKit - Platform lengkap untuk mengelola karir Anda",
  noIndex = false,
}: MinimalSEOProps) => {
  const location = useLocation();
  const appName = env.APP_NAME;
  const pageTitle =
    title && !title.includes(appName) ? `${title} | ${appName}` : title || appName;
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdminPage) {
      return;
    }

    document.head
      .querySelectorAll(ADMIN_SEO_SELECTOR)
      .forEach((element) => element.remove());
  }, [isAdminPage]);

  if (isAdminPage) {
    return (
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={description} />
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="application-name" content={appName} />
      <meta property="og:site_name" content={appName} />
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
    </Helmet>
  );
};
