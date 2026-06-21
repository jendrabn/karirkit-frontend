import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { User } from "@/types/user";
export type { User };
import type { ListResponse } from "@/types/api";

export type GetUsersParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?:
    | "created_at"
    | "updated_at"
    | "name"
    | "email"
    | "role"
    | "status"
    | "max_cvs"
    | "max_application_letters"
    | "max_applications"
    | "max_document_storage_bytes"
    | "max_cv_pdf_downloads"
    | "max_cv_docx_downloads"
    | "max_letter_pdf_downloads"
    | "max_letter_docx_downloads"
    | "max_cv_ai_improvements"
    | "max_application_letter_ai_improvements";
  role?: string;
  status?: string;
  gender?: string;
  email_verified?: string;
  suspended?: string;
  created_at_from?: string;
  created_at_to?: string;
  max_cvs_from?: number;
  max_cvs_to?: number;
  max_application_letters_from?: number;
  max_application_letters_to?: number;
  max_applications_from?: number;
  max_applications_to?: number;
  max_document_storage_bytes_from?: number;
  max_document_storage_bytes_to?: number;
  max_cv_pdf_downloads_from?: number;
  max_cv_pdf_downloads_to?: number;
  max_cv_docx_downloads_from?: number;
  max_cv_docx_downloads_to?: number;
  max_letter_pdf_downloads_from?: number;
  max_letter_pdf_downloads_to?: number;
  max_letter_docx_downloads_from?: number;
  max_letter_docx_downloads_to?: number;
  max_cv_ai_improvements_from?: number;
  max_cv_ai_improvements_to?: number;
  max_application_letter_ai_improvements_from?: number;
  max_application_letter_ai_improvements_to?: number;
};

export const getUsers = (
  params?: GetUsersParams
): Promise<ListResponse<User>> => {
  return api.get("/admin/users", {
    params,
  });
};

export const getUsersQueryOptions = (params?: GetUsersParams) => {
  return queryOptions({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
};

type UseUsersOptions = {
  params?: GetUsersParams;
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ params, queryConfig }: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(params),
    ...queryConfig,
  });
};
