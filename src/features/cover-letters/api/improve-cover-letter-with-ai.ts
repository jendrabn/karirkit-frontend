import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CreateCoverLetterInput } from "./create-cover-letter";
import type { CoverLetter } from "./get-cover-letters";

export type CoverLetterAiImprovementData = Omit<
  CreateCoverLetterInput,
  "signature" | "template_id"
>;

export type ImproveCoverLetterWithAIInput = {
  data: CoverLetterAiImprovementData;
  target_position?: string;
  job_description?: string;
};

export type ImproveCoverLetterWithAIResponse =
  CoverLetterAiImprovementData;

export const toCoverLetterAiImprovementData = (
  letter: CreateCoverLetterInput | CoverLetter,
): CoverLetterAiImprovementData => ({
  name: letter.name,
  birth_place_date: letter.birth_place_date,
  gender: letter.gender,
  marital_status: letter.marital_status,
  education: letter.education,
  phone: letter.phone,
  email: letter.email,
  address: letter.address,
  subject: letter.subject,
  applicant_city: letter.applicant_city,
  application_date: letter.application_date,
  receiver_title: letter.receiver_title,
  company_name: letter.company_name,
  company_city: letter.company_city,
  company_address: letter.company_address,
  opening_paragraph: letter.opening_paragraph,
  body_paragraph: letter.body_paragraph,
  attachments: letter.attachments,
  closing_paragraph: letter.closing_paragraph,
  language: letter.language ?? "id",
});

export const improveCoverLetterWithAI = (
  data: ImproveCoverLetterWithAIInput,
): Promise<ImproveCoverLetterWithAIResponse> => {
  return api.post("/cover-letters/ai-improve", data);
};

type UseImproveCoverLetterWithAIOptions = {
  mutationConfig?: MutationConfig<typeof improveCoverLetterWithAI>;
};

export const useImproveCoverLetterWithAI = ({
  mutationConfig,
}: UseImproveCoverLetterWithAIOptions = {}) => {
  return useMutation({
    mutationFn: improveCoverLetterWithAI,
    ...mutationConfig,
  });
};
