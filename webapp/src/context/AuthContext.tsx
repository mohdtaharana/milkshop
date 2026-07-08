import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserAccount } from "../types";

const API_BASE = "/api";

interface AuthContextProps {
  user: UserAccount | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<string | null>;
  updateProfile: (displayName: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("milkshop_user");
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data: any = await res.json();
      if (!data.success) return data.error || "Login failed";
      const u: UserAccount = { username: data.data.username, displayName: data.data.displayName, role: data.data.role };
      setUser(u);
      localStorage.setItem("milkshop_user", JSON.stringify(u));
      return null;
    } catch {
      return "Network error. Check your connection.";
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("milkshop_user");
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<string | null> => {
    if (!user) return "Not logged in";
    try {
      const res = await fetch(`${API_BASE}/users/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, currentPassword, newPassword }),
      });
      const data: any = await res.json();
      if (!data.success) return data.error || "Failed to change password";
      return null;
    } catch {
      return "Network error";
    }
  }, [user]);

  const updateProfile = useCallback(async (displayName: string): Promise<string | null> => {
    if (!user) return "Not logged in";
    try {
      const res = await fetch(`${API_BASE}/users/${user.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, role: user.role }),
      });
      const data: any = await res.json();
      if (!data.success) return data.error || "Failed to update profile";
      const updated = { ...user, displayName };
      setUser(updated);
      localStorage.setItem("milkshop_user", JSON.stringify(updated));
      return null;
    } catch {
      return "Network error";
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, changePassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
