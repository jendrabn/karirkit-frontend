import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type {
  TemplateListResponse,
  TemplateType,
  Language,
} from "@/types/template";

export interface GetTemplatesParams {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?:
    | "created_at"
    | "updated_at"
    | "name"
    | "type"
    | "language"
    | "is_premium";
  type?: TemplateType;
  language?: Language;
  is_premium?: boolean;
}

export const getTemplates = (
  params?: GetTemplatesParams
): Promise<TemplateListResponse> => {
  return api.get("/admin/templates", {
    params,
  });
};

export const getTemplatesQueryOptions = (params?: GetTemplatesParams) => {
  return queryOptions({
    queryKey: ["templates", params],
    queryFn: () => getTemplates(params),
  });
};

type UseTemplatesOptions = {
  params?: GetTemplatesParams;
  queryConfig?: QueryConfig<typeof getTemplatesQueryOptions>;
};

export const useTemplates = ({
  params,
  queryConfig,
}: UseTemplatesOptions = {}) => {
  return useQuery({
    ...getTemplatesQueryOptions(params),
    ...queryConfig,
  });
};
