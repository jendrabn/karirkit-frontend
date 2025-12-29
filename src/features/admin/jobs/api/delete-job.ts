import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getJobsQueryOptions } from "./get-jobs";

export const deleteJob = (id: string): Promise<null> => {
  return api.delete(`/admin/jobs/${id}`);
};

type UseDeleteJobOptions = {
  mutationConfig?: MutationConfig<typeof deleteJob>;
};

export const useDeleteJob = ({ mutationConfig }: UseDeleteJobOptions = {}) => {
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
    mutationFn: deleteJob,
  });
};
