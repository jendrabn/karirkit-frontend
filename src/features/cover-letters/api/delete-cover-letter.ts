import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const deleteCoverLetter = (id: string): Promise<void> => {
  return api.delete(`/cover-letters/${id}`);
};

type UseDeleteCoverLetterOptions = {
  mutationConfig?: MutationConfig<typeof deleteCoverLetter>;
};

export const useDeleteCoverLetter = ({
  mutationConfig,
}: UseDeleteCoverLetterOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["cover-letters"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCoverLetter,
  });
};
