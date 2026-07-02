"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, activeRole } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(activeRole)) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, activeRole, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return null;
  }

  return <>{children}</>;
}
