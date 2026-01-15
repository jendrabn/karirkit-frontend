import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { ApplicationLetter } from "./get-application-letters";

export type UpdateApplicationLetterInput = {
  name: string;
  birth_place_date: string;
  gender: "male" | "female";
  marital_status: "single" | "married" | "divorced" | "widowed";
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
};

export type UpdateApplicationLetterResponse = ApplicationLetter;

export const updateApplicationLetter = ({
  id,
  data,
}: {
  id: string;
  data: UpdateApplicationLetterInput;
}): Promise<UpdateApplicationLetterResponse> => {
  return api.put(`/application-letters/${id}`, data);
};

type UseUpdateApplicationLetterOptions = {
  mutationConfig?: MutationConfig<typeof updateApplicationLetter>;
};

export const useUpdateApplicationLetter = ({
  mutationConfig,
}: UseUpdateApplicationLetterOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["application-letters"],
      });
      queryClient.invalidateQueries({
        queryKey: ["application-letter", args[0].id],
      });
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: updateApplicationLetter,
  });
};
