import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getCompaniesQueryOptions } from "./get-companies";

export interface MassDeleteCompaniesResponse {
  message: string;
  deleted_count: number;
}

export const massDeleteCompanies = (
  ids: string[]
): Promise<MassDeleteCompaniesResponse> => {
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
        queryKey: getCompaniesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteCompanies,
  });
};
