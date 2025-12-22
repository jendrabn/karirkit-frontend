import { Card } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "Contoh CV untuk Fresh Graduate",
    description: "Pelajari cara membuat CV yang menarik perhatian HRD meski belum punya pengalaman kerja.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
    readTime: "5 min",
    category: "CV Tips",
  },
  {
    title: "Cara Menulis Surat Lamaran yang Menarik",
    description: "Tips menulis surat lamaran yang profesional dan membuat recruiter tertarik membaca CV Anda.",
    image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&h=500&fit=crop",
    readTime: "7 min",
    category: "Surat Lamaran",
  },
  {
    title: "Tips Membuat Portofolio Online",
    description: "Panduan lengkap membangun portofolio digital yang memukau untuk berbagai bidang profesi.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop",
    readTime: "6 min",
    category: "Portofolio",
  },
  {
    title: "Strategi Mengelola Banyak Lamaran Kerja",
    description: "Cara efektif melacak dan mengelola puluhan lamaran kerja tanpa kehilangan jejak.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    readTime: "4 min",
    category: "Produktivitas",
  },
];

export function TipsSection() {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">Blog & Tips</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Temukan Panduan dan Tips Karir
            </h2>
          </div>
          <Button variant="outline" asChild className="w-fit group">
            <a href="/blog" className="inline-flex items-center gap-2">
              Lihat Semua Artikel
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden rounded-2xl bg-card hover:shadow-xl transition-all duration-300 group cursor-pointer border-border/50 hover:-translate-y-1">
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category badge */}
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  {article.category}
                </div>
              </div>
              <div className="p-5 lg:p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime} baca</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.description}
                </p>
                <a
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
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
