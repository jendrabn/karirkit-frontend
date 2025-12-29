import { useState, useEffect, useCallback } from "react";
import type { Job } from "@/types/job";
import { toast } from "sonner";

const STORAGE_KEY = "karirkit_bookmarked_jobs";

// Global state to sync multiple instances of the hook
let globalBookmarks: Job[] = (() => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse bookmarks from localStorage", e);
      return [];
    }
  }
  return [];
})();

const listeners = new Set<(jobs: Job[]) => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...globalBookmarks]));
};

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Job[]>(globalBookmarks);

  useEffect(() => {
    const listener = (newBookmarks: Job[]) => {
      setBookmarks(newBookmarks);
    };
    listeners.add(listener);

    // Sync from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          globalBookmarks = JSON.parse(e.newValue);
          notifyListeners();
        } catch (err) {
          console.error("Failed to sync bookmarks from another tab", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const saveBookmarks = (newBookmarks: Job[]) => {
    globalBookmarks = newBookmarks;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalBookmarks));
    notifyListeners();
  };

  const isBookmarked = useCallback(
    (jobId: string) => {
      return bookmarks.some((job) => job.id === jobId);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback((job: Job) => {
    const exists = globalBookmarks.some((item) => item.id === job.id);
    let newBookmarks: Job[];

    if (exists) {
      newBookmarks = globalBookmarks.filter((item) => item.id !== job.id);
      toast.success("Lowongan dihapus dari bookmark");
    } else {
      newBookmarks = [...globalBookmarks, job];
      toast.success("Lowongan berhasil disimpan ke bookmark");
    }

    saveBookmarks(newBookmarks);
  }, []);

  const removeBookmark = useCallback((jobId: string) => {
    const exists = globalBookmarks.some((item) => item.id === jobId);
    if (exists) {
      const newBookmarks = globalBookmarks.filter((item) => item.id !== jobId);
      saveBookmarks(newBookmarks);
      toast.success("Lowongan dihapus dari bookmark");
    }
  }, []);

  const clearBookmarks = useCallback(() => {
    saveBookmarks([]);
    toast.success("Semua bookmark berhasil dihapus");
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearBookmarks,
  };
}
