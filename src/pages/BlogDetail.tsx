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
  Calendar,
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
                    {/* Category & Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {blog.category && (
                        <Badge variant="secondary">{blog.category.name}</Badge>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={blog.published_at || blog.created_at}>
                          {formatDate(
                            blog.published_at || blog.created_at,
                            "DD MMMM YYYY"
                          )}
                        </time>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {blog.read_time} menit baca
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {blog.views.toLocaleString()} views
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                      {blog.title}
                    </h1>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-lg text-muted-foreground mb-6">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Author */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              blog.user.avatar
                                ? buildImageUrl(blog.user.avatar)
                                : undefined
                            }
                            alt={blog.user.name}
                          />
                          <AvatarFallback>
                            {blog.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {blog.user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Penulis
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                        Bagikan
                      </Button>
                    </div>

                    {/* Featured Image */}
                    {blog.featured_image && (
                      <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
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
