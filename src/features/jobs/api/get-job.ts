import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { Job } from "@/types/job";

export const getJob = (slug: string): Promise<Job> => {
  return api.get(`/jobs/${slug}`);
};

export const getJobQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ["jobs", slug],
    queryFn: () => getJob(slug),
    enabled: !!slug,
  });
};

type UseJobOptions = {
  slug: string;
  queryConfig?: QueryConfig<typeof getJobQueryOptions>;
};

export const useJob = ({ slug, queryConfig }: UseJobOptions) => {
  return useQuery({
    ...getJobQueryOptions(slug),
    ...queryConfig,
  });
};
