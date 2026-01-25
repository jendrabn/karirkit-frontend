import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { SOCIAL_PLATFORM_VALUES } from "@/types/social";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type {
  CV,
  Education,
  Certificate,
  Experience,
  Skill,
  Award,
  SocialLink,
  Organization,
  Project,
} from "./get-cvs";

export const educationSchema = z.object({
  degree: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .enum([
        "middle_school",
        "high_school",
        "associate_d1",
        "associate_d2",
        "associate_d3",
        "bachelor",
        "master",
        "doctorate",
        "any",
      ])
      .default("any")
  ),
  school_name: z.string().min(1, "Nama sekolah/universitas wajib diisi"),
  school_location: z.string().min(1, "Lokasi wajib diisi"),
  major: z.string().optional(),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12).nullable().optional(),
  end_year: z.number().min(0).max(2100).nullable().optional(),
  is_current: z.boolean(),
  gpa: z.number().min(0).max(4).nullable().optional(),
  description: z.string().optional(),
});

export const certificateSchema = z.object({
  title: z.string().min(1, "Judul sertifikat wajib diisi"),
  issuer: z.string().min(1, "Penerbit wajib diisi"),
  issue_month: z.number().min(1).max(12),
  issue_year: z.number().min(1900).max(2100),
  expiry_month: z.number().min(0).max(12).nullable().optional(),
  expiry_year: z.number().min(0).max(2100).nullable().optional(),
  no_expiry: z.boolean(),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
  description: z.string().optional(),
});

export const experienceSchema = z.object({
  job_title: z.string().min(1, "Jabatan wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_location: z.string().min(1, "Lokasi wajib diisi"),
  job_type: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
    "freelance",
  ], {
    message: "Tipe pekerjaan wajib dipilih",
  }),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12).nullable().optional(),
  end_year: z.number().min(0).max(2100).nullable().optional(),
  is_current: z.boolean(),
  description: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Nama keahlian wajib diisi"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"], {
    message: "Level keahlian wajib dipilih",
  }),
  skill_category: z.any(),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Nama proyek wajib diisi"),
  description: z.string().optional(),
  year: z.number().min(1900).max(2100),
  repo_url: z.string().optional(),
  live_url: z.string().optional(),
});

export const awardSchema = z.object({
  title: z.string().min(1, "Judul penghargaan wajib diisi"),
  issuer: z.string().min(1, "Pemberi penghargaan wajib diisi"),
  description: z.string().optional(),
  year: z.number().min(1900).max(2100).nullable().optional(),
});

export const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORM_VALUES, {
    message: "Platform wajib diisi",
  }),
  url: z.string().url("URL tidak valid"),
});

export const organizationSchema = z.object({
  organization_name: z.string().min(1, "Nama organisasi wajib diisi"),
  role_title: z.string().min(1, "Jabatan wajib diisi"),
  organization_type: z.enum([
    "student",
    "professional",
    "volunteer",
    "community",
  ], {
    message: "Tipe organisasi wajib dipilih",
  }),
  location: z.string().optional(),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12).nullable().optional(),
  end_year: z.number().min(0).max(2100).nullable().optional(),
  is_current: z.boolean(),
  description: z.string().optional(),
});

export const cvSchema = z.object({
  template_id: z.string().min(1, "Template wajib dipilih"),
  name: z.string().min(1, "Nama wajib diisi"),
  headline: z.string().min(1, "Headline wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  about: z.string().min(1, "Ringkasan (About) wajib diisi"),
  photo: z.string().optional().nullable(),
  educations: z.array(educationSchema).min(1, "Minimal 1 pendidikan wajib diisi"),
  certificates: z.array(certificateSchema),
  experiences: z.array(experienceSchema).min(1, "Minimal 1 pengalaman wajib diisi"),
  skills: z.array(skillSchema).min(1, "Minimal 1 keahlian wajib diisi"),
  awards: z.array(awardSchema),
  social_links: z.array(socialLinkSchema),
  organizations: z.array(organizationSchema),
  projects: z.array(projectSchema),
  language: z.enum(["en", "id"]).optional(),
});

export type CVFormInput = z.input<typeof cvSchema>;
export type CVFormData = z.output<typeof cvSchema>;

export const normalizeProjects = (projects?: Project[]) =>
  (projects || []).map((project) => ({
    ...project,
    description: project.description ?? "",
    repo_url: project.repo_url ?? "",
    live_url: project.live_url ?? "",
  }));

export type CreateCVInput = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  address: string;
  about?: string;
  photo?: string | null;
  template_id?: string;
  educations?: Education[];
  certificates?: Certificate[];
  experiences?: Experience[];
  skills?: Skill[];
  awards?: Award[];
  social_links?: SocialLink[];
  organizations?: Organization[];
  projects?: Project[];
  language?: "en" | "id";
};

export type CreateCVResponse = CV;

export const createCV = (data: CreateCVInput): Promise<CreateCVResponse> => {
  return api.post("/cvs", data);
};

type UseCreateCVOptions = {
  mutationConfig?: MutationConfig<typeof createCV>;
};

export const useCreateCV = ({ mutationConfig }: UseCreateCVOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createCV,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
