/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Eye, ArrowRight } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  image: string;
  image_caption: string | null;
  teaser: string | null;
  min_read: number;
  views_count: number;
  published_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  author: {
    id: number;
    name: string;
  } | null;
}

// Dummy data based on the table structure
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Tips Membuat CV yang Menarik Perhatian HRD",
    slug: "10-tips-membuat-cv-yang-menarik-perhatian-hrd",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
    image_caption: "Ilustrasi CV profesional",
    teaser:
      "Pelajari cara membuat CV yang standout dan meningkatkan peluang Anda dipanggil interview.",
    min_read: 5,
    views_count: 1250,
    published_at: "2024-01-15",
    category: { id: 1, name: "Tips Karier", slug: "tips-karier" },
    author: { id: 1, name: "Admin KarirKit" },
  },
  {
    id: 2,
    title: "Panduan Lengkap Menghadapi Interview Kerja",
    slug: "panduan-lengkap-menghadapi-interview-kerja",
    image:
      "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&h=500&fit=crop",
    image_caption: "Sesi interview kerja",
    teaser:
      "Persiapan interview yang matang adalah kunci sukses. Simak panduan lengkapnya di sini.",
    min_read: 8,
    views_count: 2340,
    published_at: "2024-01-12",
    category: { id: 2, name: "Interview", slug: "interview" },
    author: { id: 1, name: "Admin KarirKit" },
  },
  {
    id: 3,
    title: "Cara Negosiasi Gaji yang Efektif untuk Fresh Graduate",
    slug: "cara-negosiasi-gaji-yang-efektif-untuk-fresh-graduate",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
    image_caption: "Diskusi gaji",
    teaser:
      "Fresh graduate juga bisa nego gaji! Pelajari teknik dan strateginya di artikel ini.",
    min_read: 6,
    views_count: 890,
    published_at: "2024-01-10",
    category: { id: 3, name: "Gaji & Benefit", slug: "gaji-benefit" },
    author: { id: 2, name: "Career Coach" },
  },
  {
    id: 4,
    title: "5 Skill Digital yang Paling Dicari di Tahun 2024",
    slug: "5-skill-digital-yang-paling-dicari-di-tahun-2024",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop",
    image_caption: "Skill digital",
    teaser:
      "Tingkatkan daya saing Anda dengan menguasai skill-skill digital yang sedang trending.",
    min_read: 4,
    views_count: 3120,
    published_at: "2024-01-08",
    category: { id: 4, name: "Skill Development", slug: "skill-development" },
    author: { id: 1, name: "Admin KarirKit" },
  },
  {
    id: 5,
    title: "Membangun Personal Branding di LinkedIn",
    slug: "membangun-personal-branding-di-linkedin",
    image:
      "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&h=500&fit=crop",
    image_caption: "LinkedIn profile",
    teaser:
      "LinkedIn bukan sekadar platform untuk cari kerja. Maksimalkan potensinya untuk membangun personal brand.",
    min_read: 7,
    views_count: 1560,
    published_at: "2024-01-05",
    category: { id: 1, name: "Tips Karier", slug: "tips-karier" },
    author: { id: 2, name: "Career Coach" },
  },
  {
    id: 6,
    title: "Mengenal Berbagai Jenis Kontrak Kerja di Indonesia",
    slug: "mengenal-berbagai-jenis-kontrak-kerja-di-indonesia",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop",
    image_caption: "Dokumen kontrak kerja",
    teaser:
      "Pahami perbedaan PKWT, PKWTT, dan jenis kontrak lainnya sebelum menandatangani.",
    min_read: 10,
    views_count: 2100,
    published_at: "2024-01-03",
    category: {
      id: 5,
      name: "Hukum Ketenagakerjaan",
      slug: "hukum-ketenagakerjaan",
    },
    author: { id: 1, name: "Admin KarirKit" },
  },
];

const categories = [
  { name: "Semua", slug: "all", count: 6 },
  { name: "Tips Karier", slug: "tips-karier", count: 2 },
  { name: "Interview", slug: "interview", count: 1 },
  { name: "Gaji & Benefit", slug: "gaji-benefit", count: 1 },
  { name: "Skill Development", slug: "skill-development", count: 1 },
  { name: "Hukum Ketenagakerjaan", slug: "hukum-ketenagakerjaan", count: 1 },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary/5 via-background to-primary/10 py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Blog & Artikel Karier
              </h1>
              <p className="text-muted-foreground text-lg">
                Tips, panduan, dan insight untuk membantu perjalanan karier Anda
              </p>
              <div className="max-w-md mx-auto pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Cari artikel..." className="pl-10 h-12" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-2 py-4 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.slug}
                  variant={category.slug === "all" ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category.name}
                  <span className="ml-1 text-xs opacity-70">
                    ({category.count})
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-5 space-y-3">
                      {post.category && (
                        <Badge variant="secondary" className="text-xs">
                          {post.category.name}
                        </Badge>
                      )}
                      <h2 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      {post.teaser && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {post.teaser}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.min_read} menit baca
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {post.views_count.toLocaleString()}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-12">
              <Button variant="outline" size="lg">
                Muat Lebih Banyak
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
