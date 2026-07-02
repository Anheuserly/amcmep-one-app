"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Building2,
} from "lucide-react";
import type { UserRole } from "@/types";

interface NavbarProps {
  onMenuClick: () => void;
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  customer: <UserCheck className="h-4 w-4" />,
  partner: <ShieldCheck className="h-4 w-4" />,
  vendor: <Building2 className="h-4 w-4" />,
  administrator: <ShieldCheck className="h-4 w-4" />,
  guest: <UserCheck className="h-4 w-4" />,
};

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { profile, activeRole, roles, switchRole, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AMC</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              MEP 24x7
            </span>
          </button>
        </div>

        {/* Center search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services, businesses..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Role switcher */}
          {isAuthenticated && roles.length > 1 && (
            <div className="hidden sm:flex items-center gap-1">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  className={`
                    flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors
                    ${activeRole === role
                      ? "bg-brand-100 text-brand-700"
                      : "text-gray-500 hover:bg-gray-100"
                    }
                  `}
                  title={role}
                >
                  {roleIcons[role]}
                  <span className="hidden md:inline">{role}</span>
                </button>
              ))}
            </div>
          )}

          {/* Notifications */}
          <button
            onClick={() => router.push("/activity")}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger rounded-full" />
          </button>

          {/* Profile */}
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
          >
            <Avatar
              src={profile?.avatar}
              name={profile?.name || "User"}
              size="sm"
            />
            <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
