import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CreateApplicationLetterInput } from "./create-application-letter";
import type { ApplicationLetter } from "./get-application-letters";

export type ApplicationLetterAiImprovementData = Omit<
  CreateApplicationLetterInput,
  "signature" | "template_id"
>;

export type ImproveApplicationLetterWithAIInput = {
  data: ApplicationLetterAiImprovementData;
  target_position?: string;
  job_description?: string;
};

export type ImproveApplicationLetterWithAIResponse =
  ApplicationLetterAiImprovementData;

export const toApplicationLetterAiImprovementData = (
  letter: CreateApplicationLetterInput | ApplicationLetter,
): ApplicationLetterAiImprovementData => ({
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

export const improveApplicationLetterWithAI = (
  data: ImproveApplicationLetterWithAIInput,
): Promise<ImproveApplicationLetterWithAIResponse> => {
  return api.post("/application-letters/ai-improve", data);
};

type UseImproveApplicationLetterWithAIOptions = {
  mutationConfig?: MutationConfig<typeof improveApplicationLetterWithAI>;
};

export const useImproveApplicationLetterWithAI = ({
  mutationConfig,
}: UseImproveApplicationLetterWithAIOptions = {}) => {
  return useMutation({
    mutationFn: improveApplicationLetterWithAI,
    ...mutationConfig,
  });
};
