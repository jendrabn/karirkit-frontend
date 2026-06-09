import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/layouts/page-header";
import { MinimalSEO } from "@/components/minimal-seo";
import { CategoryList } from "@/features/admin/blog-categories/components/category-list";
import { paths } from "@/config/paths";

const AdminBlogCategories = () => {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Blog", href: paths.admin.blogs.list.getHref() },
        { label: "Kategori Blog" },
      ]}
    >
      <MinimalSEO
        title="Manajemen Kategori Blog"
        description="Kelola kategori untuk konten blog."
        noIndex={true}
      />
      <PageHeader
        title="Manajemen Kategori Blog"
        subtitle="Kelola kategori blog untuk mengelompokkan artikel Anda."
      />

      <CategoryList />
    </DashboardLayout>
  );
};

export default AdminBlogCategories;
