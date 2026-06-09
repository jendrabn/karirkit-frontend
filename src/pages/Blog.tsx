import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useBlogs, type GetBlogsParams } from "@/features/blogs/api/get-blogs";
import { useBlogCategories } from "@/features/blogs/api/get-blog-categories";
import { useBlogTags } from "@/features/blogs/api/get-blog-tags";
import { SEO } from "@/components/SEO";
import { env } from "@/config/env";
import { BlogSidebar } from "@/features/blogs/components/BlogSidebar";
import { useUrlParams } from "@/hooks/use-url-params";
import { PublicPageHero } from "@/components/PublicPageHero";
import { BlogCard } from "@/features/blogs/components/BlogCard";

const Blog = () => {
  const perPage = 6;

  // Use URL params hook
  const {
    params,
    setParam,
    searchInput,
    handleSearchInput,
    handleSearchSubmit,
  } = useUrlParams({
    page: 1,
    per_page: perPage,
    q: "",
    category_id: "",
    tag_id: "",
  });

  // Build API params
  const apiParams: GetBlogsParams = {
    page: params.page,
    per_page: params.per_page,
    q: params.q || undefined,
    category_id:
      params.category_id && params.category_id !== "all"
        ? params.category_id
        : undefined,
    tag_id: params.tag_id || undefined,
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

  const selectedCategoryId = params.category_id || "all";
  const selectedTagId = params.tag_id;

  const handlePageChange = (page: number) => {
    setParam("page", page <= 1 ? 1 : page, false);
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
          <PublicPageHero
            title="Blog & Artikel Karier"
            description="Tips, panduan, dan insight untuk membantu perjalanan karier Anda"
            searchId="blog-search"
            searchPlaceholder="Cari artikel..."
            searchValue={searchInput}
            onSearchChange={handleSearchInput}
            onSearchSubmit={handleSearchSubmit}
          />

          {/* Main Content with Sidebar */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
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
                      <div className="grid gap-6 lg:grid-cols-2">
                        {blogPosts.map((post) => (
                          <BlogCard key={post.id} blog={post} />
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
                            disabled={params.page === 1}
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handlePageChange(params.page - 1)}
                            disabled={params.page === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="px-4 text-sm text-muted-foreground">
                            Halaman {params.page} dari {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handlePageChange(params.page + 1)}
                            disabled={params.page === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={params.page === totalPages}
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Sidebar */}
                <aside className="w-full lg:sticky lg:top-24 lg:self-start">
                  <BlogSidebar
                    categories={categories}
                    tags={tags}
                    selectedCategoryId={selectedCategoryId}
                    selectedTagId={selectedTagId}
                    searchQuery={params.q}
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
