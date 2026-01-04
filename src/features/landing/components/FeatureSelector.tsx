import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check } from "lucide-react";

// Import icon images
import iconTracker from "@/assets/images/icon-tracker.png";
import iconSurat from "@/assets/images/icon-surat.png";
import iconCV from "@/assets/images/icon-cv.png";
import iconPortfolio from "@/assets/images/icon-portfolio.png";

const features = [
  {
    id: "application",
    image: iconTracker,
    title: "Pelacak Lamaran",
    subtitle: "Pantau semua lamaran dari satu tempat.",
  },
  {
    id: "applicationletter",
    image: iconSurat,
    title: "Surat Lamaran",
    subtitle: "Buat surat lamaran profesional dengan cepat.",
  },
  {
    id: "cv",
    image: iconCV,
    title: "CV Builder",
    subtitle: "Buat CV menarik yang mudah dibaca recruiter.",
  },
  {
    id: "portfolio",
    image: iconPortfolio,
    title: "Portfolio Digital",
    subtitle: "Tampilkan karya terbaik dengan link siap bagikan.",
  },
];

const featureDetails = {
  application: {
    title: "Lacak Semua Lamaran Sampai Dapat Penawaran Kerja",
    description:
      "Berhenti pakai Excel yang ribet. Kelola semua lamaran dalam satu dasbor yang rapi dan mudah diakses.",
    bullets: [
      "Track 15+ tahapan: dari submit, screening, test, interview sampai offering",
      "Simpan kontak HRD, jadwal interview & reminder follow-up otomatis",
      "Filter berdasarkan: tipe pekerjaan, sistem kerja, status, hasil",
      "Statistik lengkap untuk pantau progress lamaran",
    ],
    cta: "Mulai Catat Lamaran Gratis →",
    image: "/images/placeholder.png",
    imageAlt: "Dasbor Pelacak Lamaran KarirKit",
    bgColor: "bg-gradient-to-br from-secondary via-secondary/50 to-background",
  },

  applicationletter: {
    title: "Surat Lamaran Profesional dengan Mudah dan Cepat",
    description:
      "Pilih template, isi informasi pelamar dan perusahaan, gunakan template paragraf siap pakai. Download langsung!",
    bullets: [
      "Template profesional siap pakai (Bahasa Indonesia & Inggris)",
      "Informasi lengkap: data diri, pendidikan, detail perusahaan",
      "Gunakan template paragraf: pembuka, isi, dan penutup",
      "Download ke DOCX atau PDF, simpan untuk dipakai lagi",
    ],
    cta: "Buat Surat Lamaran Sekarang →",
    image: "/images/placeholder.png",
    imageAlt: "Template Surat Lamaran KarirKit",
    bgColor: "bg-gradient-to-br from-primary/10 via-primary/5 to-background",
  },

  cv: {
    title: "CV yang Bikin Recruiter Langsung Tertarik",
    description:
      "Pilih template CV (Indonesia/Inggris), isi form lengkap dari informasi pribadi sampai media sosial. Semua terstruktur rapi!",
    bullets: [
      "Template modern & rapi (Bahasa Indonesia & Inggris)",
      "Lengkap: info pribadi, pendidikan, pengalaman, skill, sertifikat",
      "Tambahkan keahlian, penghargaan, organisasi, dan proyek",
      "Download DOCX atau PDF, buat banyak versi CV berbeda",
    ],
    cta: "Buat CV Profesional Gratis →",
    image: "/images/placeholder.png",
    imageAlt: "CV Builder KarirKit",
    bgColor: "bg-gradient-to-br from-accent via-accent/50 to-background",
  },

  portfolio: {
    title: "Portfolio yang Bikin Klien & Recruiter Terkesan",
    description:
      "Punya karya bagus tapi belum punya website? Buat portfolio digital dengan mudah dan bagikan linknya.",
    bullets: [
      "Halaman portfolio publik dengan URL unik & SEO-friendly",
      "Showcase project dengan gambar, link demo & source code",
      "Cantumkan tech stack, role, timeline, dan tipe project",
      "Cocok untuk developer, designer, dan profesional kreatif",
    ],
    cta: "Buat Portfolio & Bagikan Link →",
    image: "/images/placeholder.png",
    imageAlt: "Portfolio Digital KarirKit",
    bgColor: "bg-gradient-to-br from-muted via-muted/50 to-background",
  },
};

export function FeatureSelector() {
  return (
    <section id="application-tracker" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">
            Fitur Utama
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Semua yang Anda Butuhkan untuk Karier Impian
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Kelola lamaran kerja, buat CV profesional, surat lamaran yang
            meyakinkan, dan portofolio digital dalam satu platform.
          </p>
        </div>

        <Tabs defaultValue="application" className="w-full">
          {/* Feature Cards */}
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4 lg:gap-6 h-auto bg-transparent p-0 mb-12">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="group relative data-[state=active]:bg-card data-[state=active]:border-primary data-[state=active]:shadow-xl border-2 border-border/50 bg-card/50 rounded-2xl p-5 sm:p-6 h-full flex flex-col items-center text-center gap-3 sm:gap-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 group-data-[state=active]:scale-110">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full overflow-hidden space-y-2">
                  <h3 className="font-bold text-base sm:text-lg whitespace-normal break-words leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent group-data-[state=active]:from-primary group-data-[state=active]:to-primary/80 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground/80 mt-2 hidden sm:block line-clamp-2 whitespace-normal break-words leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                    {feature.subtitle}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(featureDetails).map(([key, detail]) => (
            <TabsContent
              key={key}
              value={key}
              className="mt-0 animate-in fade-in-50 duration-500"
            >
              <FeatureDetail {...detail} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

interface FeatureDetailProps {
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  image: string;
  imageAlt: string;
  bgColor: string;
}

function FeatureDetail({
  title,
  description,
  bullets,
  image,
  imageAlt,
  bgColor,
}: FeatureDetailProps) {
  return (
    <div
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center rounded-3xl p-8 lg:p-12 ${bgColor} border border-border/30`}
    >
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
        <ul className="space-y-4">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-first lg:order-last">
        <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/20 transform hover:scale-[1.02] transition-transform duration-300">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
