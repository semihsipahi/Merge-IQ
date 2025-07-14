import React, { createContext, useContext, useState, useEffect } from "react";

interface GitHubUser {
  id: string;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  company?: string;
  location?: string;
  bio?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
}

interface AuthContextType {
  user: GitHubUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: GitHubUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication data on app startup
    const checkStoredAuth = async () => {
      try {
        const storedUser = localStorage.getItem("gitflow_user");
        const storedToken = localStorage.getItem("gitflow_token");

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking stored auth:", error);
        // Clear invalid stored data
        localStorage.removeItem("gitflow_user");
        localStorage.removeItem("gitflow_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const login = (userData: GitHubUser) => {
    setUser(userData);
    // Store user data in localStorage
    localStorage.setItem("gitflow_user", JSON.stringify(userData));
    // In a real app, you'd store the OAuth token as well
    localStorage.setItem("gitflow_token", "mock_token_" + userData.id);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gitflow_user");
    localStorage.removeItem("gitflow_token");

    // If in Electron, you might want to clear any stored credentials
    if (typeof window !== "undefined" && window.electronAPI) {
      // Notify Electron about logout
      console.log("User logged out");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for GitHub-specific operations
export function useGitHubAuth() {
  const auth = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("gitflow_token");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        }
      : {};
  };

  const isTokenValid = () => {
    const token = localStorage.getItem("gitflow_token");
    return !!token && !!auth.user;
  };

  return {
    ...auth,
    getAuthHeaders,
    isTokenValid,
  };
}
