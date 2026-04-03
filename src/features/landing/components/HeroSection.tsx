import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { HeroIllustration } from "@/features/landing/components/HeroIllustration";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="hero-gradient relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          {/* Left Content */}
          <div className="space-y-5 lg:space-y-7">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75 sm:text-sm">
              Semua Kebutuhan Lamaran, Satu Tempat
              </p>
              <h1 className="text-balanced font-bold leading-[1.05] tracking-[-0.028em] text-primary sm:text-[3.35rem] sm:tracking-[-0.03em] lg:leading-[1.02] text-[3.45rem] lg:text-[3.65rem] lg:tracking-[-0.032em] xl:text-[3.95rem]">
                Lacak & Kelola Semua Lamaran Kerjamu Tanpa Ribet
              </h1>
              <p className="text-sm md:text-base leading-7 text-foreground/82 lg:leading-8">
                Lacak setiap lamaran, buat CV profesional, susun surat lamaran, simpan dokumen penting, dan bangun portofolio digital dalam satu workflow yang rapi.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                "Pelacak Lamaran",
                "CV",
                "Surat Lamaran",
                "Portofolio Digital",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-1 sm:flex-row">
              <Button
                variant="hero"
                size="lg"
                asChild
                className="group h-14 min-w-[204px] px-8 text-base"
              >
                <Link to={paths.auth.register.getHref()}>Mulai Gratis Sekarang</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-14 min-w-[176px] px-8 text-base"
              >
                <a href="#application-tracker"> Lihat Fitur</a>
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Illustration */}
          <div className="relative hidden lg:block">
            <HeroIllustration className="min-h-[340px] lg:min-h-[560px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
