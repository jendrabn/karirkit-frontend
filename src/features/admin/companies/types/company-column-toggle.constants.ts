import { type ColumnVisibility } from "../components/CompanyColumnToggle";

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

