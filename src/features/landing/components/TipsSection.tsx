import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLatestBlogs } from "@/features/blogs/api/get-latest-blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import { BlogCard } from "@/features/blogs/components/BlogCard";

export function TipsSection() {
  const { data: articles, isLoading } = useLatestBlogs({ limit: 4 });

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">
              Blog & Tips
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Temukan Panduan dan Tips Karir
            </h2>
          </div>
          <Button variant="outline" asChild className="w-fit group">
            <Link to="/blog" className="inline-flex items-center gap-2">
              Lihat Semua Artikel
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-2xl" />
                  <div className="space-y-2 p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-3 w-4" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            : articles?.map((article) => (
                <BlogCard key={article.id} blog={article} />
              ))}
        </div>
      </div>
    </section>
  );
}
