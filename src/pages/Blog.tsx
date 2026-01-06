import { Link, useSearchParams } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Eye,
  Search,
  Sparkles,
} from "lucide-react";
import { useBlogs, type GetBlogsParams } from "@/features/blogs/api/get-blogs";
import { useBlogCategories } from "@/features/blogs/api/get-blog-categories";
import { useBlogTags } from "@/features/blogs/api/get-blog-tags";
import { buildImageUrl } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { env } from "@/config/env";
import { BlogSidebar } from "@/features/blogs/components/BlogSidebar";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const selectedCategoryId = searchParams.get("category_id") ?? "all";
  const selectedTagId = searchParams.get("tag_id");
  const perPage = 6;
  const pageParam = Number(searchParams.get("page"));
  const currentPage =
    Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  // Build API params
  const apiParams: GetBlogsParams = {
    page: currentPage,
    per_page: perPage,
    q: searchQuery || undefined,
    category_id: selectedCategoryId !== "all" ? selectedCategoryId : undefined,
    tag_id: selectedTagId || undefined,
    status: "published",
    sort_by: "published_at",
    sort_order: "desc",
  };

  const { data: blogsData, isLoading } = useBlogs({ params: apiParams });
  const { data: categoriesData } = useBlogCategories();
  const { data: tagsData } = useBlogTags();

  const blogPosts = blogsData?.items || [];
  const pagination = blogsData?.pagination;

  // Prepare categories
  const categories = categoriesData?.items || [];
  const tags = tagsData?.items || [];

  const handleSearch = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }

    // Clear tag filter when search is performed to avoid conflicting filters
    if (selectedTagId) {
      nextParams.delete("tag_id");
    }

    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (page <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(page));
    }

    setSearchParams(nextParams);
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
          {/* Hero Section with Pattern */}
          <section className="relative py-16 lg:py-24 overflow-hidden">
            {/* Background with geometric pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  Blog & Artikel
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                  Blog & Artikel Karier
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl">
                  Tips, panduan, dan insight untuk membantu perjalanan karier
                  Anda
                </p>
                <div className="max-w-xl mx-auto pt-6">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 pointer-events-none" />
                      <Input
                        placeholder="Cari artikel..."
                        className="w-full pl-14 pr-5 h-14 text-base bg-background border-2 rounded-full focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content with Sidebar */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
              <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
                {/* Blog Posts */}
                <div>
                  {isLoading ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Memuat artikel...
                      </div>
                    </div>
                  ) : blogPosts.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground text-lg">
                        Tidak ada artikel ditemukan
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6">
                        {blogPosts.map((post) => (
                          <Card
                            key={post.id}
                            className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
                          >
                            <div className="flex flex-col sm:flex-row max-w-4xl">
                              {/* Featured Image */}
                              <Link
                                to={`/blog/${post.slug}`}
                                className="relative w-full sm:w-80 h-48 sm:h-auto overflow-hidden group"
                              >
                                <img
                                  src={
                                    post.featured_image
                                      ? buildImageUrl(post.featured_image)
                                      : "https://placehold.co/800x450"
                                  }
                                  alt={post.title}
                                  className="object-cover absolute h-full w-full left-0 top-0 right-0 bottom-0 group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>

                              {/* Content */}
                              <div className="flex-1 p-6">
                                <div className="space-y-4 h-full flex flex-col">
                                  {/* Category Badge and Date */}
                                  <div className="flex items-start justify-between gap-2 flex-wrap">
                                    {post.category && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs font-medium"
                                      >
                                        {post.category.name}
                                      </Badge>
                                    )}
                                    <div className="text-muted-foreground flex items-center text-xs">
                                      <Calendar className="me-1 size-3.5" />
                                      {format(
                                        new Date(
                                          post.published_at || post.created_at
                                        ),
                                        "dd MMM yyyy",
                                        { locale: idLocale }
                                      )}
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <Link to={`/blog/${post.slug}`}>
                                    <h2 className="text-xl font-bold leading-tight hover:text-primary transition-colors line-clamp-2">
                                      {post.title}
                                    </h2>
                                  </Link>

                                  {/* Excerpt */}
                                  {post.excerpt && (
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
                                      {post.excerpt}
                                    </p>
                                  )}

                                  {/* Author Info and Button */}
                                  <div className="flex items-center justify-between gap-4 pt-2">
                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                      <Avatar className="size-9">
                                        <AvatarImage
                                          src={
                                            post.user?.avatar
                                              ? buildImageUrl(post.user.avatar)
                                              : undefined
                                          }
                                          alt={post.user?.name}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {post.user?.name?.charAt(0) || "A"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium leading-none">
                                          {post.user?.name || "Anonymous"}
                                        </p>
                                        <div className="text-muted-foreground flex items-center text-xs">
                                          <Clock className="me-1 size-3" />
                                          {post.read_time} min
                                          <Eye className="ms-2 me-1 size-3" />
                                          {post.views.toLocaleString()}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Read More Button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-1 text-primary hover:text-primary hover:bg-primary/10"
                                      asChild
                                    >
                                      <Link to={`/blog/${post.slug}`}>
                                        Baca
                                        <ArrowRight className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
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

                {/* Sidebar */}
                <aside>
                  <BlogSidebar
                    categories={categories}
                    tags={tags}
                    selectedCategoryId={selectedCategoryId}
                    selectedTagId={selectedTagId}
                    searchQuery={searchQuery}
                  />
                </aside>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
