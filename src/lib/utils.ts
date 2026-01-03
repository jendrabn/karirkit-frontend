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

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"];
export const BYTES_IN_MEGABYTE = 1024 * 1024;

export function formatBytes(value?: number | null, precision = 2) {
  if (value == null || isNaN(value)) {
    return "0 B";
  }

  let bytes = Math.max(0, value);
  let unitIndex = 0;

  while (bytes >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
    bytes /= 1024;
    unitIndex += 1;
  }

  const formatted =
    unitIndex === 0 ? Math.round(bytes) : bytes.toFixed(precision);

  return `${formatted} ${BYTE_UNITS[unitIndex]}`;
}

export function bytesToMegabytes(value?: number | null) {
  if (value == null || isNaN(value)) {
    return 0;
  }
  return value / BYTES_IN_MEGABYTE;
}

export function megabytesToBytes(value: number) {
  return Math.round(value * BYTES_IN_MEGABYTE);
}
