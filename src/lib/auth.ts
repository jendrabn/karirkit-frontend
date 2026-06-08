import { api } from "./api-client";
import { isAxiosError } from "axios";
import type { User } from "@/types/user";
import {
  queryOptions,
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";

const AUTH_SESSION_HINT_KEY = "karirkit-auth-session-hint";

const isBrowser = () => typeof window !== "undefined";

export const hasAuthSessionHint = () => {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(AUTH_SESSION_HINT_KEY) === "true";
};

export const markAuthSessionHint = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_HINT_KEY, "true");
};

export const clearAuthSessionHint = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_HINT_KEY);
};

export const getUser = async (): Promise<User | null> => {
  try {
    return await api.get("/account/me", {
      skipGeneralErrorToast: true,
    });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      clearAuthSessionHint();
      return null;
    }

    throw error;
  }
};

export const userQueryKey = ["user"];

export const userQueryKeyOptions = () =>
  queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });

export const syncAuthenticatedUser = async (queryClient: QueryClient) => {
  const user = await getUser();

  queryClient.setQueryData(userQueryKey, user);
  if (user) {
    markAuthSessionHint();
  }
  await queryClient.invalidateQueries({ queryKey: userQueryKey });

  return user;
};

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof userQueryKeyOptions>;
};

export const useUser = ({ queryConfig }: UseUserOptions = {}) =>
  useQuery({
    ...userQueryKeyOptions(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...queryConfig,
    enabled: queryConfig?.enabled ?? hasAuthSessionHint(),
  });

export const logout = (): Promise<null> => {
  return api.post("/auth/logout");
};

export const useLogout = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all queries to remove any user-specific data
      queryClient.removeQueries();
      clearAuthSessionHint();
      onSuccess?.();
    },
  });
};
