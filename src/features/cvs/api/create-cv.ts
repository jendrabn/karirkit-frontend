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

// ============================================================================
// REUSABLE BASE SCHEMAS
// ============================================================================

/** Convert empty/null/undefined to 0 */
const toNumber = (value: unknown) =>
  value === "" || value === null || value === undefined ? 0 : value;

/** Convert empty/null/undefined to empty string */
const toString = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

/** Month schema (1-12) - required */
const monthRequired = z.preprocess(
  toNumber,
  z.number().min(1, "Bulan wajib dipilih").max(12, "Bulan tidak valid"),
);

/** Month schema (0-12) - optional */
const monthOptional = z.preprocess(
  toNumber,
  z.number().min(0).max(12, "Bulan tidak valid"),
);

/** Year schema (1900-2100) - required */
const yearRequired = z.preprocess(
  toNumber,
  z
    .number()
    .min(1, "Tahun wajib dipilih")
    .refine((year) => year >= 1900 && year <= 2100, {
      message: "Tahun tidak valid",
    }),
);

/** Year schema (0-2100) - optional */
const yearOptional = z.preprocess(
  toNumber,
  z.number().min(0).max(2100, "Tahun tidak valid"),
);

/** Date range validation helper */
const validateDateRange =
  (fieldPrefix: "end" | "expiry") =>
  (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const shouldValidate =
      fieldPrefix === "end" ? !data.is_current : !data.no_expiry;

    if (!shouldValidate) return;

    const monthField = `${fieldPrefix}_month`;
    const yearField = `${fieldPrefix}_year`;
    const monthLabel = fieldPrefix === "end" ? "selesai" : "kedaluwarsa";

    if (!data[monthField]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [monthField],
        message: `Bulan ${monthLabel} wajib dipilih`,
      });
    }
    if (!data[yearField]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [yearField],
        message: `Tahun ${monthLabel} wajib dipilih`,
      });
    }
  };

// ============================================================================
// MAIN SCHEMAS
// ============================================================================

const DEGREE_VALUES = [
  "middle_school",
  "high_school",
  "associate_d1",
  "associate_d2",
  "associate_d3",
  "bachelor",
  "master",
  "doctorate",
  "any",
] as const;

export const educationSchema = z
  .object({
    degree: z.preprocess(
      toString,
      z
        .string()
        .min(1, "Jenjang wajib dipilih")
        .refine(
          (v): v is (typeof DEGREE_VALUES)[number] =>
            DEGREE_VALUES.includes(v as (typeof DEGREE_VALUES)[number]),
          "Jenjang tidak valid",
        ),
    ),
    school_name: z.string().min(1, "Nama sekolah/universitas wajib diisi"),
    school_location: z.string().min(1, "Lokasi wajib diisi"),
    major: z.string().min(1, "Jurusan wajib diisi"),
    start_month: monthRequired,
    start_year: yearRequired,
    end_month: monthOptional.nullable().optional(),
    end_year: yearOptional.nullable().optional(),
    is_current: z.boolean(),
    gpa: z.preprocess(
      (v) =>
        v === "" || v === null || v === undefined || Number.isNaN(v) ? null : v,
      z.number().min(0).max(4).nullable(),
    ),
    description: z.string().optional(),
  })
  .superRefine(validateDateRange("end"));

export const certificateSchema = z
  .object({
    title: z.string().min(1, "Judul sertifikat wajib diisi"),
    issuer: z.string().min(1, "Penerbit wajib diisi"),
    issue_month: monthRequired,
    issue_year: yearRequired,
    expiry_month: monthOptional.nullable().optional(),
    expiry_year: yearOptional.nullable().optional(),
    no_expiry: z.boolean(),
    credential_id: z.string().optional(),
    credential_url: z.string().optional(),
    description: z.string().optional(),
  })
  .superRefine(validateDateRange("expiry"));

