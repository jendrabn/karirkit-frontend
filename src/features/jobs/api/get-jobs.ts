import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { Job, JobPagination, JobFilters } from "@/types/job";

export interface JobsListResponse {
  items: Job[];
  pagination: JobPagination;
}

export const getJobs = (params?: JobFilters): Promise<JobsListResponse> => {
  return api.get("/jobs", {
    params,
  });
};

export const getJobsQueryOptions = (params?: JobFilters) => {
  return queryOptions({
    queryKey: ["jobs", params],
    queryFn: () => getJobs(params),
  });
};

type UseJobsOptions = {
  params?: JobFilters;
  queryConfig?: QueryConfig<typeof getJobsQueryOptions>;
};

export const useJobs = ({ params, queryConfig }: UseJobsOptions = {}) => {
  return useQuery({
    ...getJobsQueryOptions(params),
    ...queryConfig,
  });
};
