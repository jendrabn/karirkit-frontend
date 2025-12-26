import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BlogsList } from "@/features/admin/blogs/components/BlogsList";
import { MinimalSEO } from "@/components/MinimalSEO";

const AdminBlogs = () => {
  return (
    <DashboardLayout>
      <MinimalSEO
        title="Kelola Blog"
        description="Kelola artikel dan konten blog Anda."
        noIndex={true}
      />
      <PageHeader
        title="Blog"
        subtitle="Kelola artikel dan konten blog Anda."
      />
      <BlogsList />
    </DashboardLayout>
  );
};

export default AdminBlogs;
