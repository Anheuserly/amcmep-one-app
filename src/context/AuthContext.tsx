"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { ID, type Models } from "appwrite";
import { appwrite } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { UserProfile, UserRole } from "@/types";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  profile: UserProfile | null;
  session: Models.Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  activeRole: UserRole;
  roles: UserRole[];
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  createGuestSession: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    activeRole: "guest",
    roles: ["guest"],
  });

  const refreshProfile = useCallback(async () => {
    try {
      const user = await appwrite.account.get();
      const roles: UserRole[] = user.prefs?.roles?.length
        ? user.prefs.roles
        : ["customer"];
      const activeRole = (user.prefs?.activeRole as UserRole) || roles[0];

      const profile: UserProfile = {
        $id: user.$id,
        userId: user.$id,
        name: user.name || user.prefs?.name || "User",
        email: user.email,
        phone: user.phone,
        avatar: user.prefs?.avatar,
        roles,
        activeRole,
        referralCode: user.prefs?.referralCode,
        preferredLanguage: user.prefs?.preferredLanguage || "en",
        createdAt: user.$createdAt,
        updatedAt: user.$updatedAt,
      };

      setState((prev) => ({
        ...prev,
        user,
        profile,
        isAuthenticated: true,
        activeRole,
        roles,
        isLoading: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    await appwrite.account.createEmailPasswordSession(email, password);
    await refreshProfile();
  }, [refreshProfile]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    await appwrite.account.create(ID.unique(), email, password, name);
    await appwrite.account.createEmailPasswordSession(email, password);
    await appwrite.account.updatePrefs({
      name,
      roles: ["customer"],
      activeRole: "customer",
      preferredLanguage: "en",
    });
    await refreshProfile();
  }, [refreshProfile]);

  const logout = useCallback(async () => {
    await appwrite.account.deleteSession("current");
    setState({
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      activeRole: "guest",
      roles: ["guest"],
    });
  }, []);

  const createGuestSession = useCallback(async () => {
    await appwrite.account.createAnonymousSession();
    await appwrite.account.updatePrefs({
      roles: ["guest"],
      activeRole: "guest",
    });
    await refreshProfile();
  }, [refreshProfile]);

  const switchRole = useCallback((role: UserRole) => {
    if (state.roles.includes(role)) {
      setState((prev) => ({ ...prev, activeRole: role }));
    }
  }, [state.roles]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        createGuestSession,
        switchRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
