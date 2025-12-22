import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { setFormErrors } from "@/hooks/use-form-errors";
import type { ApplicationLetter } from "./get-application-letters";

export type CreateApplicationLetterInput = {
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
