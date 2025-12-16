export type DegreeType = "highschool" | "diploma" | "bachelor" | "master" | "doctorate";
export type JobType = "full_time" | "part_time" | "contract" | "internship" | "freelance";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type OrganizationType = "student" | "professional" | "community" | "volunteer";

export interface Education {
  degree: DegreeType;
  school_name: string;
  school_location: string;
  major: string;
  start_month: number;
  start_year: number;
  end_month: number;
  end_year: number;
  is_current: boolean;
  gpa: number;
  description: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  issue_month: number;
  issue_year: number;
  expiry_month: number;
  expiry_year: number;
  no_expiry: boolean;
  credential_id: string;
  credential_url: string;
  description: string;
}

export interface Experience {
  job_title: string;
  company_name: string;
  company_location: string;
  job_type: JobType;
  start_month: number;
  start_year: number;
  end_month: number;
  end_year: number;
  is_current: boolean;
  description: string;
}

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface Award {
  title: string;
  issuer: string;
  description: string;
  year: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Organization {
  organization_name: string;
  role_title: string;
  organization_type: OrganizationType;
  location: string;
  start_month: number;
  start_year: number;
  end_month: number;
  end_year: number;
  is_current: boolean;
  description: string;
}

export interface CV {
  id: string;
  user_id: string;
  template_id?: string;
  name: string;
  headline: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  photo: string;
  created_at: string;
  updated_at: string;
  educations: Education[];
  certificates: Certificate[];
  experiences: Experience[];
  skills: Skill[];
  awards: Award[];
  social_links: SocialLink[];
  organizations: Organization[];
}

export const DEGREE_OPTIONS = [
  { value: "highschool", label: "SMA/SMK" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Sarjana (S1)" },
  { value: "master", label: "Magister (S2)" },
  { value: "doctorate", label: "Doktor (S3)" },
];

export const JOB_TYPE_OPTIONS = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Kontrak" },
  { value: "internship", label: "Magang" },
  { value: "freelance", label: "Freelance" },
];

export const SKILL_LEVEL_OPTIONS = [
  { value: "beginner", label: "Pemula" },
  { value: "intermediate", label: "Menengah" },
  { value: "advanced", label: "Mahir" },
  { value: "expert", label: "Ahli" },
];

export const ORGANIZATION_TYPE_OPTIONS = [
  { value: "student", label: "Organisasi Mahasiswa" },
  { value: "professional", label: "Organisasi Profesional" },
  { value: "community", label: "Komunitas" },
  { value: "volunteer", label: "Volunteer" },
];

export const MONTH_OPTIONS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];
