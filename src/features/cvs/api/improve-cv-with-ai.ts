import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CreateCVInput } from "./create-cv";
import type { CV } from "./get-cvs";

export type CvAiImprovementData = Omit<
  CreateCVInput,
  "photo" | "template_id"
>;

export type ImproveCVWithAIInput = {
  data: CvAiImprovementData;
  target_position?: string;
  job_description?: string;
};

export type ImproveCVWithAIResponse = CvAiImprovementData;

export const toCvAiImprovementData = (
  cv: CreateCVInput | CV,
): CvAiImprovementData => ({
  name: cv.name,
  headline: cv.headline,
  email: cv.email,
  phone: cv.phone,
  address: cv.address,
  about: cv.about,
  educations: cv.educations,
  certificates: cv.certificates,
  experiences: cv.experiences,
  skills: cv.skills,
  awards: cv.awards,
  social_links: cv.social_links,
  organizations: cv.organizations,
  projects: cv.projects,
  language: cv.language ?? "id",
});

export const improveCVWithAI = (
  data: ImproveCVWithAIInput,
): Promise<ImproveCVWithAIResponse> => {
  return api.post("/cvs/ai-improve", data);
};

type UseImproveCVWithAIOptions = {
  mutationConfig?: MutationConfig<typeof improveCVWithAI>;
};

export const useImproveCVWithAI = ({
  mutationConfig,
}: UseImproveCVWithAIOptions = {}) => {
  return useMutation({
    mutationFn: improveCVWithAI,
    ...mutationConfig,
  });
};
