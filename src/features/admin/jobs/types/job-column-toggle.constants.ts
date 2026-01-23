import { type ColumnVisibility } from "../components/JobColumnToggle";

export const defaultColumnVisibility: ColumnVisibility = {
  title: true,
  company: true,
  role: true,
  city: true,
  type: true,
  workSystem: true,
  salary: true,
  status: true,
  expiration_date: false,
  education_level: false,
  experience: false,
  talent_quota: false,
  created_at: true,
  updated_at: false,
};

