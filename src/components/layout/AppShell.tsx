"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { RoleGuard } from "./RoleGuard";
import type { UserRole } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AppShell({ children, allowedRoles }: AppShellProps) {
  const { isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-brand-200 border-t-brand-600 rounded-full" />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-gray-50">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)] pt-16">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
