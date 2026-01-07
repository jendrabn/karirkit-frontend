import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { setFormErrors } from "@/hooks/use-form-errors";
import type { ApplicationLetter } from "./get-application-letters";

export const applicationLetterSchema = z.object({
  template_id: z.string().min(1, "Template wajib dipilih"),
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  birth_place_date: z.string().min(1, "Tempat, tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"]),
  marital_status: z.enum(["single", "married", "widowed"]),
  education: z.string().min(1, "Pendidikan wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Email tidak valid").min(1, "Email wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  subject: z.string().min(1, "Subjek wajib diisi"),
  applicant_city: z.string().min(1, "Kota pelamar wajib diisi"),
  application_date: z.string().min(1, "Tanggal lamaran wajib diisi"),
  receiver_title: z.string().min(1, "Jabatan penerima wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_city: z.string().min(1, "Kota perusahaan wajib diisi"),
  company_address: z.string().min(1, "Alamat perusahaan wajib diisi"),
  opening_paragraph: z.string().min(1, "Paragraf pembuka wajib diisi"),
  body_paragraph: z.string().min(1, "Paragraf isi wajib diisi"),
  attachments: z.string().optional(),
  closing_paragraph: z.string().min(1, "Paragraf penutup wajib diisi"),
  signature: z.string().optional(),
  language: z.enum(["en", "id"]),
});

export type ApplicationLetterFormData = z.infer<typeof applicationLetterSchema>;

export type CreateApplicationLetterInput = {
  name: string;
  birth_place_date: string;
  gender: "male" | "female";
  marital_status: "single" | "married" | "widowed";
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
  attachments?: string;
  closing_paragraph: string;
  signature?: string;
  template_id: string;
};

export type CreateApplicationLetterResponse = ApplicationLetter;

export const createApplicationLetter = (
  data: CreateApplicationLetterInput
): Promise<CreateApplicationLetterResponse> => {
  return api.post("/application-letters", data);
};

type UseCreateApplicationLetterOptions = {
  mutationConfig?: MutationConfig<typeof createApplicationLetter>;
};

export const useCreateApplicationLetter = ({
  mutationConfig,
}: UseCreateApplicationLetterOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["application-letters"],
      });
      onSuccess?.(data, ...args);
    },
    onError: (error: any, ...args) => {
      if (error?.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: createApplicationLetter,
  });
};
