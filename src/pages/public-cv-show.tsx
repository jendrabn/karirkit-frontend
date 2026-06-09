import { Link, useParams } from "react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MinimalSEO } from "@/components/minimal-seo";
import { SEO } from "@/components/seo";
import { env } from "@/config/env";
import { usePublicCV } from "@/features/public/api/get-public-cv";
import { CVDetail } from "@/features/cvs/components/cv-detail";
import { buildImageUrl } from "@/lib/utils";

export default function PublicCVShow() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: cvResponse,
    isLoading,
    error,
  } = usePublicCV({
    slug: slug!,
  });

  const cv = cvResponse;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <MinimalSEO title="CV Tidak Ditemukan" noIndex />
        <h2 className="text-xl font-semibold mb-2">CV Tidak Ditemukan</h2>
        <p className="text-center text-muted-foreground mb-4">
          CV yang Anda cari tidak tersedia atau bersifat privat.
        </p>
        <Button onClick={() => (window.location.href = "/")}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const cvUrl = `/cv/${cv.slug || slug}`;
  const cvPhoto = cv.photo ? buildImageUrl(cv.photo) : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: cv.name,
      jobTitle: cv.headline,
      description: cv.about || cv.headline,
      image: cvPhoto,
      url: `${env.APP_URL}${cvUrl}`,
      email: cv.email,
      telephone: cv.phone,
      address: cv.address,
      knowsAbout: cv.skills.map((skill) => skill.name),
      sameAs: cv.social_links.map((link) => link.url),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-8 sm:px-6 lg:px-8">
      <SEO
        title={`${cv.name} - ${cv.headline}`}
        description={`Lihat CV profesional ${cv.name}. ${
          cv.about || cv.headline
        }`}
        keywords={`cv ${cv.name}, resume ${cv.name}, ${cv.headline}, ${cv.skills
          .map((skill) => skill.name)
          .join(", ")}`}
        image={cvPhoto}
        imageAlt={`Foto profil ${cv.name}`}
        url={cvUrl}
        type="profile"
        structuredData={structuredData}
      />

      <div className="mx-auto max-w-5xl space-y-8">
        <CVDetail cv={cv} />

        <footer className="text-center text-xs text-muted-foreground">
          <p>
            Dibuat dengan{" "}
            <Link
              to="/"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              KarirKit
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
