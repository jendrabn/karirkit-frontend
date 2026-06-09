import { useParams, Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/date";
import {
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  Loader2,
  Tag,
} from "lucide-react";
import { BlogCard } from "@/features/blogs/components/BlogCard";
import { BlogSidebar } from "@/features/blogs/components/BlogSidebar";
import { useBlog } from "@/features/blogs/api/get-blog";
import { useBlogCategories } from "@/features/blogs/api/get-blog-categories";
import { useBlogTags } from "@/features/blogs/api/get-blog-tags";
import { useRelatedBlogs } from "@/features/blogs/api/get-related-blogs";
import { buildImageUrl } from "@/lib/utils";
import { paths } from "@/config/paths";
import { SEO } from "@/components/SEO";
import { env } from "@/config/env";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: blogData,
    isLoading,
    error,
  } = useBlog({
    slug: slug!,
    queryConfig: {
      enabled: !!slug,
    },
  });

  // Fetch related posts
  const { data: relatedBlogs } = useRelatedBlogs({
    params: {
      slug: slug!,
      limit: 3,
    },
    queryConfig: {
      enabled: !!slug,
    },
  });

  const relatedPosts = relatedBlogs || [];

  const { data: sidebarCategoriesData } = useBlogCategories();
  const { data: sidebarTagsData } = useBlogTags();

  const categories = sidebarCategoriesData?.items || [];
  const tags = sidebarTagsData?.items || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Error/Not found state
  if (error || !blogData) {
    return (
      <>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground">
                Artikel tidak ditemukan
              </h1>
              <p className="text-muted-foreground">
                Artikel yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <Button asChild>
                <Link to={paths.blog.list.getHref()}>Kembali ke Blog</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const blog = blogData;
  const shareUrl = `${window.location.origin}${paths.blog.detail.getHref(
    blog.slug
  )}`;
  const shareText = blog.excerpt || blog.title;

  const handleShare = async () => {
    if (!("share" in navigator)) {
      const nav = navigator as Navigator & { clipboard?: Clipboard };
      if (nav.clipboard && nav.clipboard.writeText) {
        await nav.clipboard.writeText(shareUrl);
      }
      return;
    }

    try {
      await navigator.share({
        title: blog.title,
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // Intentionally ignore share cancellation errors.
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || blog.title,
    image: blog.featured_image ? buildImageUrl(blog.featured_image) : undefined,
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at,
    author: {
      "@type": "Person",
      name: blog.user.name,
      image: blog.user.avatar ? buildImageUrl(blog.user.avatar) : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: env.APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${env.APP_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl,
    },
    articleSection: blog.category?.name,
    keywords: blog.tags?.map((tag) => tag.name).join(", "),
    wordCount: blog.content.split(/\s+/).length,
    timeRequired: `PT${blog.read_time}M`,
  };

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.excerpt || blog.title}
        keywords={`${blog.category?.name || ""}, ${
          blog.tags?.map((tag) => tag.name).join(", ") || ""
        }, blog karir, artikel karir`}
        image={
          blog.featured_image ? buildImageUrl(blog.featured_image) : undefined
        }
        url={`/blog/${blog.slug}`}
        type="article"
        author={blog.user.name}
        publishedTime={blog.published_at || blog.created_at}
        modifiedTime={blog.updated_at}
        section={blog.category?.name}
        tags={blog.tags?.map((tag) => tag.name)}
        structuredData={structuredData}
      />

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1">
          {/* Back Button */}
          <div className="container mx-auto px-4 lg:px-8 py-6">
            <Link
              to={paths.blog.list.getHref()}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Blog
            </Link>
          </div>

          {/* Article Header */}
          <section className="pb-12">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
              <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
                <article className="min-w-0">
                  <div className="max-w-4xl">
                    {/* Title */}
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-[3.15rem]">
                      {blog.title}
                    </h1>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Author + Meta + Share */}
                    <div className="mt-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                      <div className="min-w-0 flex items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0 rounded-full sm:h-11 sm:w-11">
                          <AvatarImage
                            src={
                              blog.user.avatar
                                ? buildImageUrl(blog.user.avatar)
                                : undefined
                            }
                            className="object-cover"
                            alt={blog.user.name}
                          />
                          <AvatarFallback className="text-xs font-medium">
                            {blog.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 space-y-1.5">
                          <p className="truncate text-sm leading-none text-muted-foreground sm:text-[15px]">
                            Oleh{" "}
                            <span className="font-semibold">
                              {blog.user.name}
                            </span>
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs leading-none text-muted-foreground sm:text-sm">
                            <time dateTime={blog.published_at || blog.created_at}>
                              {formatDate(
                                blog.published_at || blog.created_at,
                                "dddd, D MMMM YYYY - HH:mm"
                              )}
                            </time>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <span className="inline-flex h-10 items-center gap-2 rounded-md border border-border/70 bg-background px-3.5 text-sm font-medium text-muted-foreground shadow-sm select-none">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>{blog.read_time} min</span>
                        </span>

                        <span className="inline-flex h-10 items-center gap-2 rounded-md border border-border/70 bg-background px-3.5 text-sm font-medium text-muted-foreground shadow-sm select-none">
                          <Eye className="h-4 w-4 shrink-0" />
                          <span>{blog.views.toLocaleString()}</span>
                        </span>

                        <Button
                          variant="outline"
                          className="h-10 gap-2 rounded-md border-border/70 bg-background px-3.5 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-foreground"
                          onClick={handleShare}
                          aria-label="Bagikan artikel"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </div>

                    {/* Featured Image */}
                    {blog.featured_image && (
                      <div className="mt-6 mb-8 overflow-hidden rounded-2xl aspect-video sm:mt-8">
                        <img
                          src={buildImageUrl(blog.featured_image)}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div
                      className="prose prose-lg max-w-none 
                        prose-headings:text-foreground prose-headings:font-bold
                        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                        prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                        prose-strong:text-foreground
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-lg
                        prose-ul:text-muted-foreground
                        prose-ol:text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mt-8">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Tags:
                          </span>
                          {blog.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>

                <aside>
                  <BlogSidebar categories={categories} tags={tags} />
                </aside>
              </div>
            </div>
          </section>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="bg-muted/30 py-12 lg:py-16">
              <div className="container mx-auto px-4 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  Artikel Terkait
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedPosts.map((post) => (
                    <BlogCard key={post.id} blog={post} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogDetail;
