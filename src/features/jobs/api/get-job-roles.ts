import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { JobRole } from "@/types/job";

export interface JobRolesListResponse {
  items: JobRole[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface GetJobRolesParams {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "name";
}

export const getJobRoles = (
  params?: GetJobRolesParams
): Promise<JobRolesListResponse> => {
  return api.get("/job-roles", {
    params,
  });
};

export const getJobRolesQueryOptions = (params?: GetJobRolesParams) => {
  return queryOptions({
    queryKey: ["job-roles", params],
    queryFn: () => getJobRoles(params),
  });
};

type UseJobRolesOptions = {
  params?: GetJobRolesParams;
  queryConfig?: QueryConfig<typeof getJobRolesQueryOptions>;
};

export const useJobRoles = ({
  params,
  queryConfig,
}: UseJobRolesOptions = {}) => {
  return useQuery({
    ...getJobRolesQueryOptions(params),
    ...queryConfig,
  });
};
