import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CoverLetter } from "./get-cover-letters";

export type UpdateCoverLetterInput = {
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
  template_id?: string;
  language?: "en" | "id";
};

export type UpdateCoverLetterResponse = CoverLetter;

export const updateCoverLetter = ({
  id,
  data,
}: {
  id: string;
  data: UpdateCoverLetterInput;
}): Promise<UpdateCoverLetterResponse> => {
  return api.put(`/cover-letters/${id}`, data);
};

type UseUpdateCoverLetterOptions = {
  mutationConfig?: MutationConfig<typeof updateCoverLetter>;
};

export const useUpdateCoverLetter = ({
  mutationConfig,
}: UseUpdateCoverLetterOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["cover-letters"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cover-letter", args[0].id],
      });
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: updateCoverLetter,
  });
};
