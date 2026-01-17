import { useParams } from "react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MinimalSEO } from "@/components/MinimalSEO";
import { usePublicCV } from "@/features/public/api/get-public-cv";
import { CVDetail } from "@/features/cvs/components/CVDetail";

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

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-8 sm:px-6 lg:px-8">
      <MinimalSEO
        title={`${cv.name} - ${cv.headline}`}
        description={`Lihat CV profesional ${cv.name}. ${cv.headline}`}
      />

      <div className="mx-auto max-w-5xl space-y-8">
        <CVDetail cv={cv} />

        <div className="text-center text-xs text-muted-foreground">
          <p>Dibuat dengan KarirKit</p>
        </div>
      </div>
    </div>
  );
}
