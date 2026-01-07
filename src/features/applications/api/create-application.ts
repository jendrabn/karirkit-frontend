import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Application } from "@/types/application";

export const createApplicationInputSchema = z.object({
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_url: z.string().optional().nullable(),
  position: z.string().min(1, "Posisi wajib diisi"),
  job_source: z.string().optional().nullable(),
  job_type: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
    "freelance",
  ]),
  work_system: z.enum(["onsite", "hybrid", "remote"]),
  salary_min: z.number().min(0).optional().nullable(),
  salary_max: z.number().min(0).optional().nullable(),
  location: z.string().optional().nullable(),
  date: z.string().min(1, "Tanggal wajib diisi"),
  status: z.enum([
    "draft",
    "submitted",
    "administration_screening",
    "hr_screening",
    "online_test",
    "psychological_test",
    "technical_test",
    "hr_interview",
    "user_interview",
    "final_interview",
    "offering",
    "mcu",
    "onboarding",
    "accepted",
    "rejected",
  ]),
  result_status: z.enum(["pending", "passed", "failed"]),
  contact_name: z.string().optional().nullable(),
  contact_email: z
    .string()
    .email("Email tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
  contact_phone: z.string().optional().nullable(),
  follow_up_date: z.string().optional().nullable(),
  follow_up_note: z.string().optional().nullable(),
  job_url: z
    .string()
    .url("URL tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
  notes: z.string().optional().nullable(),
});

export type CreateApplicationInput = z.infer<
  typeof createApplicationInputSchema
>;

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
