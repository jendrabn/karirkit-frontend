import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const deleteApplication = ({
  id,
}: {
  id: string;
}): Promise<MessageResponse> => {
  return api.delete(`/applications/${id}`);
};

type UseDeleteApplicationOptions = {
  mutationConfig?: MutationConfig<typeof deleteApplication>;
};

export const useDeleteApplication = ({
  mutationConfig,
}: UseDeleteApplicationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteApplication,
  });
};
