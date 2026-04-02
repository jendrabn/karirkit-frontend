import { Link } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  FeatureIllustration,
  type FeatureIllustrationVariant,
} from "@/features/landing/components/FeatureIllustration";

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
    title: "Kelola Semua Lamaran Kerja dari Satu Dasbor",
    description:
      "Catat setiap lowongan yang Anda lamar, pantau status prosesnya, dan simpan detail follow-up tanpa berpindah ke spreadsheet.",
    bullets: [
      "Lacak 15+ status proses, dari draft dan submitted sampai interview, offering, accepted, atau rejected",
      "Simpan detail perusahaan, posisi, sumber lowongan, kontak rekruter, tanggal follow-up, dan catatan penting",
      "Filter berdasarkan status, tipe kerja, sistem kerja, tanggal, lokasi, perusahaan, dan rentang gaji",
      "Pantau statistik lamaran untuk tahu mana yang perlu ditindaklanjuti lebih cepat",
    ],
    cta: "Kelola Lamaran Sekarang",
    href: "/applications",
    illustration: "application" as FeatureIllustrationVariant,
    bgColor: "bg-gradient-to-br from-secondary via-secondary/50 to-background",
  },

  applicationletter: {
    title: "Buat Surat Lamaran yang Siap Kirim dalam Hitungan Menit",
    description:
      "Pilih template yang sesuai, isi data pelamar dan perusahaan, gunakan paragraf siap pakai, lalu unduh hasilnya dalam format DOCX atau PDF.",
    bullets: [
      "Template surat lamaran dalam Bahasa Indonesia dan Inggris, termasuk opsi premium",
      "Isi data diri, pendidikan, perusahaan tujuan, dan rincian kontak dari satu form",
      "Gunakan template paragraf untuk pembuka, isi, dan penutup agar lebih konsisten",
      "Tambahkan tanda tangan digital, gandakan surat, lalu unduh ke DOCX atau PDF",
    ],
    cta: "Buat Surat Lamaran",
    href: "/application-letters",
    illustration: "applicationletter" as FeatureIllustrationVariant,
    bgColor: "bg-gradient-to-br from-primary/10 via-primary/5 to-background",
  },

  cv: {
    title: "Bangun CV Profesional yang Lengkap dan Mudah Dibaca",
    description:
      "Susun foto, ringkasan, pendidikan, pengalaman, skill, proyek, dan tautan sosial dalam template CV yang rapi.",
    bullets: [
      "Template CV dalam Bahasa Indonesia dan Inggris, termasuk pilihan premium",
      "Lengkapi profil, foto, about, pendidikan, pengalaman, skill, sertifikat, penghargaan, organisasi, proyek, dan tautan sosial",
      "Atur slug dan visibilitas CV menjadi private, public, atau unlisted sesuai kebutuhan",
      "Bagikan CV publik lewat link unik, lalu unduh ke DOCX atau PDF atau duplikasi untuk versi lain",
    ],
    cta: "Buat CV Profesional",
    href: "/cvs",
    illustration: "cv" as FeatureIllustrationVariant,
    bgColor: "bg-gradient-to-br from-accent via-accent/50 to-background",
  },

  portfolio: {
    title: "Portfolio Digital untuk Menampilkan Proyek Terbaik",
    description:
      "Tampilkan proyek kerja, freelance, personal, atau akademik dalam satu halaman publik dengan detail yang mudah dibagikan.",
    bullets: [
      "Halaman portfolio publik dengan slug unik yang siap dibagikan",
      "Isi judul, deskripsi singkat, detail proyek, role, industri, dan timeline pengerjaan",
      "Tambahkan cover, galeri media, daftar tools, live demo, dan source code",
      "Cocok untuk proyek kerja, freelance, personal, maupun tugas akademik",
    ],
    cta: "Buat Portfolio Digital",
    href: "/portfolios",
    illustration: "portfolio" as FeatureIllustrationVariant,
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
  href: string;
  illustration: FeatureIllustrationVariant;
  bgColor: string;
}

function FeatureDetail({
  title,
  description,
  bullets,
  cta,
  href,
  illustration,
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
        <Button asChild className="mt-2 w-fit">
          <Link to={href}>{cta}</Link>
        </Button>
      </div>

      <div className="order-first lg:order-last">
        <div className="transform transition-transform duration-300 hover:scale-[1.02]">
          <FeatureIllustration variant={illustration} />
        </div>
      </div>
    </div>
  );
}
