import { useParams, Link } from "react-router";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Loader2,
  Tag,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { BlogCard } from "@/features/blogs/components/BlogCard";
import { useBlog } from "@/features/blogs/api/get-blog";
import { useBlogs } from "@/features/blogs/api/get-blogs";
import { buildImageUrl } from "@/lib/utils";
import { paths } from "@/config/paths";

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

  // Fetch related posts (same category, exclude current post)
  const { data: relatedData } = useBlogs({
    params: {
      category_id: blogData?.category?.id,
      per_page: 3,
      status: "published",
    },
    queryConfig: {
      enabled: !!blogData?.category?.id,
    },
  });

  const relatedPosts =
    relatedData?.items.filter((post) => post.slug !== slug) || [];

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
        <SEO title="Artikel Tidak Ditemukan" description="Artikel yang Anda cari tidak ditemukan" />
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
  const shareUrl = `${window.location.origin}${paths.blog.detail.getHref(blog.slug)}`;
  const shareTitle = encodeURIComponent(blog.title);

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.excerpt}
        image={blog.featured_image ? buildImageUrl(blog.featured_image) : undefined}
        url={paths.blog.detail.getHref(blog.slug)}
        type="article"
        publishedTime={blog.published_at || blog.created_at}
        modifiedTime={blog.updated_at}
        author={blog.user.name}
        tags={blog.tags?.map((tag) => tag.name)}
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
          <article className="container mx-auto px-4 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {blog.category && (
                  <Badge variant="secondary">{blog.category.name}</Badge>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={blog.published_at || blog.created_at}>
                    {format(
                      new Date(blog.published_at || blog.created_at),
                      "dd MMMM yyyy",
                      { locale: idLocale }
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
              <div className="flex items-center gap-3 mb-8">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      blog.user.avatar
                        ? buildImageUrl(blog.user.avatar)
                        : undefined
                    }
                    alt={blog.user.name}
                  />
                  <AvatarFallback>{blog.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {blog.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">Penulis</p>
                </div>
              </div>

              {/* Featured Image */}
              {blog.featured_image && (
                <div className="rounded-2xl overflow-hidden mb-8">
                  <img
                    src={buildImageUrl(blog.featured_image)}
                    alt={blog.title}
                    className="w-full h-auto object-cover"
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
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    {blog.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

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
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="bg-muted/30 py-12 lg:py-16">
              <div className="container mx-auto px-4 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  Artikel Terkait
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
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
