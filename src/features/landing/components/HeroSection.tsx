import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="hero-gradient py-16 lg:py-24 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Platform Gratis untuk Karier Anda</span>
            </div> */}

            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-shine leading-tight">
              Kelola Semua Lamaran Kerja Anda dengan Lebih Mudah
            </h1>
            <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed">
              Platform all-in-one untuk melacak lamaran kerja, membuat CV
              profesional, menyusun surat lamaran, dan membangun portofolio
              digital.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-3">
              {[
                "Pelacak Lamaran Kerja",
                "CV",
                "Surat Lamaran",
                "Portofolio Digital",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground text-sm font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="hero"
                size="lg"
                asChild
                className="group h-14 px-8 text-base"
              >
                <Link to={paths.auth.register.getHref()}>Daftar Sekarang</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-14 px-8 text-base"
              >
                <a href="#application-tracker"> Lihat Fitur</a>
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Illustration */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643"
                alt="KarirKit - Platform manajemen lamaran kerja dengan Application Tracker, CV Builder, Portfolio, dan Surat Lamaran"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
