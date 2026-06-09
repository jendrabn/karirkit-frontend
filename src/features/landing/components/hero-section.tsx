import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { HeroIllustration } from "@/features/landing/components/hero-illustration";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

const heroFeatures = [
  "Pelacak Lamaran",
  "CV",
  "Surat Lamaran",
  "Portofolio Digital",
];

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="hero-gradient relative overflow-hidden pt-10 pb-12 sm:pt-12 sm:pb-16 lg:pt-8 lg:pb-20"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <div className="space-y-6 text-center lg:-translate-y-3 lg:space-y-7 lg:text-left">
            <div className="space-y-4">
              <h1 className="text-balance text-[2.55rem] font-semibold leading-[1.08] tracking-[-0.028em] text-[#246545] sm:text-[3.1rem] sm:tracking-[-0.03em] lg:text-[3.45rem] lg:leading-[1.04] lg:tracking-[-0.032em] xl:text-[3.75rem]">
                Lacak & Kelola Semua Lamaran Kerjamu Tanpa Ribet
              </h1>
              <p className="mx-auto max-w-[42rem] text-base leading-8 text-foreground/72 lg:mx-0 lg:text-lg">
                Lacak setiap lamaran, buat CV profesional, susun surat lamaran, simpan dokumen penting, dan bangun portofolio digital dalam satu workflow.
              </p>
            </div>

            <div className="mx-auto hidden max-w-[36rem] grid-cols-1 gap-y-3 sm:grid sm:grid-cols-2 sm:gap-x-10 lg:mx-0">
              {heroFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3 lg:justify-start"
                >
                  <CheckCircle2 className="h-[1.125rem] w-[1.125rem] shrink-0 text-primary/80" />
                  <span className="text-sm font-medium text-foreground/88 sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 pt-1 sm:flex-row lg:justify-start">
              <Button
                variant="hero"
                size="lg"
                asChild
                className="group h-12 w-full px-6 text-sm sm:h-14 sm:w-auto sm:min-w-[204px] sm:px-8 sm:text-base"
              >
                <Link to={paths.auth.getHref()}>Coba Sekarang</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-12 w-full border-primary/70 px-6 text-sm hover:border-primary sm:h-14 sm:w-auto sm:min-w-[176px] sm:px-8 sm:text-base"
              >
                <a href="#application-tracker">Lihat Fitur</a>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <HeroIllustration className="min-h-[340px] lg:min-h-[540px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
