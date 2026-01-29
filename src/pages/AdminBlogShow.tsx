import { useNavigate, useParams } from "react-router";
import {
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Eye,
  Tag,
  MessageSquare,
  Share2,
  FileText,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MinimalSEO } from "@/components/MinimalSEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BLOG_STATUS_OPTIONS, getStatusBadgeVariant } from "@/types/blog";
import { toast } from "sonner";
import { paths } from "@/config/paths";
import { useBlog } from "@/features/admin/blogs/api/get-blog";
import { useDeleteBlog } from "@/features/admin/blogs/api/delete-blog";
import { buildImageUrl, formatNumber } from "@/lib/utils";
import { useState } from "react";
import { formatDateTime } from "@/lib/date";
import { InfoItem, RichText } from "@/components/ui/display-info";

const AdminBlogShow = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: blogData, isLoading, error } = useBlog({ id: id! });
  const deleteBlogMutation = useDeleteBlog();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteBlogMutation.mutateAsync(id);
      toast.success("Blog berhasil dihapus");
      navigate(paths.admin.blogs.list.getHref());
    } catch {
      toast.error("Gagal menghapus blog");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog", href: paths.admin.blogs.list.getHref() },
          { label: "Detail Blog" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data blog...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !blogData) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog", href: paths.admin.blogs.list.getHref() },
          { label: "Blog Tidak Ditemukan" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Blog tidak ditemukan</p>
          <Button onClick={() => navigate(paths.admin.blogs.list.getHref())}>
            Kembali ke Daftar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const blog = blogData;
  const blogMeta = blog as typeof blog & {
    comments_count?: number | null;
    shares_count?: number | null;
    images?: { id?: string; path: string }[] | null;
    meta_title?: string | null;
    meta_description?: string | null;
  };
  const featuredImage = blog.featured_image || blog.image || null;
  const statusLabel =
    BLOG_STATUS_OPTIONS.find((s) => s.value === blog.status)?.label ||
    blog.status;

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Blog", href: paths.admin.blogs.list.getHref() },
        { label: "Detail Blog" },
      ]}
    >
      <MinimalSEO
        title={blog.title}
        description={blog.excerpt || undefined}
        noIndex={true}
      />
      <PageHeader
        title={blog.title}
        subtitle={blog.excerpt || undefined}
        showBackButton
        backButtonUrl={paths.admin.blogs.list.getHref()}
      >
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(paths.admin.blogs.edit.getHref(blog.id))}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">Informasi Blog</CardTitle>
                <Badge
                  variant={getStatusBadgeVariant(blog.status)}
                  className="text-xs"
                >
                  {statusLabel}
                </Badge>
              </div>
              {blog.category && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1.5">
                    <Tag className="h-3 w-3" />
                    {blog.category.name}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {blog.user && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 rounded-lg shrink-0">
                    <AvatarImage
                      src={
                        blog.user.avatar
                          ? buildImageUrl(blog.user.avatar)
                          : undefined
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                      {blog.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {blog.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      @{blog.user.username}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Dipublikasikan"
                  value={
                    blog.published_at ? formatDateTime(blog.published_at) : "-"
                  }
                  icon={Calendar}
                />
                <InfoItem
                  label="Diperbarui"
                  value={formatDateTime(blog.updated_at)}
                  icon={Clock}
                />
                <InfoItem
                  label="Estimasi Baca"
                  value={blog.read_time ? `${blog.read_time} menit` : "-"}
                  icon={Clock}
                />
                <InfoItem
                  label="Views"
                  value={formatNumber(blog.views)}
                  icon={Eye}
                />
              </div>
            </CardContent>
          </Card>

          {featuredImage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gambar Utama</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={buildImageUrl(featuredImage)}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Konten Blog</CardTitle>
            </CardHeader>
            <CardContent>
              <RichText content={blog.content} />
            </CardContent>
          </Card>

          {blogMeta.images && blogMeta.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Galeri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {blogMeta.images.map((image) => (
                    <div
                      key={image.id || image.path}
                      className="aspect-video overflow-hidden rounded-lg border bg-muted"
                    >
                      <img
                        src={buildImageUrl(image.path)}
                        alt="Galeri blog"
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">Statistik Blog</CardTitle>
                <Badge variant="outline" className="gap-1 text-xs uppercase">
                  <Eye className="h-3 w-3" />
                  {formatNumber(blog.views)} views
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  label="Views"
                  value={formatNumber(blog.views)}
                  icon={Eye}
                />
                <InfoItem
                  label="Komentar"
                  value={formatNumber(blogMeta.comments_count)}
                  icon={MessageSquare}
                />
                <InfoItem
                  label="Dibagikan"
                  value={formatNumber(blogMeta.shares_count)}
                  icon={Share2}
                />
                <InfoItem
                  label="Estimasi Baca"
                  value={blog.read_time ? `${blog.read_time} menit` : "-"}
                  icon={Clock}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kategori & Tag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Kategori
                </p>
                {blog.category ? (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1.5">
                      <Tag className="h-3 w-3" />
                      {blog.category.name}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tag
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <InfoItem
                  label="Meta Title"
                  value={blogMeta.meta_title || blog.title}
                  icon={FileText}
                />
                <InfoItem label="Slug" value={blog.slug} icon={Tag} />
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Meta Description
                  </p>
                </div>
                <RichText content={blogMeta.meta_description || blog.excerpt} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Blog ID
                </p>
                <p className="text-xs font-mono bg-muted px-2 py-1.5 rounded break-all">
                  {blog.id}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Dibuat"
                  value={formatDateTime(blog.created_at)}
                  icon={Clock}
                />
                <InfoItem
                  label="Diperbarui"
                  value={formatDateTime(blog.updated_at)}
                  icon={Clock}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Blog?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Blog "{blog.title}" akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteBlogMutation.isPending}
            >
              {deleteBlogMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminBlogShow;
