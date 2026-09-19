import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CoverLetter } from "./get-cover-letters";

export type DuplicateCoverLetterResponse = CoverLetter;

export const duplicateCoverLetter = (
  id: string
): Promise<DuplicateCoverLetterResponse> => {
  return api.post(`/cover-letters/${id}/duplicate`);
};

type UseDuplicateCoverLetterOptions = {
  mutationConfig?: MutationConfig<typeof duplicateCoverLetter>;
};

export const useDuplicateCoverLetter = ({
  mutationConfig,
}: UseDuplicateCoverLetterOptions = {}) => {
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
    mutationFn: duplicateCoverLetter,
  });
};
