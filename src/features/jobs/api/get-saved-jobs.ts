import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { Job, JobPagination, JobFilters } from "@/types/job";

export interface SavedJobsListResponse {
  items: Job[];
  pagination: JobPagination;
}

export const getSavedJobs = (
  params?: JobFilters
): Promise<SavedJobsListResponse> => {
  return api.get("/jobs/saved", {
    params,
  });
};

export const getSavedJobsQueryOptions = (params?: JobFilters) => {
  return queryOptions({
    queryKey: ["saved-jobs", params],
    queryFn: () => getSavedJobs(params),
  });
};

type UseSavedJobsOptions = {
  params?: JobFilters;
  queryConfig?: QueryConfig<typeof getSavedJobsQueryOptions>;
};

export const useSavedJobs = ({
  params,
  queryConfig,
}: UseSavedJobsOptions = {}) => {
  return useQuery({
    ...getSavedJobsQueryOptions(params),
    ...queryConfig,
  });
};
