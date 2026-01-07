import type { ListResponse } from "./api";

export type BlogStatus = "draft" | "published" | "archived";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  blog_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  blog_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  username: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar?: string | null;
  social_links?: any[]; // Simplified
}

export interface Blog {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  /** @alias featured_image */
  image?: string | null;
  /** @alias excerpt */
  teaser?: string | null;
  image_caption?: string | null;
  status: BlogStatus;
  read_time: number | null;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  user?: PublicUserProfile;
  category?: BlogCategory;
  tags?: BlogTag[];
}

export type BlogResponse = Blog;
export type BlogListResponse = ListResponse<Blog>;

export const BLOG_STATUS_OPTIONS: { value: BlogStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Dipublikasi" },
  { value: "archived", label: "Diarsipkan" },
];

export const getStatusBadgeVariant = (status: BlogStatus) => {
  switch (status) {
    case "draft":
      return "secondary";
    case "published":
      return "default";
    case "archived":
      return "destructive";
    default:
      return "secondary";
  }
};
