import type { ListResponse } from "./api";
import type { PublicUserProfile } from "./blog";

export interface PortfolioMedia {
  id: string;
  portfolio_id: string;
  path: string;
  caption: string | null;
}

export interface PortfolioTool {
  id: string;
  portfolio_id: string;
  name: string;
}

export type ProjectType = "work" | "freelance" | "personal" | "academic";

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  sort_description: string;
  description: string;
  role_title: string;
  project_type: ProjectType;
  industry: string;
  month: number;
  year: number;
  live_url: string | null;
  repo_url: string | null;
  cover: string;
  created_at: string;
  updated_at: string;
  medias: PortfolioMedia[];
  tools: PortfolioTool[];
}

export type PortfolioResponse = Portfolio;
export type PortfolioListResponse = ListResponse<Portfolio>;

export interface PublicPortfolioResponse {
  user: PublicUserProfile;
  portfolios: Portfolio[];
}

export interface PublicPortfolioDetailResponse {
  user: PublicUserProfile;
  portfolio: Portfolio;
}

export const projectTypeLabels: Record<ProjectType, string> = {
  work: "Pekerjaan",
  freelance: "Freelance",
  personal: "Personal",
  academic: "Akademik",
};
