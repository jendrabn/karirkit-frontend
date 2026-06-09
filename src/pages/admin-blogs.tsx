import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { BlogsList } from "@/features/admin/blogs/components/blogs-list";
import { MinimalSEO } from "@/components/minimal-seo";

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
