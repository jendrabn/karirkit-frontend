import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const massDeleteApplicationLetters = (ids: string[]): Promise<void> => {
  return api.post("/application-letters/mass-delete", { ids });
};

type UseMassDeleteApplicationLettersOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteApplicationLetters>;
};

export const useMassDeleteApplicationLetters = ({
  mutationConfig,
}: UseMassDeleteApplicationLettersOptions = {}) => {
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
    mutationFn: massDeleteApplicationLetters,
  });
};
