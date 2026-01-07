export type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "freelance";

export type WorkSystem = "onsite" | "remote" | "hybrid";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "administration_screening"
  | "hr_screening"
  | "online_test"
  | "psychological_test"
  | "technical_test"
  | "hr_interview"
  | "user_interview"
  | "final_interview"
  | "offering"
  | "mcu"
  | "onboarding"
  | "accepted"
  | "rejected";

export type ResultStatus = "pending" | "passed" | "failed";

import type { ListResponse } from "./api";

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  company_url: string | null;
  position: string;
  job_source: string | null;
  job_type: JobType;
  work_system: WorkSystem;
  salary_min: number;
  salary_max: number;
  location: string | null;
  date: string;
  status: ApplicationStatus;
  result_status: ResultStatus;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  follow_up_date: string | null;
  follow_up_note: string | null;
  job_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ApplicationResponse = Application;
export type ApplicationListResponse = ListResponse<Application>;

export const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

export const WORK_SYSTEM_OPTIONS: { value: WorkSystem; label: string }[] = [
  { value: "onsite", label: "Onsite" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

export const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "administration_screening", label: "Administration Screening" },
  { value: "hr_screening", label: "HR Screening" },
  { value: "online_test", label: "Online Test" },
  { value: "psychological_test", label: "Psychological Test" },
  { value: "technical_test", label: "Technical Test" },
  { value: "hr_interview", label: "HR Interview" },
  { value: "user_interview", label: "User Interview" },
  { value: "final_interview", label: "Final Interview" },
  { value: "offering", label: "Offering" },
  { value: "mcu", label: "MCU" },
  { value: "onboarding", label: "Onboarding" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export const RESULT_STATUS_OPTIONS: { value: ResultStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
];
