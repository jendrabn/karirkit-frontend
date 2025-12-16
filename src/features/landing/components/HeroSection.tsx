import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="beranda" className="hero-gradient py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient leading-tight">
              Kelola Semua Lamaran Kerja Anda dengan Lebih Mudah
            </h1>
            <p className="text-lg text-foreground/90">
              Platform all-in-one untuk melacak lamaran kerja, membuat CV profesional, menyusun surat lamaran, dan membangun portofolio digital.
            </p>
            <p className="text-muted-foreground">
              Gunakan Application Tracker untuk memonitor progres lamaran, buat CV dan Surat Lamaran yang profesional, serta bangun Portofolio yang memukau. Semua alat yang Anda butuhkan untuk menonjol di dunia kerja dalam satu platform yang intuitif.
            </p>
            <div className="pt-4">
              <Button variant="hero" size="lg">
                Daftar Sekarang
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Application Tracker, CV Builder, Surat Lamaran, dan Portofolio — semuanya gratis dalam satu platform.
              </p>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop"
                alt="Dashboard KarirKit - Platform manajemen lamaran kerja"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
