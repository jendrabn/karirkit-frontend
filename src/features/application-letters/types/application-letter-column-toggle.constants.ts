import { type ColumnVisibility } from "../components/ApplicationLetterColumnToggle";

export const defaultColumnVisibility: ColumnVisibility = {
  subject: true,
  company_name: true,
  application_date: true,
  language: true,
  name: false,
  education: false,
  applicant_city: false,
  company_city: false,
  email: false,
  phone: false,
  marital_status: false,
  gender: false,
  template: false,
  created_at: true,
  updated_at: false,
};

