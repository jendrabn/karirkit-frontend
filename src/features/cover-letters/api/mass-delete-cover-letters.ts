import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const massDeleteCoverLetters = ({ ids }: { ids: string[] }) => {
  return api.delete(`/cover-letters/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteCoverLettersOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteCoverLetters>;
};

export const useMassDeleteCoverLetters = ({
  mutationConfig,
}: UseMassDeleteCoverLettersOptions = {}) => {
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
    mutationFn: massDeleteCoverLetters,
  });
};
