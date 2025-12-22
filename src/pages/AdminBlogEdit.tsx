import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BlogForm, type BlogFormData } from "@/components/blog/BlogForm";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/features/admin/blogs/api/get-blog";
import { useUpdateBlog } from "@/features/admin/blogs/api/update-blog";
import { useBlogCategories } from "@/features/blogs/api/get-blog-categories";
import { useBlogTags } from "@/features/blogs/api/get-blog-tags";
import { paths } from "@/config/paths";
import type { BlogCategory, BlogTag } from "@/types/blog";
import { Button } from "@/components/ui/button";

const AdminBlogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const updateBlogMutation = useUpdateBlog();

  // Fetch blog data
  const {
    data: blogData,
    isLoading: isLoadingBlog,
    error,
  } = useBlog({ id: id! });

  // Fetch categories and tags
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useBlogCategories();
  const { data: tagsData, isLoading: isLoadingTags } = useBlogTags();

  const handleSubmit = async (data: BlogFormData) => {
    if (!user || !id) {
      toast.error("Data tidak lengkap");
      return;
    }

    try {
      await updateBlogMutation.mutateAsync({
        id,
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || "",
          content: data.content,
          featured_image: data.featured_image || "",
          status: data.status,
          read_time: data.read_time,
          category_id: data.category_id || "",
          author_id: user.id, // Use logged-in user's ID
          tag_ids: data.tag_ids || [],
        },
      });
      toast.success("Blog berhasil diperbarui");
      navigate(paths.admin.blogs.list.getHref());
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Failed to update blog:", error);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
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

  if (isLoadingBlog || isLoadingCategories || isLoadingTags || !blogData) {
    return (
      <DashboardLayout>
        <PageHeader title="Edit Blog" subtitle="Memuat data..." />
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Map API categories/tags to match the type expected by BlogForm
  const categories: BlogCategory[] =
    categoriesData?.items.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      created_at: cat.created_at,
      updated_at: cat.updated_at,
    })) || [];

  const tags: BlogTag[] =
    tagsData?.items.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      created_at: tag.created_at,
      updated_at: tag.updated_at,
    })) || [];

  // Map API blog data to component blog type
  const mappedBlogData: Partial<import("@/types/blog").Blog> = {
    id: blogData.id,
    title: blogData.title,
    slug: blogData.slug,
    image: blogData.featured_image,
    image_caption: undefined,
    content: blogData.content,
    teaser: blogData.excerpt,
    min_read: blogData.read_time,
    views_count: blogData.views,
    status: blogData.status,
    published_at: blogData.published_at,
    category: blogData.category
      ? {
          id: blogData.category.id,
          name: blogData.category.name,
          slug: blogData.category.slug,
          created_at: blogData.category.created_at,
          updated_at: blogData.category.updated_at,
        }
      : undefined,
    tags: blogData.tags?.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      created_at: tag.created_at,
      updated_at: tag.updated_at,
    })),
    author: blogData.user
      ? {
          id: blogData.user.id,
          name: blogData.user.name,
          avatar: blogData.user.avatar,
        }
      : undefined,
    created_at: blogData.created_at,
    updated_at: blogData.updated_at,
  };

  return (
    <DashboardLayout>
      <PageHeader title="Edit Blog" subtitle={`Mengedit: ${blogData.title}`} />
      <BlogForm
        initialData={mappedBlogData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(paths.admin.blogs.list.getHref())}
        isLoading={updateBlogMutation.isPending}
        categories={categories}
        tags={tags}
      />
    </DashboardLayout>
  );
};

export default AdminBlogEdit;
