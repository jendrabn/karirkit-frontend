import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { JobRoleListResponse } from "@/types/jobRole";

export interface GetJobRolesParams {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "name";
}

export const getJobRoles = (
  params?: GetJobRolesParams
): Promise<JobRoleListResponse> => {
  return api.get("/admin/job-roles", {
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
