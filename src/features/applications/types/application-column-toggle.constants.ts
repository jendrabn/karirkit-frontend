import { type ColumnVisibility } from "../components/ApplicationColumnToggle";

export const defaultColumnVisibility: ColumnVisibility = {
  company_name: true,
  position: true,
  status: true,
  result_status: true,
  date: true,
  job_source: true,
  location: true,
  follow_up_date: false,
  job_type: false,
  work_system: false,
  salary_range: false,
  contact_name: false,
  contact_email: false,
  contact_phone: false,
  created_at: true,
  updated_at: false,
};

