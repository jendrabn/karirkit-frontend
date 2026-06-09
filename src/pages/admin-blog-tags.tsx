import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { MinimalSEO } from "@/components/minimal-seo";
import { TagList } from "@/features/admin/blog-tags/components/tag-list";
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
