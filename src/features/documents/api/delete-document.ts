import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const deleteDocument = (id: string): Promise<void> => {
  return api.delete(`/documents/${id}`);
};

type UseDeleteDocumentOptions = {
  mutationConfig?: MutationConfig<typeof deleteDocument>;
};

export const useDeleteDocument = ({
  mutationConfig,
}: UseDeleteDocumentOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
