import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BlogList } from "@/features/admin/blogs/components/BlogList";
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
      <BlogList />
    </DashboardLayout>
  );
};

export default AdminBlogs;
