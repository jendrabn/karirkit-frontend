import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { Company } from "@/types/company";
import { getCompaniesQueryOptions } from "./get-companies";

export const createCompanyInputSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  logo: z.string().optional(),
  employee_size: z.enum([
    "one_to_ten",
    "eleven_to_fifty",
    "fifty_one_to_two_hundred",
    "two_hundred_one_to_five_hundred",
    "five_hundred_plus",
  ] as const),
  business_sector: z.string().min(1, "Sektor bisnis wajib diisi"),
  website_url: z
    .string()
    .url("Domain URL tidak valid")
    .or(z.literal(""))
    .optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanyInputSchema>;

export const createCompany = (data: CreateCompanyInput): Promise<Company> => {
  return api.post("/admin/companies", data);
};

type UseCreateCompanyOptions = {
  mutationConfig?: MutationConfig<typeof createCompany>;
};

export const useCreateCompany = ({
  mutationConfig,
}: UseCreateCompanyOptions = {}) => {
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
    mutationFn: createCompany,
  });
};
