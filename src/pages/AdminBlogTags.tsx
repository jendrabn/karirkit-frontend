import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";
import { TagList } from "@/features/admin/blog-tags/components/TagList";
import { paths } from "@/config/paths";

const AdminBlogTags = () => {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Blog", href: paths.admin.blogs.list.getHref() },
        { label: "Tag Blog" },
      ]}
    >
      <MinimalSEO
        title="Manajemen Tag Blog"
        description="Kelola tag untuk konten blog."
        noIndex={true}
      />
      <PageHeader
        title="Manajemen Tag Blog"
        subtitle="Kelola tag blog untuk memudahkan pencarian artikel."
      />

      <TagList />
    </DashboardLayout>
  );
};

export default AdminBlogTags;
