export type Gender = "male" | "female";
export type MaritalStatus = "single" | "married" | "widowed";
export type Language = "en" | "id";

import type { ListResponse } from "./api";

export interface ApplicationLetter {
  id: string;
  user_id: string;
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
  company_city: string | null;
  company_address: string | null;
  opening_paragraph: string;
  body_paragraph: string;
  attachments: string;
  closing_paragraph: string;
  signature: string | null;
  language: Language;
  template_id: string;
  template?: {
    id: string;
    name: string;
    path: string;
    type: "cv" | "application_letter";
  };
  created_at: string;
  updated_at: string;
}

export type ApplicationLetterResponse = ApplicationLetter;
export type ApplicationLetterListResponse = ListResponse<ApplicationLetter>;

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
];

export const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] =
  [
    { value: "single", label: "Belum Menikah" },
    { value: "married", label: "Menikah" },
    { value: "widowed", label: "Janda/Duda" },
  ];

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
];
