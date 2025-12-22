import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { User } from "@/features/admin/users/api/get-users";

export interface DashboardStatistics {
  total_users: number;
  total_admins: number;
  total_blogs: number;
  total_published_blogs: number;
  total_draft_blogs: number;
  total_categories: number;
  total_tags: number;
  total_templates: number;
  total_cv_templates: number;
  total_application_letter_templates: number;
  recent_users: User[];
  recent_blogs: {
    id: string;
    user_id: string;
    category_id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    status: "draft" | "published" | "archived";
    read_time: number;
    views: number;
    created_at: string;
    updated_at: string;
    published_at: string;
    user: User;
    category: {
      id: string;
      name: string;
      slug: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    tags: {
      id: string;
      name: string;
      slug: string;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  blog_status_distribution: {
    draft: number;
    published: number;
    archived: number;
  };
  user_role_distribution: {
    user: number;
    admin: number;
  };
}

export const getDashboardStats = (): Promise<DashboardStatistics> => {
  return api.get("/admin/dashboard");
};

export const getDashboardStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStats,
  });
};

type UseDashboardStatsOptions = {
  queryConfig?: QueryConfig<typeof getDashboardStatsQueryOptions>;
};

export const useDashboardStats = ({ queryConfig }: UseDashboardStatsOptions = {}) => {
  return useQuery({
    ...getDashboardStatsQueryOptions(),
    ...queryConfig,
  });
};
