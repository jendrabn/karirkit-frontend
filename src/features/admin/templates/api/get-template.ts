import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Template } from "./get-templates";

export const getTemplate = ({ id }: { id: string }): Promise<Template> => {
  return api.get(`/admin/templates/${id}`);
};

export const getTemplateQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["templates", id],
    queryFn: () => getTemplate({ id }),
  });
};

type UseTemplateOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTemplateQueryOptions>;
};

export const useTemplate = ({ id, queryConfig }: UseTemplateOptions) => {
  return useQuery({
    ...getTemplateQueryOptions(id),
    ...queryConfig,
  });
};
