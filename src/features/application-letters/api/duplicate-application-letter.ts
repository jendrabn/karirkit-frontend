import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { ApplicationLetter } from "./get-application-letters";

export type DuplicateApplicationLetterResponse = ApplicationLetter;

export const duplicateApplicationLetter = (
  id: string
): Promise<DuplicateApplicationLetterResponse> => {
  return api.post(`/application-letters/${id}/duplicate`);
};

type UseDuplicateApplicationLetterOptions = {
  mutationConfig?: MutationConfig<typeof duplicateApplicationLetter>;
};

export const useDuplicateApplicationLetter = ({
  mutationConfig,
}: UseDuplicateApplicationLetterOptions = {}) => {
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
    mutationFn: duplicateApplicationLetter,
  });
};
