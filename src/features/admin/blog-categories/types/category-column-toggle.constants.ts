import { type CategoryColumnVisibility } from "../components/CategoryColumnToggle";

export const defaultCategoryColumnVisibility: CategoryColumnVisibility = {
  name: true,
  slug: true,
  description: false,
  blog_count: true,
  created_at: true,
  updated_at: false,
};

