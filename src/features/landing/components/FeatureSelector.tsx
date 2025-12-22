import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check } from "lucide-react";

// Import icon images
import iconTracker from "@/assets/images/icon-tracker.png";
import iconSurat from "@/assets/images/icon-surat.png";
import iconCV from "@/assets/images/icon-cv.png";
import iconPortfolio from "@/assets/images/icon-portfolio.png";

const features = [
  {
    id: "tracker",
    image: iconTracker,
    title: "Application Tracker",
    subtitle: "Pantau setiap lamaran kerja dalam satu tempat.",
  },
  {
    id: "surat",
    image: iconSurat,
    title: "Surat Lamaran",
    subtitle: "Buat surat lamaran profesional dalam hitungan menit.",
  },
  {
    id: "cv",
    image: iconCV,
    title: "CV Builder",
    subtitle: "CV rapi dan modern yang disukai perekrut.",
  },
  {
    id: "portofolio",
    image: iconPortfolio,
    title: "Portofolio",
    subtitle: "Tampilkan karya terbaik Anda secara digital.",
  },
];

const featureDetails = {
  tracker: {
    title: "Lacak Semua Lamaran Kerja Tanpa Bingung",
    description:
      "Simpan semua lamaran Anda dalam satu tampilan. Lihat status setiap lamaran, mulai dari dikirim, diproses, interview, hingga offer.",
    bullets: [
      "Timeline status lamaran yang jelas",
      "Catatan interview dan feedback",
      "Pengingat tindak lanjut agar tidak terlewat",
    ],
    cta: "Pelajari cara kerja Application Tracker",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    imageAlt: "Application Tracker Dashboard",
    bgColor: "bg-gradient-to-br from-secondary via-secondary/50 to-background",
  },
  surat: {
    title: "Buat Surat Lamaran yang Meyakinkan",
    description:
      "Gunakan template surat lamaran dengan bahasa profesional. Sesuaikan untuk setiap posisi hanya dalam beberapa klik.",
    bullets: [
      "Template siap pakai untuk berbagai jenis pekerjaan",
      "Data otomatis terisi dari profil dan CV",
      "Ekspor ke Word (.docx) — ekspor PDF segera hadir",
    ],
    cta: "Pelajari cara membuat Surat Lamaran",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
    imageAlt: "Editor Surat Lamaran",
    bgColor: "bg-gradient-to-br from-primary/10 via-primary/5 to-background",
  },
  cv: {
    title: "CV Modern yang Menonjol di Mata Rekruter",
    description:
      "Bangun CV rapi dan terstruktur tanpa perlu desain rumit. Cocok untuk fresh graduate maupun profesional berpengalaman.",
    bullets: [
      "Template CV modern dan mudah dibaca",
      "Bagian-bagian yang sudah terstruktur (pengalaman, pendidikan, skill)",
      "Ekspor ke Word (.docx) — ekspor PDF segera hadir",
    ],
    cta: "Pelajari cara membuat CV",
    image:
      "https://images.unsplash.com/photos/1517048676732-d65bc937f952?w=800&h=500&fit=crop",
    imageAlt: "CV Builder Interface",
    bgColor: "bg-gradient-to-br from-accent via-accent/50 to-background",
  },
  portofolio: {
    title: "Tunjukkan Keahlian Anda dengan Portofolio Digital",
    description:
      "Kumpulkan hasil karya terbaik Anda—gambar, video, link, dan studi kasus—dalam satu halaman portofolio yang mudah dibagikan.",
    bullets: [
      "Galeri visual yang menarik",
      "Tautan publik yang bisa dikirim ke recruiter",
      "Cocok untuk desainer, developer, kreator konten, dan lainnya",
    ],
    cta: "Pelajari cara membuat Portofolio",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop",
    imageAlt: "Portfolio Gallery",
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
            Kelola lamaran, buat CV profesional, surat lamaran menarik, dan
            portofolio digital dalam satu platform.
          </p>
        </div>

        <Tabs defaultValue="tracker" className="w-full">
          {/* Feature Cards as Tab Triggers */}
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 h-auto bg-transparent p-0 mb-12">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="group relative data-[state=active]:bg-card data-[state=active]:border-primary data-[state=active]:shadow-xl border-2 border-border/50 bg-card/50 rounded-2xl p-5 sm:p-6 h-auto flex flex-col items-center text-center gap-3 sm:gap-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                {/* Active indicator */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />

                {/* Icon Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 group-data-[state=active]:scale-110">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full overflow-hidden">
                  <h3 className="font-bold text-foreground text-sm sm:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 hidden sm:block line-clamp-2">
                    {feature.subtitle}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Contents */}
          {Object.entries(featureDetails).map(([key, detail]) => (
            <TabsContent
              key={key}
              value={key}
              className="mt-0 animate-in fade-in-50 duration-500"
              id={key === "tracker" ? undefined : key}
            >
              <FeatureDetail
                title={detail.title}
                description={detail.description}
                bullets={detail.bullets}
                cta={detail.cta}
                image={detail.image}
                imageAlt={detail.imageAlt}
                bgColor={detail.bgColor}
              />
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
