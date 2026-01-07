import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const massDeleteJobs = (ids: string[]): Promise<MessageResponse> => {
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
        queryKey: ["jobs"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteJobs,
  });
};
