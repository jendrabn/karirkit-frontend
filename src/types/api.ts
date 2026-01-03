export type ErrorResponse = {
  [field: string]: string[];
};

import type { DownloadStats, DocumentStorageStats } from "./storage";

import type { SocialLink } from "./social";

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  role: "user" | "admin" | "superadmin";
  avatar?: string | null;
  created_at: string;
  updated_at: string;
  download_stats?: DownloadStats;
  document_storage_limit?: number;
  document_storage_stats?: DocumentStorageStats;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  status?: "active" | "suspended" | "banned";
  status_reason?: string | null;
  suspended_until?: string | null;
  social_links?: SocialLink[];
};
