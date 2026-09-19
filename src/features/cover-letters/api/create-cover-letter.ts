import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CoverLetter } from "./get-cover-letters";

export const coverLetterSchema = z.object({
  template_id: z.string().min(1, "Template wajib dipilih"),
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  birth_place_date: z.string().min(1, "Tempat, tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"], {
    message: "Jenis kelamin wajib dipilih",
  }),
  marital_status: z.enum(["single", "married", "widowed"], {
    message: "Status pernikahan wajib dipilih",
  }),
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
  language: z.enum(["en", "id"], {
    message: "Bahasa wajib dipilih",
  }),
});

export type CreateCoverLetterInput = z.infer<
  typeof coverLetterSchema
>;

export type CreateCoverLetterResponse = CoverLetter;

export const createCoverLetter = (
  data: CreateCoverLetterInput
): Promise<CreateCoverLetterResponse> => {
  return api.post("/cover-letters", data);
};

type UseCreateCoverLetterOptions = {
  mutationConfig?: MutationConfig<typeof createCoverLetter>;
};

export const useCreateCoverLetter = ({
  mutationConfig,
}: UseCreateCoverLetterOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["cover-letters"],
      });
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: createCoverLetter,
  });
};
