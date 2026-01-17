import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { Pencil, Trash2, Calendar, Clock, Eye, User, Tag } from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MinimalSEO } from "@/components/MinimalSEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { buildImageUrl } from "@/lib/utils";
import { useState } from "react";

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
    } catch (error) {
      toast.error("Gagal menghapus blog");
    }
  };

  if (error) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog", href: paths.admin.blogs.list.getHref() },
          { label: "Blog Tidak Ditemukan" },
        ]}
      >
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-lg font-medium">Blog tidak ditemukan</p>
          <Button
            onClick={() => navigate(paths.admin.blogs.list.getHref())}
            className="mt-4"
            variant="outline"
          >
            Kembali ke daftar blog
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || !blogData) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog", href: paths.admin.blogs.list.getHref() },
          { label: "Memuat Blog..." },
        ]}
      >
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </DashboardLayout>
    );
  }

  const blog = blogData;

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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Image */}
          {blog.featured_image && (
            <Card>
              <CardContent className="p-0">
                <img
                  src={buildImageUrl(blog.featured_image)}
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Konten</h3>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Info */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusBadgeVariant(blog.status)}>
                  {
                    BLOG_STATUS_OPTIONS.find((s) => s.value === blog.status)
                      ?.label
                  }
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Views:</span>
                  <span className="font-medium">
                    {blog.views.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Waktu Baca:</span>
                  <span className="font-medium">{blog.read_time} menit</span>
                </div>

                {blog.category && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Kategori:</span>
                    <Badge variant="secondary">{blog.category.name}</Badge>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                {blog.published_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Dipublikasi:</span>
                    <span>
                      {format(new Date(blog.published_at), "dd MMM yyyy HH:mm")}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Dibuat:</span>
                  <span>
                    {format(new Date(blog.created_at), "dd MMM yyyy HH:mm")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Diperbarui:</span>
                  <span>
                    {format(new Date(blog.updated_at), "dd MMM yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author */}
          {blog.user && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Penulis
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        blog.user.avatar
                          ? buildImageUrl(blog.user.avatar)
                          : undefined
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {blog.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{blog.user.name}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
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
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminBlogShow;
