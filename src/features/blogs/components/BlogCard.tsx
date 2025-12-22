import { Link } from "react-router";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildImageUrl } from "@/lib/utils";
import type { Blog } from "@/features/blogs/api/get-blogs";
import { paths } from "@/config/paths";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Featured Image */}
      {blog.featured_image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={buildImageUrl(blog.featured_image)}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {blog.category && (
            <Badge className="absolute top-3 left-3" variant="default">
              {blog.category.name}
            </Badge>
          )}
        </div>
      )}

      <CardContent className="flex-1 pt-6">
        {/* Title */}
        <Link
          to={paths.blog.detail.getHref(blog.slug)}
          className="block group"
        >
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={blog.published_at || blog.created_at}>
              {format(
                new Date(blog.published_at || blog.created_at),
                "dd MMM yyyy",
                { locale: idLocale }
              )}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{blog.read_time} menit baca</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={
                  blog.user.avatar ? buildImageUrl(blog.user.avatar) : undefined
                }
              />
              <AvatarFallback className="text-xs">
                {blog.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {blog.user.name}
            </span>
          </div>

          {/* Read More Link */}
          <Link
            to={paths.blog.detail.getHref(blog.slug)}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            Baca Selengkapnya
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
