import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BlogList } from "@/features/admin/blogs/components/BlogList";

const AdminBlogs = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Blog"
        subtitle="Kelola artikel dan konten blog Anda."
      />
      <BlogList />
    </DashboardLayout>
  );
};

export default AdminBlogs;
