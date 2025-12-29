import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { Company } from "@/types/company";

export const getCompany = (id: string): Promise<Company> => {
  return api.get(`/admin/companies/${id}`);
};

export const getCompanyQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["company", id],
    queryFn: () => getCompany(id),
  });
};

type UseCompanyOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getCompanyQueryOptions>;
};

export const useCompany = ({ id, queryConfig }: UseCompanyOptions) => {
  return useQuery({
    ...getCompanyQueryOptions(id),
    ...queryConfig,
  });
};
