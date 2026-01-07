import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";

export type TemplateType = "cv" | "application_letter";
export type TemplateLanguage = "en" | "id";

export type Template = {
  id: string;
  name: string;
  slug: string;
  type: TemplateType;
  language: TemplateLanguage;
  path: string;
  preview: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

export type TemplatesResponse = {
  items: Template[];
};

export type GetTemplatesParams = {
  type?: TemplateType;
  language?: TemplateLanguage;
};

export const getTemplates = (
  params?: GetTemplatesParams
): Promise<TemplatesResponse> => {
  return api.get("/templates", {
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
