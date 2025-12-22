import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BlogForm, type BlogFormData } from "@/components/blog/BlogForm";
import {
  mockBlogs,
  mockCategories,
  mockTags,
  mockAuthors,
} from "@/data/mockBlogs";
import { toast } from "sonner";

const AdminBlogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const blog = mockBlogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-lg font-medium">Blog tidak ditemukan</p>
          <button
            onClick={() => navigate("/blogs")}
            className="mt-4 text-primary hover:underline"
          >
            Kembali ke daftar blog
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      // In real implementation, call API to update blog
      console.log("Updating blog:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Blog berhasil diperbarui");
      navigate("/blogs");
    } catch {
      toast.error("Gagal memperbarui blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Edit Blog" subtitle={`Mengedit: ${blog.title}`} />
      <BlogForm
        initialData={blog}
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

export default AdminBlogEdit;
