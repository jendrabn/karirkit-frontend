import { cn } from "@/lib/utils";

export const ENUM_BADGE_TONES = {
  slate:
    "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-500/15 dark:text-slate-300 dark:hover:bg-slate-500/15",
  stone:
    "border-transparent bg-stone-100 text-stone-700 hover:bg-stone-100 dark:bg-stone-500/15 dark:text-stone-300 dark:hover:bg-stone-500/15",
  red: "border-transparent bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/15",
  rose:
    "border-transparent bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/15",
  orange:
    "border-transparent bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-500/15 dark:text-orange-300 dark:hover:bg-orange-500/15",
  amber:
    "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/15",
  yellow:
    "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-500/15 dark:text-yellow-300 dark:hover:bg-yellow-500/15",
  lime: "border-transparent bg-lime-100 text-lime-800 hover:bg-lime-100 dark:bg-lime-500/15 dark:text-lime-300 dark:hover:bg-lime-500/15",
  green:
    "border-transparent bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/15 dark:text-green-300 dark:hover:bg-green-500/15",
  emerald:
    "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/15",
  teal: "border-transparent bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-500/15 dark:text-teal-300 dark:hover:bg-teal-500/15",
  cyan: "border-transparent bg-cyan-100 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-500/15",
  sky: "border-transparent bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-300 dark:hover:bg-sky-500/15",
  blue: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/15",
  indigo:
    "border-transparent bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/15",
  violet:
    "border-transparent bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-500/15 dark:text-violet-300 dark:hover:bg-violet-500/15",
  purple:
    "border-transparent bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-500/15 dark:text-purple-300 dark:hover:bg-purple-500/15",
  fuchsia:
    "border-transparent bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-100 dark:bg-fuchsia-500/15 dark:text-fuchsia-300 dark:hover:bg-fuchsia-500/15",
  pink: "border-transparent bg-pink-100 text-pink-700 hover:bg-pink-100 dark:bg-pink-500/15 dark:text-pink-300 dark:hover:bg-pink-500/15",
} as const;

export type EnumBadgeTone = keyof typeof ENUM_BADGE_TONES;

const ENUM_BADGE_MAP = {
  jobType: {
    full_time: "emerald",
    part_time: "sky",
    contract: "amber",
    internship: "violet",
    freelance: "rose",
  },
  workSystem: {
    onsite: "blue",
    remote: "teal",
    hybrid: "indigo",
  },
  applicationStatus: {
    draft: "slate",
    submitted: "blue",
    administration_screening: "cyan",
    hr_screening: "cyan",
    online_test: "violet",
    psychological_test: "purple",
    technical_test: "indigo",
    hr_interview: "orange",
    user_interview: "amber",
    final_interview: "rose",
    offering: "lime",
    mcu: "teal",
    onboarding: "emerald",
    accepted: "emerald",
    rejected: "rose",
  },
  applicationResultStatus: {
    pending: "amber",
    passed: "emerald",
    failed: "rose",
  },
  blogStatus: {
    draft: "slate",
    published: "emerald",
    archived: "stone",
  },
  jobStatus: {
    draft: "slate",
    published: "emerald",
    closed: "amber",
    archived: "stone",
  },
  userRole: {
    user: "slate",
    admin: "indigo",
  },
  userStatus: {
    active: "emerald",
    suspended: "amber",
    banned: "rose",
  },
  verificationStatus: {
    true: "emerald",
    false: "slate",
  },
  subscriptionPlan: {
    free: "slate",
    pro: "blue",
    max: "violet",
  },
  subscriptionStatus: {
    active: "emerald",
    pending: "amber",
    paid: "sky",
    expired: "stone",
    failed: "rose",
    cancelled: "slate",
  },
  gender: {
    male: "blue",
    female: "rose",
  },
  maritalStatus: {
    single: "slate",
    married: "emerald",
    widowed: "amber",
  },
  language: {
    id: "emerald",
    en: "blue",
  },
  templateType: {
    cv: "blue",
    application_letter: "emerald",
  },
  projectType: {
    work: "blue",
    freelance: "violet",
    personal: "emerald",
    academic: "amber",
  },
  cvVisibility: {
    public: "emerald",
    private: "slate",
  },
  degreeType: {
    middle_school: "slate",
    high_school: "stone",
    associate_d1: "blue",
    associate_d2: "sky",
    associate_d3: "cyan",
    bachelor: "emerald",
    master: "violet",
    doctorate: "rose",
    any: "slate",
  },
  skillLevel: {
    beginner: "slate",
    intermediate: "blue",
    advanced: "emerald",
    expert: "violet",
  },
  organizationType: {
    student: "cyan",
    community: "teal",
    professional: "indigo",
    volunteer: "amber",
    other: "slate",
  },
  employeeSize: {
    one_to_ten: "slate",
    eleven_to_fifty: "blue",
    fifty_one_to_two_hundred: "emerald",
    two_hundred_one_to_five_hundred: "amber",
    five_hundred_plus: "violet",
  },
  documentCompressionLevel: {
    auto: "slate",
    light: "blue",
    medium: "amber",
    strong: "rose",
  },
} as const;

export type EnumBadgeScope = keyof typeof ENUM_BADGE_MAP;

export function getEnumBadgeTone(scope: EnumBadgeScope, value: string | null | undefined) {
  const toneMap = ENUM_BADGE_MAP[scope] as Record<string, EnumBadgeTone>;
  const tone = toneMap[value ?? ""];
  return tone ?? "slate";
}

export function getEnumBadgeClassName(
  scope: EnumBadgeScope,
  value: string | null | undefined,
) {
  return cn(ENUM_BADGE_TONES[getEnumBadgeTone(scope, value)]);
}
