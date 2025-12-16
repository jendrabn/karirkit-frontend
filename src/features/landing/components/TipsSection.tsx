import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    title: "Contoh CV untuk Fresh Graduate",
    description: "Pelajari cara membuat CV yang menarik perhatian HRD meski belum punya pengalaman kerja.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
  },
  {
    title: "Cara Menulis Surat Lamaran yang Menarik",
    description: "Tips menulis surat lamaran yang profesional dan membuat recruiter tertarik membaca CV Anda.",
    image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&h=500&fit=crop",
  },
  {
    title: "Tips Membuat Portofolio Online",
    description: "Panduan lengkap membangun portofolio digital yang memukau untuk berbagai bidang profesi.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop",
  },
  {
    title: "Strategi Mengelola Banyak Lamaran Kerja",
    description: "Cara efektif melacak dan mengelola puluhan lamaran kerja tanpa kehilangan jejak.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
  },
];

export function TipsSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-medium mb-2">Blog & Tips</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Temukan Panduan dan Tips Karir
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden rounded-2xl card-shadow bg-card hover:card-shadow-hover transition-all group cursor-pointer">
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.description}
                </p>
                <a
                  href="/blog"
                  className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  Baca selengkapnya
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
