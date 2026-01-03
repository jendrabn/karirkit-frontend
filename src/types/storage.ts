export interface DownloadStats {
  daily_limit: number;
  today_count: number;
  remaining: number;
}

export interface DocumentStorageStats {
  limit: number;
  used: number;
  remaining: number;
}
