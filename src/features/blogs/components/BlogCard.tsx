import { Link } from "react-router";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildImageUrl } from "@/lib/utils";
import type { Blog } from "@/features/blogs/api/get-blogs";
import { paths } from "@/config/paths";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="flex flex-col gap-6 rounded-xl border shadow-sm w-full overflow-hidden pt-0 hover:shadow-lg transition-shadow duration-300">
      {/* Featured Image */}
      {blog.featured_image && (
        <figure className="relative aspect-video w-full">
          <img
            src={buildImageUrl(blog.featured_image)}
            alt={blog.title}
            className="object-cover absolute h-full w-full left-0 top-0 right-0 bottom-0"
          />
        </figure>
      )}

      <CardContent className="px-6 space-y-4">
        {/* Category Badge and Read Time */}
        <div className="flex items-start justify-between">
          {blog.category && (
            <Badge
              variant="outline"
              className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap"
            >
              {blog.category.name}
            </Badge>
          )}
          <div className="text-muted-foreground flex items-center text-xs">
            <Clock className="me-1 size-3" aria-hidden="true" />
            {blog.read_time} menit baca
          </div>
        </div>

        {/* Title */}
        <Link to={paths.blog.detail.getHref(blog.slug)}>
          <h4 className="text-xl font-semibold leading-tight hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h4>
        </Link>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {blog.excerpt}
          </p>
        )}

        {/* Author Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="size-8">
            <AvatarImage
              src={
                blog.user?.avatar ? buildImageUrl(blog.user.avatar) : undefined
              }
              className="object-cover"
              alt={blog.user?.name}
            />
            <AvatarFallback className="text-xs">
              {blog.user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm leading-none font-medium">
              {blog.user?.name || "Anonymous"}
            </p>
            <div className="text-muted-foreground flex items-center text-xs">
              Blogger
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Button variant="outline" className="w-full h-9" asChild>
          <Link to={paths.blog.detail.getHref(blog.slug)}>
            Baca Selengkapnya
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
