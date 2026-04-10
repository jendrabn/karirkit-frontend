import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buildImageUrl } from "@/lib/utils";
import type { Blog } from "@/features/blogs/api/get-blogs";
import { paths } from "@/config/paths";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link
      to={paths.blog.detail.getHref(blog.slug)}
      className="group flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {blog.featured_image ? (
          <img
            src={buildImageUrl(blog.featured_image)}
            alt={blog.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
        )}

        {blog.category && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 shadow-sm text-xs font-medium px-2.5 py-1 rounded-lg">
              {blog.category.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2.5 p-5">
        <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {blog.title}
        </h3>

        {blog.excerpt && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
            {blog.excerpt}
          </p>
        )}

        <div className="flex items-center gap-1 text-sm font-medium text-primary mt-2 group-hover:gap-2 transition-all duration-200">
          <span>Baca selengkapnya</span>
          <ArrowRight className="size-3.5 shrink-0" />
        </div>
      </div>
    </Link>
  );
}
