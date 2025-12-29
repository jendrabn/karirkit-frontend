import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { Company } from "@/types/company";
import { getCompaniesQueryOptions } from "./get-companies";
import { getCompanyQueryOptions } from "./get-company";
import { createCompanyInputSchema } from "./create-company";

export const updateCompanyInputSchema = createCompanyInputSchema.partial();

export type UpdateCompanyInput = z.infer<typeof updateCompanyInputSchema>;

export const updateCompany = ({
  data,
  id,
}: {
  data: UpdateCompanyInput;
  id: string;
}): Promise<Company> => {
  return api.put(`/admin/companies/${id}`, data);
};

type UseUpdateCompanyOptions = {
  mutationConfig?: MutationConfig<typeof updateCompany>;
};

export const useUpdateCompany = ({
  mutationConfig,
}: UseUpdateCompanyOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getCompaniesQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getCompanyQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateCompany,
  });
};
