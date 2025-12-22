import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { DashboardStatsResponse } from "@/types/dashboard";

export const getDashboardStats = (): Promise<DashboardStatsResponse> => {
  return api.get("/dashboard");
};

export const getDashboardStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
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
