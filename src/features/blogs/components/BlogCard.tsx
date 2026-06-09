import { Link } from "react-router";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buildImageUrl } from "@/lib/utils";
import type { Blog } from "@/features/blogs/api/get-blogs";
import { paths } from "@/config/paths";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const publishedAt = blog.published_at || blog.created_at;

  return (
    <Link
      to={paths.blog.detail.getHref(blog.slug)}
      aria-label={`Buka artikel ${blog.title}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-[box-shadow,border-color,background-color,ring-color] duration-200 hover:border-primary/30 hover:bg-primary/5 hover:ring-1 hover:ring-primary/10 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] dark:hover:bg-primary/10 dark:hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[16/9] w-full bg-muted">
        {blog.featured_image ? (
          <img
            src={buildImageUrl(blog.featured_image)}
            alt={blog.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
        )}

        {blog.category && (
          <div className="absolute left-3 top-3">
            <Badge className="rounded-md border-0 bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
              {blog.category.name}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground sm:text-[17px]">
          {blog.title}
        </h3>

        {blog.excerpt && (
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-6 shrink-0">
              <AvatarImage
                src={
                  blog.user?.avatar ? buildImageUrl(blog.user.avatar) : undefined
                }
                alt={blog.user?.name || "Anonymous"}
                className="object-cover"
              />
              <AvatarFallback className="text-[10px] font-medium">
                {(blog.user?.name || "A").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="min-w-0 truncate text-sm font-medium leading-none text-foreground">
              {blog.user?.name || "Anonymous"}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs leading-none text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" />
              <span>
                {format(new Date(publishedAt), "dd MMM yyyy", {
                  locale: idLocale,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" />
              <span>{blog.read_time} min</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
