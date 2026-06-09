import { type ColumnVisibility } from "../components/company-column-toggle";

export const defaultColumnVisibility: ColumnVisibility = {
  name: true,
  slug: true,
  sector: true,
  size: true,
  jobCount: true,
  website_url: false,
  description: false,
  created_at: true,
  updated_at: false,
};

