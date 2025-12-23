import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const massDeleteTemplates = ({ ids }: { ids: string[] }) => {
  return api.delete(`/admin/templates/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteTemplatesOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteTemplates>;
};

export const useMassDeleteTemplates = ({
  mutationConfig,
}: UseMassDeleteTemplatesOptions = {}) => {
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
    mutationFn: massDeleteTemplates,
  });
};
