import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/config/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build full URL for images, avatars, and other media from API paths
 * @param path - The path returned from API (e.g., "/images/avatar.jpg")
 * @returns Full URL (e.g., "https://api.karirkit.id/images/avatar.jpg")
 */
export function buildImageUrl(path?: string | null): string {
  if (!path) {
    return "";
  }

  // If path is already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Combine API URL with path
  return `${env.API_URL}/${cleanPath}`;
}
