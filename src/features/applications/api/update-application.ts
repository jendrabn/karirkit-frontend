import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Application } from "@/types/application";
import type { CreateApplicationInput } from "./create-application";

export type UpdateApplicationInput = CreateApplicationInput;

export const updateApplication = ({
  data,
  id,
}: {
  data: UpdateApplicationInput;
  id: string;
}): Promise<Application> => {
  return api.put(`/applications/${id}`, data);
};

type UseUpdateApplicationOptions = {
  mutationConfig?: MutationConfig<typeof updateApplication>;
};

export const useUpdateApplication = ({
  mutationConfig,
}: UseUpdateApplicationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: ["applications", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateApplication,
  });
};
