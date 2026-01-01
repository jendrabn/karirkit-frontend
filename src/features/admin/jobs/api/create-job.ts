import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { Job } from "@/types/job";
import { getJobsQueryOptions } from "./get-jobs";

export const createJobInputSchema = z.object({
  company_id: z.string().min(1, "Perusahaan wajib dipilih"),
  job_role_id: z.string().min(1, "Role pekerjaan wajib dipilih"),
  city_id: z.string().min(1, "Kota wajib dipilih"),
  title: z.string().min(1, "Judul wajib diisi"),
  job_type: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
    "freelance",
  ]),
  work_system: z.enum(["onsite", "hybrid", "remote"]),
  education_level: z.enum([
    "middle_school",
    "high_school",
    "associate_d1",
    "associate_d2",
    "associate_d3",
    "bachelor",
    "master",
    "doctorate",
    "any",
  ]),
  min_years_of_experience: z.number().min(0),
  max_years_of_experience: z.number().min(0).nullable().optional(),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  requirements: z.string().min(1, "Persyaratan wajib diisi"),
  salary_min: z.number().min(0),
  salary_max: z.number().min(0),
  talent_quota: z.number().min(1),
  job_url: z.string().url().or(z.literal("")).optional(),
  contact_name: z.string().min(1, "Nama kontak wajib diisi"),
  contact_email: z.string().email("Email kontak tidak valid"),
  contact_phone: z.string().min(1, "Telepon kontak wajib diisi"),
  medias: z
    .array(
      z.object({
        path: z.string().min(1),
      })
    )
    .optional(),
  status: z.enum(["draft", "published", "closed", "archived"]),
  expiration_date: z.string().optional().nullable(),
});

export type CreateJobInput = z.infer<typeof createJobInputSchema>;

export const createJob = (data: CreateJobInput): Promise<Job> => {
  return api.post("/admin/jobs", data);
};

type UseCreateJobOptions = {
  mutationConfig?: MutationConfig<typeof createJob>;
};

export const useCreateJob = ({ mutationConfig }: UseCreateJobOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getJobsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createJob,
  });
};
