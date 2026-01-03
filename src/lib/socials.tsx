import type { Icon } from "lucide-react";
import {
  Dribbble,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitch,
  Twitter,
  Youtube,
  X,
  ExternalLink,
} from "lucide-react";
import type { SocialPlatform } from "@/types/social";

const ICON_MAP: Partial<Record<SocialPlatform, Icon>> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  dribbble: Dribbble,
  behance: ExternalLink,
  telegram: ExternalLink,
  whatsapp: ExternalLink,
  vimeo: ExternalLink,
  twitch: Twitch,
  skype: ExternalLink,
  x: X,
  medium: ExternalLink,
  hashnode: ExternalLink,
  website: Globe,
  blog: ExternalLink,
  portfolio: ExternalLink,
  gitlab: Github,
  bitbucket: Github,
  stackoverflow: ExternalLink,
  devto: ExternalLink,
  leetcode: ExternalLink,
  hackerrank: ExternalLink,
  codewars: ExternalLink,
  topcoder: ExternalLink,
  kaggle: ExternalLink,
  figma: ExternalLink,
  adobe_portfolio: ExternalLink,
  artstation: ExternalLink,
  google_scholar: ExternalLink,
  orcid: ExternalLink,
  researchgate: ExternalLink,
  arxiv: ExternalLink,
  line: ExternalLink,
  wechat: ExternalLink,
  discord: ExternalLink,
};

export function getSocialIcon(platform: SocialPlatform, className = "h-5 w-5") {
  const IconComponent = ICON_MAP[platform] ?? Globe;
  return <IconComponent className={className} />;
}
