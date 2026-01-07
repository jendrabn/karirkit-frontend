import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const deleteJob = (id: string): Promise<MessageResponse> => {
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
        queryKey: ["jobs"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteJob,
  });
};
