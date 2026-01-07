import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { User } from "@/types/user";
import type { Blog } from "@/types/blog";

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
  recent_blogs: Blog[];
  blog_status_distribution: {
    draft: number;
    published: number;
    archived: number;
  };
  user_role_distribution: Record<string, number>;
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

export const useDashboardStats = ({
  queryConfig,
}: UseDashboardStatsOptions = {}) => {
  return useQuery({
    ...getDashboardStatsQueryOptions(),
    ...queryConfig,
  });
};
