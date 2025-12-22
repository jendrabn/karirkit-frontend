import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const deleteCV = (id: string): Promise<void> => {
  return api.delete(`/cvs/${id}`);
};

type UseDeleteCVOptions = {
  mutationConfig?: MutationConfig<typeof deleteCV>;
};

export const useDeleteCV = ({ mutationConfig }: UseDeleteCVOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteCV,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
