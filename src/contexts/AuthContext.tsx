import React, { createContext, useContext } from "react";
import { useUser, useLogout } from "@/lib/auth";
import type { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: userData, isLoading, error } = useUser();
  const logoutMutation = useLogout({
    onSuccess: () => {
      // Query cache will be automatically cleared by the useLogout hook
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  const user = userData || null;
  const isAuthenticated = !!user && !error;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
