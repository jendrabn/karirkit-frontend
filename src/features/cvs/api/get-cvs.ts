import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { SocialPlatform } from "@/types/social";
import type { SkillCategory, CvVisibility } from "@/types/cv";

export type CVsResponse = {
  items: CV[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
};

export type CV = {
  id: string;
  user_id: string;
  name: string;
  headline: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  photo: string;
  template_id?: string;
  template?: {
    id: string;
    name: string;
    path: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
  educations: Education[];
  certificates: Certificate[];
  experiences: Experience[];
  skills: Skill[];
  awards: Award[];
  social_links: SocialLink[];
  organizations: Organization[];
  projects: Project[];
  language?: "id" | "en";
  slug?: string;
  visibility: CvVisibility;
  views: number;
};

export type Education = {
  degree:
    | "middle_school"
    | "high_school"
    | "associate_d1"
    | "associate_d2"
    | "associate_d3"
    | "bachelor"
    | "master"
    | "doctorate"
    | "any";
  school_name: string;
  school_location: string;
  major?: string;
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  is_current: boolean;
  gpa?: number | null;
  description?: string;
};

export type Certificate = {
  title: string;
  issuer: string;
  issue_month: number;
  issue_year: number;
  expiry_month?: number | null;
  expiry_year?: number | null;
  no_expiry: boolean;
  credential_id?: string;
  credential_url?: string;
  description?: string;
};

export type Experience = {
  job_title: string;
  company_name: string;
  company_location: string;
  job_type: "full_time" | "part_time" | "contract" | "internship" | "freelance";
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  is_current: boolean;
  description?: string;
};

export type Skill = {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  skill_category: SkillCategory;
};

export type Project = {
  name: string;
  description?: string | null;
  year: number;
  repo_url?: string | null;
  live_url?: string | null;
};

export type Award = {
  title: string;
  issuer: string;
  description?: string;
  year?: number | null;
};

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type Organization = {
  organization_name: string;
  role_title: string;
  organization_type: "student" | "professional" | "volunteer" | "community";
  location?: string;
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  is_current: boolean;
  description?: string;
};

export type GetCVsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "name" | "views" | "headline";
  visibility?: "private" | "public";
  language?: "id" | "en";
  template_id?: string;
  created_at_from?: string;
  created_at_to?: string;
  updated_at_from?: string;
  updated_at_to?: string;
  views_from?: number;
  views_to?: number;
  educations_degree?: string;
  experiences_job_type?: string;
  experiences_is_current?: "true" | "false";
  skills_level?: string;
  skills_skill_category?: string;
  organizations_organization_type?: string;
};

export const getCVs = (params?: GetCVsParams): Promise<CVsResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/cvs", {
    params: filteredParams,
  });
};

export const getCVsQueryOptions = (params?: GetCVsParams) => {
  return queryOptions({
    queryKey: ["cvs", params],
    queryFn: () => getCVs(params),
  });
};

type UseCVsOptions = {
  params?: GetCVsParams;
  queryConfig?: QueryConfig<typeof getCVsQueryOptions>;
};

export const useCVs = ({ params, queryConfig }: UseCVsOptions = {}) => {
  return useQuery({
    ...getCVsQueryOptions(params),
    ...queryConfig,
  });
};
