import { Helmet } from "react-helmet";
import { env } from "@/config/env";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
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
  description = "KarirKit adalah platform lengkap untuk mengelola lamaran kerja, membuat CV profesional, surat lamaran, dan portofolio digital. Tingkatkan peluang karir Anda dengan tools yang mudah digunakan.",
  keywords = "karirkit, lamaran kerja, cv maker, curriculum vitae, surat lamaran, cover letter, portofolio digital, job application tracker, career management, lowongan kerja, pencari kerja, job seeker, resume builder, aplikasi karir, manajemen karir",
  image = `${env.APP_URL}/images/og-image.png`,
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
  const pageTitle = title ? `${title} | ${appName}` : appName;
  const pageUrl = url ? `${env.APP_URL}${url}` : env.APP_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
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
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
