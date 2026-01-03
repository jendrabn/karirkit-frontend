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
    subtitle: "Pantau semua proses lamaran kerja dalam satu tempat.",
  },
  {
    id: "applicationletter",
    image: iconSurat,
    title: "Surat Lamaran",
    subtitle: "Buat surat lamaran kerja profesional dengan cepat dan rapi.",
  },
  {
    id: "cv",
    image: iconCV,
    title: "CV",
    subtitle: "Susun CV modern yang mudah dibaca recruiter.",
  },
  {
    id: "portfolio",
    image: iconPortfolio,
    title: "Portofolio",
    subtitle: "Tampilkan karya terbaikmu dalam satu halaman.",
  },
];

const featureDetails = {
  application: {
    title: "Kelola Lamaran Kerja dengan Lebih Teratur",
    description:
      "Simpan semua lamaran dalam satu dashboard agar progres, catatan, dan tindak lanjut tetap terkendali.",
    bullets: [
      "Tahapan proses lengkap dan hasil (pending/passed/failed)",
      "Kontak HR, catatan interview, dan jadwal follow-up",
      "Detail lamaran: tipe kerja, sistem kerja, lokasi, gaji, sumber, dan link",
      "Pencarian & filter untuk menemukan lamaran lebih cepat",
    ],
    cta: "Mulai catat lamaran",
    image: "/images/placeholder.png",
    imageAlt: "Dashboard Pelacak Lamaran",
    bgColor: "bg-gradient-to-br from-secondary via-secondary/50 to-background",
  },

  applicationletter: {
    title: "Buat Surat Lamaran yang Rapi dan Meyakinkan",
    description:
      "Isi form, pilih template, lalu unduh. Setiap surat tersimpan rapi per posisi/perusahaan.",
    bullets: [
      "Form lengkap dan struktur surat jelas dari pembuka hingga penutup",
      "Template & bahasa (ID/EN) agar konsisten dan profesional",
      "Kelola banyak surat lamaran tanpa tertukar",
      "Unduh DOCX atau PDF kapan saja",
    ],
    cta: "Buat surat lamaran pertama",
    image: "/images/placeholder.png",
    imageAlt: "Form Surat Lamaran",
    bgColor: "bg-gradient-to-br from-primary/10 via-primary/5 to-background",
  },

  cv: {
    title: "Buat CV Profesional dengan Berbagai Template",
    description:
      "Susun CV lewat form terstruktur, pilih template sesuai kebutuhan, lalu unduh untuk melamar kerja.",
    bullets: [
      "Bagian lengkap: pengalaman, pendidikan, skill, sertifikat, organisasi, penghargaan",
      "Tambahkan proyek dan link demo dan link kode (repo)",
      "Bisa membuat beberapa versi CV dan pilihan bahasa (ID/EN)",
      "Unduh CV dalam DOCX atau PDF",
    ],
    cta: "Buat CV sekarang",
    image: "/images/placeholder.png",
    imageAlt: "Form Pembuatan CV",
    bgColor: "bg-gradient-to-br from-accent via-accent/50 to-background",
  },

  portfolio: {
    title: "Portofolio Digital yang Siap Dibagikan",
    description:
      "Tampilkan karya terbaik dalam halaman portofolio publik dengan link yang bisa dibagikan.",
    bullets: [
      "Halaman portofolio publik dengan tampilan proyek yang menarik",
      "Detail proyek: peran, periode, deskripsi, serta tools/teknologi",
      "Tambahkan gambar/media proyek, link demo, dan link kode (repo)",
      "Cocok untuk developer, desainer, dan profesional kreatif",
    ],
    cta: "Buat portofolio dan bagikan link",
    image: "/images/placeholder.png",
    imageAlt: "Portofolio Publik",
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
