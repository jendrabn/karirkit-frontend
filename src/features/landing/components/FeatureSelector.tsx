import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Briefcase,
  FileText,
  FileCheck,
  FolderOpen,
  Check,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    id: "tracker",
    icon: Briefcase,
    title: "Application Tracker",
    subtitle: "Pantau setiap lamaran kerja dalam satu tempat.",
  },
  {
    id: "surat",
    icon: FileText,
    title: "Surat Lamaran",
    subtitle: "Buat surat lamaran profesional dalam hitungan menit.",
  },
  {
    id: "cv",
    icon: FileCheck,
    title: "CV Builder",
    subtitle: "CV rapi dan modern yang disukai perekrut.",
  },
  {
    id: "portofolio",
    icon: FolderOpen,
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
    bgColor: "bg-secondary",
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
    bgColor: "bg-primary/5",
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
    bgColor: "bg-accent",
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
    bgColor: "bg-muted",
  },
};

export function FeatureSelector() {
  return (
    <section id="application-tracker" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <Tabs defaultValue="tracker" className="w-full">
          {/* Feature Cards as Tab Triggers */}
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-auto bg-transparent p-0 mb-12">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="group data-[state=active]:bg-secondary data-[state=active]:border-primary data-[state=active]:shadow-lg border-2 border-transparent bg-card rounded-2xl p-4 sm:p-6 h-auto flex flex-col items-center text-center gap-2 sm:gap-3 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary group-data-[state=active]:bg-primary/20 flex items-center justify-center transition-colors">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <div className="w-full overflow-hidden">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 hidden sm:block line-clamp-2">
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
              className="mt-0"
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
  cta,
  image,
  imageAlt,
  bgColor,
}: FeatureDetailProps) {
  return (
    <div
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center rounded-3xl p-8 lg:p-12 ${bgColor}`}
    >
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg">{description}</p>
        <ul className="space-y-3">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{bullet}</span>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
        >
          {cta}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      <div className="order-first lg:order-last">
        <div className="rounded-2xl overflow-hidden shadow-xl">
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
