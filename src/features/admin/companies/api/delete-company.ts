import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getCompaniesQueryOptions } from "./get-companies";

export const deleteCompany = (id: string): Promise<null> => {
  return api.delete(`/admin/companies/${id}`);
};

type UseDeleteCompanyOptions = {
  mutationConfig?: MutationConfig<typeof deleteCompany>;
};

export const useDeleteCompany = ({
  mutationConfig,
}: UseDeleteCompanyOptions = {}) => {
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
    mutationFn: deleteCompany,
  });
};
