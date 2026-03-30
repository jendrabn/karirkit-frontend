import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { AdminDashboardStatistics } from "@/types/dashboard";

export const getDashboardStats = (): Promise<AdminDashboardStatistics> => {
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
