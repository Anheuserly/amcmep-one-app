"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  Store,
  Newspaper,
  ShoppingCart,
  Briefcase,
  UserCircle,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import type { UserRole } from "@/types";

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["customer", "partner", "administrator", "guest"] },
      { label: "Assistant", href: "/assistant", icon: MessageSquare, roles: ["customer", "partner", "administrator", "guest"] },
    ],
  },
  {
    label: "Work",
    items: [
      { label: "Chats", href: "/chats", icon: MessageSquare, roles: ["customer", "partner", "administrator"] },
      { label: "Requests", href: "/requests", icon: ClipboardList, roles: ["customer", "partner", "administrator"] },
      { label: "AMC", href: "/amc", icon: ShieldCheck, roles: ["customer", "partner", "administrator"] },
      { label: "Feed", href: "/feed", icon: Newspaper, roles: ["customer", "partner", "administrator", "guest"] },
      { label: "Marketplace", href: "/marketplace", icon: ShoppingCart, roles: ["customer", "partner", "administrator", "guest"] },
      { label: "Workspace", href: "/workspace", icon: Briefcase, roles: ["partner", "administrator"] },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle, roles: ["customer", "partner", "administrator", "guest"] },
      { label: "Activity", href: "/activity", icon: Bell, roles: ["customer", "partner", "administrator"] },
      { label: "Settings", href: "/settings", icon: Settings, roles: ["customer", "partner", "administrator", "guest"] },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { profile, activeRole, logout } = useAuth();

  const handleNav = (href: string) => {
    router.push(href);
    onClose();
  };

  const filteredGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(activeRole)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* User mini profile */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar
                src={profile?.avatar}
                name={profile?.name || "User"}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile?.name || "Guest"}
                </p>
                <p className="text-xs text-gray-500 capitalize truncate">
                  {activeRole}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-6">
            {filteredGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <button
                        onClick={() => handleNav(item.href)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <item.icon className="h-5 w-5 text-gray-400" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
