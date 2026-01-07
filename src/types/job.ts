import type { ListResponse } from "./api";

export type JobType =
  | "full_time"
  | "contract"
  | "internship"
  | "freelance"
  | "part_time";
export type WorkSystem = "onsite" | "hybrid" | "remote";
export type EducationLevel =
  | "middle_school"
  | "high_school"
  | "associate_d1"
  | "associate_d2"
  | "associate_d3"
  | "bachelor"
  | "master"
  | "doctorate"
  | "any";

export type EmployeeSize =
  | "one_to_ten"
  | "eleven_to_fifty"
  | "fifty_one_to_two_hundred"
  | "two_hundred_one_to_five_hundred"
  | "five_hundred_plus";

export type JobStatus = "draft" | "published" | "closed" | "archived";

export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  province_id: string;
  name: string;
  province?: Province;
  job_count?: number;
}

export interface JobRole {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  employee_size: EmployeeSize;
  business_sector: string | null;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobMedia {
  id: string;
  job_id: string;
  path: string;
}

export interface Job {
  id: string;
  company_id: string;
  job_role_id: string;
  city_id: string | null;
  title: string;
  slug: string;
  job_type: JobType;
  work_system: WorkSystem;
  education_level: EducationLevel;
  min_years_of_experience: number;
  max_years_of_experience: number | null;
  description: string;
  requirements: string;
  salary_min: number | null;
  salary_max: number | null;
  talent_quota: number | null;
  job_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  medias: JobMedia[];
  status: JobStatus;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
  company: Company;
  job_role: JobRole;
  city: City | null;
}

export type JobResponse = Job;
export type JobListResponse = ListResponse<Job>;
export type JobPagination = ListResponse<Job>["pagination"];

export interface JobFilters {
  q?: string;
  page?: number;
  per_page?: number;
  job_type?: JobType[];
  work_system?: WorkSystem[];
  education_level?: EducationLevel[];
  min_years_of_experience?: number;
  max_years_of_experience?: number;
  experience_min?: number;
  city_id?: string[];
  job_role_id?: string[];
  company_id?: string[];
  salary_min?: number;
  salary_max?: number;
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Kontrak",
  internship: "Magang",
  freelance: "Freelance",
};

export const WORK_SYSTEM_LABELS: Record<WorkSystem, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

export const EDUCATION_LEVEL_LABELS: Record<EducationLevel, string> = {
  middle_school: "SMP",
  high_school: "SMA/SMK",
  associate_d1: "D1",
  associate_d2: "D2",
  associate_d3: "D3",
  bachelor: "S1",
  master: "S2",
  doctorate: "S3",
  any: "Semua Jenjang",
};

export const EMPLOYEE_SIZE_LABELS: Record<EmployeeSize, string> = {
  one_to_ten: "1-10 karyawan",
  eleven_to_fifty: "11-50 karyawan",
  fifty_one_to_two_hundred: "51-200 karyawan",
  two_hundred_one_to_five_hundred: "201-500 karyawan",
  five_hundred_plus: "500+ karyawan",
};
