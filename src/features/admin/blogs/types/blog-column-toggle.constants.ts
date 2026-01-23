import { type ColumnVisibility } from "../components/BlogColumnToggle";

export const defaultBlogColumnVisibility: ColumnVisibility = {
  title: true,
  category: true,
  author: true,
  status: true,
  views_count: true,
  min_read: false,
  published_at: true,
  slug: false,
  tags: false,
  created_at: true,
  updated_at: false,
};

