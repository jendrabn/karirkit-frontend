import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const massDeleteCompanies = (
  ids: string[]
): Promise<MessageResponse> => {
  return api.delete("/admin/companies/mass-delete", {
    data: { ids },
  });
};

type UseMassDeleteCompaniesOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteCompanies>;
};

export const useMassDeleteCompanies = ({
  mutationConfig,
}: UseMassDeleteCompaniesOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteCompanies,
  });
};
