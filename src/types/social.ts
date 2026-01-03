export const SOCIAL_PLATFORM_VALUES = [
  // Profesional & portofolio umum
  "linkedin",
  "website",
  "blog",
  "portfolio",

  // Developer
  "github",
  "gitlab",
  "bitbucket",
  "stackoverflow",
  "devto",
  "hashnode",
  "medium",

  // Coding challenge
  "leetcode",
  "hackerrank",
  "codewars",
  "topcoder",

  // Data/AI
  "kaggle",

  // Desain & kreatif
  "behance",
  "dribbble",
  "figma",
  "adobe_portfolio",
  "artstation",

  // Video / konten
  "youtube",
  "vimeo",
  "tiktok",
  "twitch",

  // Sosial
  "x",
  "twitter",
  "instagram",
  "facebook",
  "threads",

  // Komunitas & komunikasi
  "discord",
  "telegram",
  "whatsapp",
  "line",
  "wechat",
  "skype",

  // Akademik
  "google_scholar",
  "orcid",
  "researchgate",
  "arxiv",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORM_VALUES)[number];

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  website: "Website",
  blog: "Blog",
  portfolio: "Portofolio",
  github: "GitHub",
  gitlab: "GitLab",
  bitbucket: "Bitbucket",
  stackoverflow: "Stack Overflow",
  devto: "Dev.to",
  hashnode: "Hashnode",
  medium: "Medium",
  leetcode: "LeetCode",
  hackerrank: "HackerRank",
  codewars: "Codewars",
  topcoder: "Topcoder",
  kaggle: "Kaggle",
  behance: "Behance",
  dribbble: "Dribbble",
  figma: "Figma",
  adobe_portfolio: "Adobe Portfolio",
  artstation: "ArtStation",
  youtube: "YouTube",
  vimeo: "Vimeo",
  tiktok: "TikTok",
  twitch: "Twitch",
  x: "X",
  twitter: "Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  threads: "Threads",
  discord: "Discord",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  line: "LINE",
  wechat: "WeChat",
  skype: "Skype",
  google_scholar: "Google Scholar",
  orcid: "ORCID",
  researchgate: "ResearchGate",
  arxiv: "arXiv",
};

export const SOCIAL_PLATFORM_OPTIONS = SOCIAL_PLATFORM_VALUES.map((value) => ({
  value,
  label: SOCIAL_PLATFORM_LABELS[value],
}));

export interface SocialLink {
  id?: string;
  user_id?: string;
  platform: SocialPlatform;
  url: string;
}
