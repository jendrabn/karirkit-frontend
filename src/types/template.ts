export type TemplateType = 'cv' | 'application_letter';

export interface Template {
  id: number;
  type: TemplateType;
  name: string;
  slug: string;
  description?: string | null;
  file?: string | null;
  preview_image?: string | null;
  is_premium: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const TEMPLATE_TYPE_OPTIONS: { value: TemplateType; label: string }[] = [
  { value: 'cv', label: 'CV' },
  { value: 'application_letter', label: 'Surat Lamaran' },
];

export const getTemplateTypeLabel = (type: TemplateType): string => {
  const option = TEMPLATE_TYPE_OPTIONS.find(opt => opt.value === type);
  return option?.label || type;
};
