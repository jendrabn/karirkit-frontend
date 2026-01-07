import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const deleteCompany = (id: string): Promise<MessageResponse> => {
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
        queryKey: ["companies"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCompany,
  });
};
