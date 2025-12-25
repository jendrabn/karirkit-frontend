import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  Eye,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useBlogs, type GetBlogsParams } from "@/features/blogs/api/get-blogs";
import { useBlogCategories } from "@/features/blogs/api/get-blog-categories";
import { buildImageUrl } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { env } from "@/config/env";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  // Build API params
  const apiParams: GetBlogsParams = {
    page: currentPage,
    per_page: perPage,
    q: searchQuery || undefined,
    category_id: selectedCategory !== "all" ? selectedCategory : undefined,
    status: "published",
    sort_by: "published_at",
    sort_order: "desc",
  };

  const { data: blogsData, isLoading } = useBlogs({ params: apiParams });
  const { data: categoriesData } = useBlogCategories();

  const blogPosts = blogsData?.items || [];
  const pagination = blogsData?.pagination;

  // Prepare categories with count
  const allCategories = [
    {
      id: "all",
      name: "Semua",
      slug: "all",
      count: pagination?.total_items || 0,
    },
    ...(categoriesData?.items.map((cat) => ({
      ...cat,
      count: 0, // We don't have individual counts from API
    })) || []),
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = pagination?.total_pages || 0;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog ${env.APP_NAME}`,
    description:
      "Tips, panduan, dan insight untuk membantu perjalanan karier Anda",
    url: `${env.APP_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: env.APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${env.APP_URL}/images/logo.png`,
      },
    },
  };

  return (
    <>
      <SEO
        title="Blog & Artikel Karier"
        description="Temukan tips, panduan, dan insight terbaik untuk membantu perjalanan karier Anda. Artikel tentang CV, surat lamaran, wawancara kerja, dan pengembangan karir."
        keywords="blog karir, tips karir, panduan cv, tips wawancara, pengembangan karir, artikel lowongan kerja, tips lamaran kerja, panduan surat lamaran, career advice, job search tips"
        url="/blog"
        type="website"
        structuredData={structuredData}
      />

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
                  Tips, panduan, dan insight untuk membantu perjalanan karier
                  Anda
                </p>
                <div className="max-w-md mx-auto pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Cari artikel..."
                      className="pl-10 h-12"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="border-b border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center gap-2 py-4 overflow-x-auto">
                {allCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                    {category.id === "all" && (
                      <span className="ml-1 text-xs opacity-70">
                        ({category.count})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8">
              {isLoading ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Memuat artikel...</p>
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    Tidak ada artikel ditemukan
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {blogPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={
                                post.featured_image
                                  ? buildImageUrl(post.featured_image)
                                  : "https://placehold.co/800x450"
                              }
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
                            {post.excerpt && (
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {post.read_time} menit baca
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Eye className="h-3.5 w-3.5" />
                                  {post.views.toLocaleString()}
                                </span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-12">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="px-4 text-sm text-muted-foreground">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
