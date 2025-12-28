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
  description: string;
  logo: string;
  employee_size: EmployeeSize;
  business_sector: string;
  website_url: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyPagination {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface CompaniesResponse {
  data: {
    items: Company[];
    pagination: CompanyPagination;
  };
}

export const EMPLOYEE_SIZE_LABELS: Record<EmployeeSize, string> = {
  one_to_ten: "1-10 karyawan",
  eleven_to_fifty: "11-50 karyawan",
  fifty_one_to_two_hundred: "51-200 karyawan",
  two_hundred_one_to_five_hundred: "201-500 karyawan",
  five_hundred_plus: "500+ karyawan",
};
