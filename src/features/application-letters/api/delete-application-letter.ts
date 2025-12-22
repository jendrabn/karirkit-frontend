import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const deleteApplicationLetter = (id: string): Promise<void> => {
  return api.delete(`/application-letters/${id}`);
};

type UseDeleteApplicationLetterOptions = {
  mutationConfig?: MutationConfig<typeof deleteApplicationLetter>;
};

export const useDeleteApplicationLetter = ({
  mutationConfig,
}: UseDeleteApplicationLetterOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["application-letters"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteApplicationLetter,
  });
};
