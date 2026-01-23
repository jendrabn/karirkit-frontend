import { type ColumnVisibility } from "../components/TemplatesColumnToggle";

export const defaultColumnVisibility: ColumnVisibility = {
  preview: true,
  type: true,
  name: true,
  language: true,
  is_premium: true,
  path: false,
  created_at: true,
  updated_at: false,
};

