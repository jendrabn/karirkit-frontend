import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CV } from "./get-cvs";

export type DuplicateCVResponse = CV;

export const duplicateCV = (id: string): Promise<DuplicateCVResponse> => {
  return api.post(`/cvs/${id}/duplicate`);
};

type UseDuplicateCVOptions = {
  mutationConfig?: MutationConfig<typeof duplicateCV>;
};

export const useDuplicateCV = ({
  mutationConfig,
}: UseDuplicateCVOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: duplicateCV,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
