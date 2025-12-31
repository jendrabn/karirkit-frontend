import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";
import {
  BlogForm,
  type BlogFormData,
} from "@/features/admin/blogs/components/BlogForm";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBlog } from "@/features/admin/blogs/api/create-blog";
import { useBlogCategories } from "@/features/blogs/api/get-blog-categories";
import { useBlogTags } from "@/features/blogs/api/get-blog-tags";
import { paths } from "@/config/paths";
import type { BlogCategory, BlogTag } from "@/types/blog";

const AdminBlogCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createBlogMutation = useCreateBlog();

  // Fetch categories and tags
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useBlogCategories();
  const { data: tagsData, isLoading: isLoadingTags } = useBlogTags();

  const handleSubmit = async (data: BlogFormData) => {
    if (!user) {
      toast.error("User tidak ditemukan");
      return;
    }

    try {
      await createBlogMutation.mutateAsync({
        title: data.title,
        excerpt: data.excerpt || "",
        content: data.content,
        featured_image: data.featured_image || "",
        status: data.status,
        category_id: data.category_id || "",
        author_id: user.id, // Use logged-in user's ID
        tag_ids: data.tag_ids || [],
      });
      toast.success("Blog berhasil dibuat");
      navigate(paths.admin.blogs.list.getHref());
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Failed to create blog:", error);
    }
  };

  if (isLoadingCategories || isLoadingTags) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog", href: paths.admin.blogs.list.getHref() },
          { label: "Buat Blog Baru" },
        ]}
      >
        <PageHeader
          title="Buat Blog Baru"
          subtitle="Tulis dan publikasikan artikel blog baru."
        />
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
      blog_count: 0,
      created_at: tag.created_at,
      updated_at: tag.updated_at,
    })) || [];

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Blog", href: paths.admin.blogs.list.getHref() },
        { label: "Buat Blog Baru" },
      ]}
    >
      <MinimalSEO
        title="Buat Blog Baru"
        description="Buat blog baru."
        noIndex={true}
      />
      <PageHeader
        title="Buat Blog Baru"
        subtitle="Tulis dan publikasikan artikel blog baru."
      />
      <BlogForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(paths.admin.blogs.list.getHref())}
        isLoading={createBlogMutation.isPending}
        categories={categories}
        tags={tags}
      />
    </DashboardLayout>
  );
};

export default AdminBlogCreate;
