import { type ColumnVisibility } from "../components/templates-column-toggle";

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

