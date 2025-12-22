import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CV, Education, Certificate, Experience, Skill, Award, SocialLink, Organization } from "./get-cvs";

export type UpdateCVInput = {
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

export type UpdateCVResponse = CV;

export const updateCV = ({
  id,
  data,
}: {
  id: string;
  data: UpdateCVInput;
}): Promise<UpdateCVResponse> => {
  return api.put(`/cvs/${id}`, data);
};

type UseUpdateCVOptions = {
  mutationConfig?: MutationConfig<typeof updateCV>;
};

export const useUpdateCV = ({ mutationConfig }: UseUpdateCVOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateCV,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      queryClient.invalidateQueries({ queryKey: ["cv", args[1].id] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
