import type { ListResponse } from "./api";

export type EmployeeSize =
  | "one_to_ten"
  | "eleven_to_fifty"
  | "fifty_one_to_two_hundred"
  | "two_hundred_one_to_five_hundred"
  | "five_hundred_plus";

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  employee_size: EmployeeSize | null;
  business_sector: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
  job_count?: number;
}

export type CompanyListResponse = ListResponse<Company>;

export const EMPLOYEE_SIZE_LABELS: Record<EmployeeSize, string> = {
  one_to_ten: "1-10 karyawan",
  eleven_to_fifty: "11-50 karyawan",
  fifty_one_to_two_hundred: "51-200 karyawan",
  two_hundred_one_to_five_hundred: "201-500 karyawan",
  five_hundred_plus: "500+ karyawan",
};

export const EMPLOYEE_SIZE_OPTIONS = Object.entries(EMPLOYEE_SIZE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
