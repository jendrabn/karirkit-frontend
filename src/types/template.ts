import type { ListResponse } from "./api";

export type ParagraphType = "opening" | "body" | "closing";
export type CVParagraphType =
  | "about"
  | "experience"
  | "organization"
  | "project";
export type TemplateType = "cv" | "application_letter";
export type Language = "en" | "id";

export interface ParagraphTemplate {
  id: string;
  title: string;
  content: string;
  language?: Language;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: TemplateType;
  language: Language;
  path: string;
  preview: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export type TemplateListResponse = ListResponse<DocumentTemplate>;

export type ParagraphTemplates = Record<ParagraphType, ParagraphTemplate[]>;
export type ParagraphTypeLabels = Record<ParagraphType, string>;
export type CVParagraphTemplates = Record<CVParagraphType, ParagraphTemplate[]>;
export type CVParagraphTypeLabels = Record<CVParagraphType, string>;

export const TEMPLATE_TYPE_OPTIONS = [
  { label: "CV", value: "cv" },
  { label: "Surat Lamaran", value: "application_letter" },
] as const;

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Indonesia", value: "id" },
] as const;

export const getTemplateTypeLabel = (type: string) => {
  return TEMPLATE_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type;
};
