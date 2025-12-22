import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

export type ApplicationStats = {
  total_applications: number;
  active_applications: number;
  interview: number;
  offer: number;
  rejected: number;
  needs_followup: number;
  overdue: number;
  no_followup: number;
};

export const getApplicationStats = (): Promise<ApplicationStats> => {
  return api.get("/applications/stats");
};

export const getApplicationStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ["applications", "stats"],
    queryFn: getApplicationStats,
  });
};

type UseApplicationStatsOptions = {
  queryConfig?: QueryConfig<typeof getApplicationStatsQueryOptions>;
};

export const useApplicationStats = ({
  queryConfig,
}: UseApplicationStatsOptions = {}) => {
  return useQuery({
    ...getApplicationStatsQueryOptions(),
    ...queryConfig,
  });
};