const experienceBaseSchema = z.object({
  job_title: z.string().min(1, "Jabatan wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_location: z.string().min(1, "Lokasi wajib diisi"),
  job_type: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) {
        return undefined;
      }
      return v;
    },
    z
      .enum(["full_time", "part_time", "contract", "internship", "freelance"], {
        message: "Tipe pekerjaan wajib dipilih",
      })
      .refine((v) => v !== undefined, {
        message: "Tipe pekerjaan wajib dipilih",
      }),
  ),
  start_month: monthRequired,
  start_year: yearRequired,
  description: z.string().optional(),
});

export const experienceSchema = z.discriminatedUnion("is_current", [
  experienceBaseSchema.extend({
    is_current: z.literal(true),
    end_month: monthOptional.nullable().optional(),
    end_year: yearOptional.nullable().optional(),
  }),
  experienceBaseSchema.extend({
    is_current: z.literal(false),
    end_month: monthRequired,
    end_year: yearRequired,
  }),
]);

export const skillSchema = z.object({
  name: z.string().min(1, "Nama keahlian wajib diisi"),
  level: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) {
        return undefined;
      }
      return v;
    },
    z
      .enum(["beginner", "intermediate", "advanced", "expert"], {
        message: "Level keahlian wajib dipilih",
      })
      .refine((v) => v !== undefined, {
        message: "Level keahlian wajib dipilih",
      }),
  ),
  skill_category: z.string().min(1, "Kategori keahlian wajib dipilih"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Nama proyek wajib diisi"),
  description: z.string().optional(),
  year: yearRequired,
  repo_url: z.string().optional(),
  live_url: z.string().optional(),
});

export const awardSchema = z.object({
  title: z.string().min(1, "Judul penghargaan wajib diisi"),
  issuer: z.string().min(1, "Pemberi penghargaan wajib diisi"),
  description: z.string().optional(),
  year: yearRequired,
});

export const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORM_VALUES, {
    message: "Platform wajib dipilih",
  }),
  url: z.string().url("URL tidak valid"),
});

export const organizationSchema = z.discriminatedUnion("is_current", [
  z.object({
    organization_name: z.string().min(1, "Nama organisasi wajib diisi"),
    role_title: z.string().min(1, "Jabatan wajib diisi"),
    organization_type: z.enum(
      ["student", "professional", "volunteer", "community"],
      { message: "Tipe organisasi wajib dipilih" },
    ),
    location: z.string().optional(),
    start_month: monthRequired,
    start_year: yearRequired,
    is_current: z.literal(true),
    end_month: monthOptional.nullable().optional(),
    end_year: yearOptional.nullable().optional(),
    description: z.string().optional(),
  }),
  z.object({
    organization_name: z.string().min(1, "Nama organisasi wajib diisi"),
    role_title: z.string().min(1, "Jabatan wajib diisi"),
    organization_type: z.enum(
      ["student", "professional", "volunteer", "community"],
      { message: "Tipe organisasi wajib dipilih" },
    ),
    location: z.string().optional(),
    start_month: monthRequired,
    start_year: yearRequired,
    is_current: z.literal(false),
    end_month: monthRequired,
    end_year: yearRequired,
    description: z.string().optional(),
  }),
]);

export const cvSchema = z.object({
  template_id: z.string().min(1, "Template wajib dipilih"),
  name: z.string().min(1, "Nama wajib diisi"),
  headline: z.string().min(1, "Headline wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  about: z.string().min(1, "Ringkasan wajib diisi"),
  photo: z.string().optional().nullable(),
  educations: z
    .array(educationSchema)
    .min(1, "Minimal 1 pendidikan wajib diisi"),
  certificates: z.array(certificateSchema),
  experiences: z
    .array(experienceSchema)
    .min(1, "Minimal 1 pengalaman wajib diisi"),
  skills: z.array(skillSchema).min(1, "Minimal 1 keahlian wajib diisi"),
  awards: z.array(awardSchema),
  social_links: z.array(socialLinkSchema),
  organizations: z.array(organizationSchema),
  projects: z.array(projectSchema),
  language: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) {
        return undefined;
      }
      return v;
    },
    z.enum(["en", "id"], {
      message: "Bahasa wajib dipilih",
    }),
  ),
});

// ============================================================================
// TYPES & UTILITIES
// ============================================================================

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
