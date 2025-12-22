import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { setFormErrors } from "@/hooks/use-form-errors";
import type { MutationConfig } from "@/lib/react-query";
import type { CV, Education, Certificate, Experience, Skill, Award, SocialLink, Organization } from "./get-cvs";

export type CreateCVInput = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  address: string;
  about?: string;
  photo?: string;
  template_id?: string;
  educations?: Education[];
  certificates?: Certificate[];
  experiences?: Experience[];
  skills?: Skill[];
  awards?: Award[];
  social_links?: SocialLink[];
  organizations?: Organization[];
};

export type CreateCVResponse = CV;

export const createCV = (data: CreateCVInput): Promise<CreateCVResponse> => {
  return api.post("/cvs", data);
};

type UseCreateCVOptions = {
  mutationConfig?: MutationConfig<typeof createCV>;
};

export const useCreateCV = ({ mutationConfig }: UseCreateCVOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createCV,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      onSuccess?.(...args);
    },
    onError: (error, ...args) => {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
      onError?.(error, ...args);
    },
    ...restConfig,
  });
};
