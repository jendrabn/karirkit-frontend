import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { JobRole } from "@/types/jobRole";

export const getJobRole = (id: string): Promise<JobRole> => {
  return api.get(`/admin/job-roles/${id}`);
};

export const getJobRoleQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["job-role", id],
    queryFn: () => getJobRole(id),
  });
};

type UseJobRoleOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getJobRoleQueryOptions>;
};

export const useJobRole = ({ id, queryConfig }: UseJobRoleOptions) => {
  return useQuery({
    ...getJobRoleQueryOptions(id),
    ...queryConfig,
  });
};
