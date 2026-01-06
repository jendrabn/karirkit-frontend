import { Link } from "react-router";
import { ArrowRight, Eye } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Separator } from "@/components/ui/separator";
import { badgeVariants } from "@/components/ui/badge";
import { buildImageUrl, cn } from "@/lib/utils";
import { paths } from "@/config/paths";
import { useLatestBlogs } from "@/features/blogs/api/get-latest-blogs";
import { usePopularBlogs } from "@/features/blogs/api/get-popular-blogs";

import type { BlogCategory } from "@/features/blogs/api/get-blog-categories";
import type { BlogTag } from "@/features/blogs/api/get-blog-tags";

type BlogSidebarProps = {
  categories: BlogCategory[];
  tags: BlogTag[];
  selectedCategoryId?: string;
  selectedTagId?: string | null;
  searchQuery?: string;
  basePath?: string;
};

const buildListHref = (
  basePath: string,
  params: {
    categoryId?: string;
    tagId?: string;
    query?: string;
  }
) => {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.set("q", params.query);
  }

  if (params.categoryId && params.categoryId !== "all") {
    searchParams.set("category_id", params.categoryId);
  }

  if (params.tagId) {
    searchParams.set("tag_id", params.tagId);
  }

  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export const BlogSidebar = ({
  categories,
  tags,
  selectedCategoryId = "all",
  selectedTagId,
  searchQuery = "",
  basePath = paths.blog.list.getHref(),
}: BlogSidebarProps) => {
  const { data: latestPosts = [] } = useLatestBlogs({ limit: 4 });
  const { data: popularPosts = [] } = usePopularBlogs({
    params: { limit: 4, window: "7d" },
  });

  const categoryHref = (categoryId?: string) =>
    buildListHref(basePath, {
      categoryId,
      query: searchQuery || undefined,
    });

  const tagHref = (tagId: string) =>
    buildListHref(basePath, {
      categoryId: selectedCategoryId !== "all" ? selectedCategoryId : undefined,
      tagId: selectedTagId === tagId ? undefined : tagId,
    });

  return (
    <div className="space-y-8">
      {/* Latest Articles */}
      <div>
        <div className="relative mb-5">
          <h3 className="font-bold text-base uppercase tracking-wide text-foreground relative inline-block">
            <span className="relative z-10 bg-background pr-3">
              Artikel Terbaru
            </span>
          </h3>
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
        </div>
        <div className="space-y-4">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              <div className="relative w-24 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 border">
                <img
                  src={
                    post.featured_image
                      ? buildImageUrl(post.featured_image)
                      : "https://placehold.co/400x300"
                  }
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {format(
                    new Date(post.published_at || post.created_at),
                    "dd MMM yyyy",
                    { locale: idLocale }
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      {/* Popular Articles */}
      <div>
        <div className="relative mb-5">
          <h3 className="font-bold text-base uppercase tracking-wide text-foreground relative inline-block">
            <span className="relative z-10 bg-background pr-3">
              Artikel Populer
            </span>
          </h3>
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
        </div>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              <div className="relative w-24 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 border">
                <img
                  src={
                    post.featured_image
                      ? buildImageUrl(post.featured_image)
                      : "https://placehold.co/400x300"
                  }
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {post.views.toLocaleString()} views
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <div className="relative mb-5">
          <h3 className="font-bold text-base uppercase tracking-wide text-foreground relative inline-block">
            <span className="relative z-10 bg-background pr-3">Kategori</span>
          </h3>
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
        </div>
        <div className="space-y-2">
          <Link
            to={categoryHref(undefined)}
            className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategoryId === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            Semua Kategori
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={categoryHref(category.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategoryId === category.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tags */}
      <div>
        <div className="relative mb-5">
          <h3 className="font-bold text-base uppercase tracking-wide text-foreground relative inline-block">
            <span className="relative z-10 bg-background pr-3">
              Popular Tags
            </span>
          </h3>
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={tagHref(tag.id)}
              className={cn(
                badgeVariants({ variant: "outline" }),
                "cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-sm px-3 py-1.5",
                selectedTagId === tag.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : ""
              )}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      {/* Ad Space - Trending Style */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border-2 border-dashed border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base uppercase tracking-wide">
            Trending
          </h3>
          <Link
            to={basePath}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Lihat lainnya
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {popularPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="flex gap-3 items-start group"
            >
              <div className="relative w-20 aspect-[4/3] rounded-md overflow-hidden flex-shrink-0 border">
                <img
                  src={
                    post.featured_image
                      ? buildImageUrl(post.featured_image)
                      : "https://placehold.co/400x300"
                  }
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {post.user?.name} | {post.read_time} min baca
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
