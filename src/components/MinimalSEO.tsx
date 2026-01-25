import { Helmet } from "react-helmet";
import { env } from "@/config/env";

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
  const appName = env.APP_NAME;
  const pageTitle = title ? `${title} | ${appName}` : appName;

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
