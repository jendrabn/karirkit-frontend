import { useParams, Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  image: string;
  image_caption: string | null;
  content: string;
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
    avatar?: string;
  } | null;
}

// Dummy blog post data
const blogPostData: Record<string, BlogPost> = {
  "10-tips-membuat-cv-yang-menarik-perhatian-hrd": {
    id: 1,
    title: "10 Tips Membuat CV yang Menarik Perhatian HRD",
    slug: "10-tips-membuat-cv-yang-menarik-perhatian-hrd",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop",
    image_caption: "Ilustrasi CV profesional yang menarik perhatian HRD",
    teaser:
      "Pelajari cara membuat CV yang standout dan meningkatkan peluang Anda dipanggil interview.",
    min_read: 5,
    views_count: 1250,
    published_at: "2024-01-15",
    category: { id: 1, name: "Tips Karier", slug: "tips-karier" },
    author: {
      id: 1,
      name: "Admin KarirKit",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    content: `
      <p>Dalam dunia kerja yang kompetitif, CV (Curriculum Vitae) adalah senjata pertama Anda untuk menarik perhatian HRD. Sebuah CV yang baik dapat membuka pintu kesempatan, sementara CV yang buruk bisa langsung masuk ke tempat sampah digital.</p>

      <h2>1. Gunakan Format yang Bersih dan Profesional</h2>
      <p>Hindari desain yang terlalu ramai atau warna-warna mencolok. Gunakan font yang mudah dibaca seperti Arial, Calibri, atau Times New Roman dengan ukuran 11-12pt. Pastikan ada cukup white space agar CV tidak terlihat penuh sesak.</p>

      <h2>2. Tulis Summary yang Menarik</h2>
      <p>Bagian summary atau ringkasan profesional adalah kesempatan pertama Anda untuk membuat kesan. Tulis 2-3 kalimat yang menjelaskan siapa Anda, apa keahlian utama Anda, dan apa yang bisa Anda kontribusikan ke perusahaan.</p>

      <h2>3. Fokus pada Pencapaian, Bukan Hanya Tugas</h2>
      <p>Daripada menulis "Bertanggung jawab atas penjualan", lebih baik tulis "Meningkatkan penjualan sebesar 30% dalam 6 bulan melalui strategi cross-selling". Gunakan angka dan data konkret untuk menunjukkan dampak kerja Anda.</p>

      <h2>4. Sesuaikan CV dengan Posisi yang Dilamar</h2>
      <p>Jangan gunakan CV yang sama untuk semua lamaran. Sesuaikan konten CV dengan job description. Highlight skill dan pengalaman yang paling relevan dengan posisi yang Anda incar.</p>

      <h2>5. Cantumkan Kata Kunci yang Relevan</h2>
      <p>Banyak perusahaan menggunakan ATS (Applicant Tracking System) untuk menyaring CV. Pastikan Anda memasukkan kata kunci yang ada di job description agar CV Anda lolos screening otomatis.</p>

      <h2>6. Perhatikan Urutan Kronologis</h2>
      <p>Gunakan format kronologis terbalik (yang terbaru di atas) untuk bagian pengalaman kerja dan pendidikan. Ini memudahkan HRD melihat posisi terkini Anda.</p>

      <h2>7. Jangan Abaikan Soft Skills</h2>
      <p>Selain hard skills teknis, soft skills seperti komunikasi, kepemimpinan, dan problem-solving juga penting. Tunjukkan soft skills melalui contoh konkret dalam pengalaman kerja Anda.</p>

      <h2>8. Proofread Berkali-kali</h2>
      <p>Kesalahan typo atau gramatikal bisa membuat kesan buruk. Baca ulang CV Anda beberapa kali, dan minta orang lain untuk review juga.</p>

      <h2>9. Jaga Panjang CV yang Ideal</h2>
      <p>Untuk fresh graduate atau profesional dengan pengalaman kurang dari 10 tahun, usahakan CV tidak lebih dari 1-2 halaman. Untuk senior professional, 2-3 halaman masih acceptable.</p>

      <h2>10. Sertakan Link Portfolio atau LinkedIn</h2>
      <p>Di era digital, sertakan link ke portfolio online, LinkedIn, atau GitHub (untuk developer) Anda. Pastikan semua link aktif dan kontennya up-to-date.</p>

      <h2>Kesimpulan</h2>
      <p>CV yang baik adalah kombinasi dari konten yang kuat dan presentasi yang profesional. Luangkan waktu untuk menyempurnakan CV Anda, karena ini adalah investasi untuk karier Anda. Dengan mengikuti tips di atas, peluang Anda untuk dipanggil interview akan meningkat signifikan.</p>
    `,
  },
};

const relatedPosts = [
  {
    id: 2,
    title: "Panduan Lengkap Menghadapi Interview Kerja",
    slug: "panduan-lengkap-menghadapi-interview-kerja",
    image:
      "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400&h=250&fit=crop",
    min_read: 8,
    category: { name: "Interview" },
  },
  {
    id: 3,
    title: "Cara Negosiasi Gaji yang Efektif untuk Fresh Graduate",
    slug: "cara-negosiasi-gaji-yang-efektif-untuk-fresh-graduate",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    min_read: 6,
    category: { name: "Gaji & Benefit" },
  },
  {
    id: 4,
    title: "5 Skill Digital yang Paling Dicari di Tahun 2024",
    slug: "5-skill-digital-yang-paling-dicari-di-tahun-2024",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop",
    min_read: 4,
    category: { name: "Skill Development" },
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  // Get post data (in real app, this would be fetched from API)
  const post = slug
    ? blogPostData[slug] ||
      blogPostData["10-tips-membuat-cv-yang-menarik-perhatian-hrd"]
    : null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Artikel tidak ditemukan
            </h1>
            <Button asChild>
              <Link to="/blog">Kembali ke Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Back Button */}
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="container mx-auto px-4 lg:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <Badge variant="secondary">{post.category.name}</Badge>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.min_read} menit baca
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {post.views_count.toLocaleString()} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-3 mb-8">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={post.author.avatar}
                    alt={post.author.name}
                  />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-muted-foreground">Penulis</p>
                </div>
              </div>
            )}

            {/* Featured Image */}
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
              {post.image_caption && (
                <p className="text-sm text-muted-foreground text-center py-3 bg-muted/30">
                  {post.image_caption}
                </p>
              )}
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none 
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share */}
            <Separator className="my-8" />
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Bagikan artikel ini:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Artikel Terkait
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {relatedPost.category.name}
                      </Badge>
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {relatedPost.min_read} menit baca
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
