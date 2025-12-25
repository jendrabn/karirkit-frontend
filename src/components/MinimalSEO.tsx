import { SEO } from "@/components/SEO";

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
  return <SEO title={title} description={description} noIndex={noIndex} />;
};
