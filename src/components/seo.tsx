import { Helmet } from "react-helmet-async";
import { env } from "@/config/env";

const DEFAULT_DESCRIPTION =
  "KarirKit adalah platform lengkap untuk mengelola lamaran kerja, membuat CV profesional, surat lamaran, dan portofolio digital. Tingkatkan peluang karir Anda dengan tools yang mudah digunakan.";

const DEFAULT_KEYWORDS =
  "karirkit, lamaran kerja, cv maker, curriculum vitae, surat lamaran, cover letter, portofolio digital, job application tracker, career management, lowongan kerja, pencari kerja, job seeker, resume builder, aplikasi karir, manajemen karir";

const removeTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const toAbsoluteUrl = (value?: string) => {
  if (!value) {
    return env.APP_URL;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const baseUrl = removeTrailingSlash(env.APP_URL);
  const path = value.startsWith("/") ? value : `/${value}`;

  return `${baseUrl}${path}`;
};

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeDescription = (value: string) => {
  const description = stripHtml(value);

  return description.length > 160
    ? `${description.slice(0, 157).trim()}...`
    : description;
};

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  structuredData?: object;
}

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = `${env.APP_URL}/images/og-image.png`,
  imageAlt,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  noIndex = false,
  structuredData,
}: SEOProps) => {
  const appName = env.APP_NAME;
  const pageTitle =
    title && !title.includes(appName) ? `${title} | ${appName}` : title || appName;
  const pageDescription = normalizeDescription(description);
  const pageUrl = toAbsoluteUrl(url);
  const pageImage = toAbsoluteUrl(image);
  const pageImageAlt = imageAlt || pageTitle;
  const robotsContent = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}
      <meta name="application-name" content={appName} />
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:alt" content={pageImageAlt} />
      <meta property="og:site_name" content={appName} />
      <meta property="og:locale" content="id_ID" />

      {/* Article specific Open Graph tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {type === "article" &&
        tags &&
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageImageAlt} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
