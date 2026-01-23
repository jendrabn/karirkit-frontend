import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Gender, MaritalStatus } from "@/types/applicationLetter";

export type ApplicationLettersResponse = {
  items: ApplicationLetter[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
};

export type ApplicationLetter = {
  id: string;
  user_id: string;
  name: string;
  birth_place_date: string;
  gender: Gender;
  marital_status: MaritalStatus;
  education: string;
  phone: string;
  email: string;
  address: string;
  subject: string;
  applicant_city: string;
  application_date: string;
  receiver_title: string;
  company_name: string;
  company_city: string;
  company_address: string;
  opening_paragraph: string;
  body_paragraph: string;
  attachments: string;
  closing_paragraph: string;
  signature: string;
  language?: "en" | "id";
  template_id?: string;
  template?: {
    id: string;
    name: string;
    path: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
};

export type GetApplicationLettersParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?:
    | "created_at"
    | "updated_at"
    | "application_date"
    | "company_name"
    | "name";
  gender?: "male" | "female";
  marital_status?: "single" | "married" | "widowed";
  language?: "en" | "id";
  company_name?: string;
  company_city?: string;
  applicant_city?: string;
  template_id?: string;
  application_date_from?: string;
  application_date_to?: string;
  created_at_from?: string;
  created_at_to?: string;
};

export const getApplicationLetters = (
  params?: GetApplicationLettersParams
): Promise<ApplicationLettersResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/application-letters", {
    params: filteredParams,
  });
};

export const getApplicationLettersQueryOptions = (
  params?: GetApplicationLettersParams
) => {
  return queryOptions({
    queryKey: ["application-letters", params],
    queryFn: () => getApplicationLetters(params),
  });
};

type UseApplicationLettersOptions = {
  params?: GetApplicationLettersParams;
  queryConfig?: QueryConfig<typeof getApplicationLettersQueryOptions>;
};

export const useApplicationLetters = ({
  params,
  queryConfig,
}: UseApplicationLettersOptions = {}) => {
  return useQuery({
    ...getApplicationLettersQueryOptions(params),
    ...queryConfig,
  });
};
