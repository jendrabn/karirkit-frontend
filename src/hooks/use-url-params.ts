import { useSearchParams } from "react-router";
import { useMemo, useState } from "react";

type ParamValue = string | number | boolean | null | undefined;
type Params = Record<string, ParamValue>;

export interface UseUrlParamsOptions {
  /**
   * Reset page to 1 when other params change
   */
  resetPageOnChange?: boolean;
  /**
   * Key name for page parameter
   */
  pageKey?: string;
}

export function useUrlParams<T extends Params>(
  defaults: T,
  options: UseUrlParamsOptions = {}
) {
  const { resetPageOnChange = true, pageKey = "page" } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(() => {
    return searchParams.get("q") || "";
  });

  // Parse params from URL
  const params = useMemo(() => {
    const parsed = { ...defaults } as any;

    searchParams.forEach((value, key) => {
      if (key in defaults) {
        const defaultValue = defaults[key];

        // Type casting based on default value type
        if (typeof defaultValue === "number") {
          const num = Number(value);
          if (!isNaN(num)) {
            parsed[key] = num;
          }
        } else if (typeof defaultValue === "boolean") {
          parsed[key] = value === "true";
        } else {
          parsed[key] = value;
        }
      }
    });

    return parsed as T;
  }, [searchParams, defaults]);

  // Update single param
  const setParam = <K extends keyof T>(
    key: K,
    value: T[K],
    resetPage = true
  ) => {
    const next = new URLSearchParams(searchParams);

    if (value !== null && value !== undefined && value !== "") {
      next.set(String(key), String(value));
    } else {
      next.delete(String(key));
    }

    // Reset page if needed
    if (resetPageOnChange && resetPage && key !== pageKey) {
      next.delete(pageKey);
    }

    setSearchParams(next);
  };

  // Update multiple params
  const setParams = (updates: Partial<T>, resetPage = true) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        next.set(key, String(value));
      } else {
        next.delete(key);
      }
    });

    // Reset page if needed
    if (resetPageOnChange && resetPage) {
      next.delete(pageKey);
    }

    setSearchParams(next);
  };

  // Handle search input change
  const handleSearchInput = (value: string) => {
    setSearchInput(value);
  };

  // Handle search submit (Enter key or form submit)
  const handleSearchSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    // If it's a keyboard event, only handle Enter
    if (e && "key" in e) {
      if (e.key !== "Enter") {
        return;
      }
      e.preventDefault();
    } else if (e) {
      // Prevent default for form submissions
      e.preventDefault();
    }

    const next = new URLSearchParams(searchParams);

    if (searchInput) {
      next.set("q", searchInput);
    } else {
      next.delete("q");
    }

    // Reset page when searching
    if (resetPageOnChange) {
      next.delete(pageKey);
    }

    setSearchParams(next);
  };

  // Clear all params
  const clearParams = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput("");
  };

  // Clear specific param
  const clearParam = <K extends keyof T>(key: K) => {
    const next = new URLSearchParams(searchParams);
    next.delete(String(key));
    setSearchParams(next);

    if (key === "q") {
      setSearchInput("");
    }
  };

  return {
    params,
    setParam,
    setParams,
    clearParam,
    clearParams,
    searchInput,
    handleSearchInput,
    handleSearchSubmit,
  };
}
