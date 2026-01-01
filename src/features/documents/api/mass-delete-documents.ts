import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const massDeleteDocuments = ({ ids }: { ids: string[] }) => {
  return api.delete(`/documents/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteDocumentsOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteDocuments>;
};

export const useMassDeleteDocuments = ({
  mutationConfig,
}: UseMassDeleteDocumentsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: massDeleteDocuments,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
