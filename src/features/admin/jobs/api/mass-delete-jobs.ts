import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getJobsQueryOptions } from "./get-jobs";

export interface MassDeleteJobsResponse {
  message: string;
  deleted_count: number;
}

export const massDeleteJobs = (
  ids: string[]
): Promise<MassDeleteJobsResponse> => {
  return api.delete("/admin/jobs/mass-delete", {
    data: { ids },
  });
};

type UseMassDeleteJobsOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteJobs>;
};

export const useMassDeleteJobs = ({
  mutationConfig,
}: UseMassDeleteJobsOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getJobsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteJobs,
  });
};
