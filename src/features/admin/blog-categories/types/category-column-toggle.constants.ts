import { type CategoryColumnVisibility } from "../components/category-column-toggle";

export const defaultCategoryColumnVisibility: CategoryColumnVisibility = {
  name: true,
  slug: true,
  description: false,
  blog_count: true,
  created_at: true,
  updated_at: false,
};

