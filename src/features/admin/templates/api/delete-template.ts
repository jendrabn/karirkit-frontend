import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const deleteTemplate = (id: string): Promise<MessageResponse> => {
  return api.delete(`/admin/templates/${id}`);
};

type UseDeleteTemplateOptions = {
  mutationConfig?: MutationConfig<typeof deleteTemplate>;
};

export const useDeleteTemplate = ({
  mutationConfig,
}: UseDeleteTemplateOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["templates"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteTemplate,
  });
};
