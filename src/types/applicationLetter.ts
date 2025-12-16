export type Gender = "male" | "female";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type Language = "en" | "id";

export interface ApplicationLetter {
  id: string;
  user_id: string;
  template_id?: string;
  name: string;
  birth_place_date: string;
  gender: Gender;
  marital_status: MaritalStatus;
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
  attachments: string;
  closing_paragraph: string;
  signature: string;
  language: Language;
  created_at: string;
  updated_at: string;
}

export interface ApplicationLettersResponse {
  items: ApplicationLetter[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
];

export const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: "single", label: "Belum Menikah" },
  { value: "married", label: "Menikah" },
  { value: "divorced", label: "Cerai" },
  { value: "widowed", label: "Janda/Duda" },
];

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
];
