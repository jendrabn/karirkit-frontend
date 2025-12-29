import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { Job } from "@/types/job";

export const getJob = (id: string): Promise<Job> => {
  return api.get(`/admin/jobs/${id}`);
};

export const getJobQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
  });
};

type UseJobOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getJobQueryOptions>;
};

export const useJob = ({ id, queryConfig }: UseJobOptions) => {
  return useQuery({
    ...getJobQueryOptions(id),
    ...queryConfig,
  });
};
