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

// const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"];
export const BYTES_IN_MEGABYTE = 1024 * 1024;

// export function formatBytes(value?: number | null, precision = 2) {
//   if (value == null || isNaN(value)) {
//     return "0 B";
//   }

//   let bytes = Math.max(0, value);
//   let unitIndex = 0;

//   while (bytes >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
//     bytes /= 1024;
//     unitIndex += 1;
//   }

//   const formatted =
//     unitIndex === 0 ? Math.round(bytes) : bytes.toFixed(precision);

//   return `${formatted} ${BYTE_UNITS[unitIndex]}`;
// }

export function bytesToMegabytes(value?: number | null) {
  if (value == null || isNaN(value)) {
    return 0;
  }
  return value / BYTES_IN_MEGABYTE;
}

export function megabytesToBytes(value: number) {
  return Math.round(value * BYTES_IN_MEGABYTE);
}

// ============================================
// FORMATTING UTILITIES
// Tambahkan ke file src/lib/utils.ts yang sudah ada
// ============================================

/**
 * Format any value to string, return "-" if empty
 */
export const formatValue = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

/**
 * Parse value to number, return null if invalid
 */
export const parseNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Format number to Indonesian Rupiah currency
 */
export const formatCurrency = (value: unknown): string => {
  const parsed = parseNumber(value);
  if (parsed === null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(parsed);
};

/**
 * Format number to years format (e.g., "5 tahun")
 */
export const formatYears = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "-";
  return `${value} tahun`;
};

/**
 * Format number to Indonesian number format with thousand separator
 */
export const formatNumber = (value: unknown): string => {
  const parsed = parseNumber(value);
  if (parsed === null) return "-";
  return new Intl.NumberFormat("id-ID").format(parsed);
};

/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number | null | undefined,
  decimals: number = 0,
): string => {
  if (value === null || value === undefined) return "-";
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Format phone number for WhatsApp link
 * Converts Indonesian phone format to international format
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "");
  // If starts with 0, replace with 62 (Indonesia country code)
  const waPhone = cleanPhone.startsWith("0")
    ? "62" + cleanPhone.slice(1)
    : cleanPhone;
  return waPhone;
};

/**
 * Get contact link based on type
 */
export const getContactLink = (
  type: "email" | "phone" | "url",
  value: string,
): string => {
  switch (type) {
    case "email":
      return `mailto:${value}`;
    case "phone": {
      return `https://wa.me/${formatPhoneForWhatsApp(value)}`;
    }
    case "url":
      return value.startsWith("http") ? value : `https://${value}`;
  }
};
