import { Link } from "react-router";
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
      className="flex h-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-[box-shadow,border-color,background-color,ring-color] duration-200 hover:border-primary/30 hover:bg-primary/5 hover:ring-1 hover:ring-primary/10 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] dark:hover:bg-primary/10 dark:hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:flex-col"
    >
      <div className="relative w-28 shrink-0 overflow-hidden bg-muted sm:aspect-[16/9] sm:w-full">
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
          <div className="absolute left-3 top-3 hidden sm:block">
            <Badge className="rounded-md border-0 bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
              {blog.category.name}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-6">
        <h3 className="line-clamp-3 text-[13px] font-semibold leading-snug text-foreground sm:text-[17px]">
          {blog.title}
        </h3>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-1 text-[11px] leading-none text-muted-foreground sm:gap-3 sm:pt-2 sm:text-xs">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Avatar className="size-5 shrink-0 sm:size-6">
              <AvatarImage
                src={
                  blog.user?.avatar ? buildImageUrl(blog.user.avatar) : undefined
                }
                alt={blog.user?.name || "Anonymous"}
                className="object-cover"
              />
              <AvatarFallback className="text-[9px] font-medium sm:text-[10px]">
                {(blog.user?.name || "A").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="min-w-0 truncate text-xs font-medium leading-none text-foreground sm:text-sm">
              {blog.user?.name || "Anonymous"}
            </p>
          </div>
          <time
            dateTime={publishedAt}
            className="shrink-0 text-[10.5px] font-medium leading-none text-muted-foreground/85 sm:text-xs"
          >
              {format(new Date(publishedAt), "dd MMMM yyyy", {
                locale: idLocale,
              })}
          </time>
        </div>
      </div>
    </Link>
  );
}
