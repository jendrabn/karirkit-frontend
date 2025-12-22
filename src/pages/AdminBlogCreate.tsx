import { useState } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BlogForm, type BlogFormData } from "@/components/blog/BlogForm";
import { mockCategories, mockTags, mockAuthors } from "@/data/mockBlogs";
import { toast } from "sonner";

const AdminBlogCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      // In real implementation, call API to create blog
      console.log("Creating blog:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Blog berhasil dibuat");
      navigate("/blogs");
    } catch {
      toast.error("Gagal membuat blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Buat Blog Baru"
        subtitle="Tulis dan publikasikan artikel blog baru."
      />
      <BlogForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/blogs")}
        isLoading={isLoading}
        categories={mockCategories}
        tags={mockTags}
        authors={mockAuthors}
      />
    </DashboardLayout>
  );
};

export default AdminBlogCreate;
