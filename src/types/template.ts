export type ParagraphType = "opening" | "body" | "closing";
export type TemplateType = "cv" | "application_letter";

export interface ParagraphTemplate {
  id: string;
  title: string;
  content: string;
  language?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  previewImage: string;
}

export type ParagraphTemplates = Record<ParagraphType, ParagraphTemplate[]>;
export type ParagraphTypeLabels = Record<ParagraphType, string>;

export const TEMPLATE_TYPE_OPTIONS = [
  { label: "CV", value: "cv" },
  { label: "Surat Lamaran", value: "application_letter" },
] as const;

export const getTemplateTypeLabel = (type: string) => {
  return TEMPLATE_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type;
};
