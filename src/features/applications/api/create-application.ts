import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { Application } from "@/types/application";

export const createApplicationInputSchema = z.object({
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_url: z.string().optional(),
  position: z.string().min(1, "Posisi wajib diisi"),
  job_source: z.string().optional(),
  job_type: z.enum(["full_time", "part_time", "contract", "internship", "freelance"]).optional(),
  work_system: z.enum(["onsite", "remote", "hybrid"]).optional(),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  location: z.string().optional(),
  date: z.string().min(1, "Tanggal lamaran wajib diisi"),
  status: z.string().optional(), // Can be more specific enum if needed
  result_status: z.enum(["pending", "passed", "failed"]).optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  follow_up_date: z.string().optional().nullable(),
  follow_up_note: z.string().optional(),
  job_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;

export const createApplication = ({
  data,
}: {
  data: CreateApplicationInput;
}): Promise<Application> => {
  return api.post("/applications", data);
};

type UseCreateApplicationOptions = {
  mutationConfig?: MutationConfig<typeof createApplication>;
};

export const useCreateApplication = ({
  mutationConfig,
}: UseCreateApplicationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createApplication,
  });
};
