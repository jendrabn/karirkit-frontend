import type { ListResponse } from "./api";
import { JOB_TYPE_LABELS } from "./job";

export type DegreeType =
  | "middle_school"
  | "high_school"
  | "associate_d1"
  | "associate_d2"
  | "associate_d3"
  | "bachelor"
  | "master"
  | "doctorate"
  | "any";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type OrganizationType =
  | "student"
  | "community"
  | "professional"
  | "volunteer"
  | "other";

export interface CvEducation {
  degree: DegreeType;
  school_name: string;
  school_location: string;
  major: string;
  start_month: number;
  start_year: number;
  end_month: number | null;
  end_year: number | null;
  is_current: boolean;
  gpa: number | null;
  description: string | null;
}

export interface CvCertificate {
  title: string;
  issuer: string;
  issue_month: number;
  issue_year: number;
  expiry_month: number | null;
  expiry_year: number | null;
  no_expiry: boolean | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
}

export interface CvExperience {
  job_title: string;
  company_name: string;
  company_location: string;
  job_type: any; // Simplified to avoid circular dependency or keep it flexible
  start_month: number;
  start_year: number;
  end_month: number | null;
  end_year: number | null;
  is_current: boolean;
  description: string | null;
}

export type SkillCategory =
  | "software"
  | "tools"
  | "hard_skill"
  | "soft_skill"
  | "other"
  | "ms_office"
  | "google_workspace"
  | "data_entry"
  | "administration"
  | "secretarial"
  | "document_management"
  | "archiving"
  | "scheduling"
  | "virtual_assistant"
  | "communication"
  | "public_speaking"
  | "presentation"
  | "negotiation"
  | "customer_service"
  | "sales"
  | "business_development"
  | "leadership"
  | "teamwork"
  | "problem_solving"
  | "time_management"
  | "critical_thinking"
  | "training_facilitation"
  | "coaching_mentoring"
  | "language"
  | "translation"
  | "interpretation"
  | "programming_language"
  | "web_development"
  | "mobile_development"
  | "backend_development"
  | "frontend_development"
  | "fullstack_development"
  | "api_development"
  | "system_design"
  | "algorithms"
  | "data_structures"
  | "version_control"
  | "code_review"
  | "refactoring"
  | "framework_library"
  | "cms"
  | "ecommerce_platform"
  | "data_analysis"
  | "data_science"
  | "machine_learning"
  | "deep_learning"
  | "nlp"
  | "computer_vision"
  | "data_engineering"
  | "etl_elt"
  | "business_intelligence"
  | "statistics"
  | "experimentation_ab_testing"
  | "analytics"
  | "database_sql"
  | "database_nosql"
  | "data_warehouse"
  | "data_lake"
  | "devops"
  | "ci_cd"
  | "containerization"
  | "orchestration"
  | "cloud_computing"
  | "linux"
  | "networking"
  | "site_reliability"
  | "monitoring_observability"
  | "infrastructure_as_code"
  | "cybersecurity"
  | "app_security"
  | "network_security"
  | "iam_security"
  | "vulnerability_management"
  | "penetration_testing"
  | "quality_assurance"
  | "manual_testing"
  | "automation_testing"
  | "performance_testing"
  | "test_management"
  | "ui_ux_design"
  | "product_design"
  | "graphic_design"
  | "branding"
  | "illustration"
  | "video_editing"
  | "motion_graphics"
  | "photography"
  | "copywriting"
  | "content_writing"
  | "content_strategy"
  | "product_management"
  | "project_management"
  | "program_management"
  | "agile_scrum"
  | "business_analysis"
  | "process_improvement"
  | "operations"
  | "strategy_planning"
  | "okr_kpi"
  | "digital_marketing"
  | "social_media"
  | "seo"
  | "sem_ppc"
  | "email_marketing"
  | "performance_marketing"
  | "brand_marketing"
  | "market_research"
  | "pr_communications"
  | "community_management"
  | "finance"
  | "accounting"
  | "bookkeeping"
  | "taxation"
  | "budgeting_forecasting"
  | "financial_analysis"
  | "audit_compliance"
  | "human_resources"
  | "recruitment"
  | "people_operations"
  | "payroll"
  | "learning_development"
  | "legal"
  | "contract_management"
  | "compliance"
  | "risk_management"
  | "procurement"
  | "inventory_management"
  | "supply_chain"
  | "logistics"
  | "warehouse_management"
  | "shipping_fulfillment"
  | "healthcare"
  | "education"
  | "hospitality"
  | "retail"
  | "manufacturing"
  | "construction";

export interface CvSkill {
  name: string;
  level: SkillLevel;
  skill_category: SkillCategory;
}

export interface CvAward {
  title: string;
  issuer: string;
  description: string | null;
  year: number;
}

export interface CvSocialLink {
  platform: string;
  url: string;
}

export interface CvOrganization {
  organization_name: string;
  role_title: string;
  organization_type: OrganizationType;
  location: string;
  start_month: number;
  start_year: number;
  end_month: number | null;
  end_year: number | null;
  is_current: boolean;
  description: string | null;
}

export interface CvProject {
  name: string;
  description: string | null;
  year: number;
  repo_url: string | null;
  live_url: string | null;
}

export type CvVisibility = "private" | "public";

export interface CV {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  headline: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  photo: string | null;
  language: "id" | "en";
  visibility: CvVisibility;
  views: number;
  template_id: string;
  template?: {
    id: string;
    name: string;
    path: string;
    type: "cv" | "application_letter";
  };
  created_at: string;
  updated_at: string;
  educations: CvEducation[];
  certificates: CvCertificate[];
  experiences: CvExperience[];
  skills: CvSkill[];
  awards: CvAward[];
  social_links: CvSocialLink[];
  organizations: CvOrganization[];
  projects: CvProject[];
}

export type CvResponse = CV;
export type CvListResponse = ListResponse<CV>;

export const LANGUAGE_OPTIONS = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "Inggris" },
] as const;

export type LabelLanguage = (typeof LANGUAGE_OPTIONS)[number]["value"];

export const JOB_TYPE_OPTIONS = Object.entries(JOB_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export const DEGREE_OPTIONS = [
  { value: "middle_school", label: "SMP/MTs" },
  { value: "high_school", label: "SMA/SMK/MA" },
  { value: "associate_d1", label: "Diploma (D1)" },
  { value: "associate_d2", label: "Diploma (D2)" },
  { value: "associate_d3", label: "Diploma (D3)" },
  { value: "bachelor", label: "Sarjana (S1)" },
  { value: "master", label: "Magister (S2)" },
  { value: "doctorate", label: "Doktor (S3)" },
  { value: "any", label: "Tidak ditentukan" },
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
  { value: "other", label: "Lainnya" },
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
