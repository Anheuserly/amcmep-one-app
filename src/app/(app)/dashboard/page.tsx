"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  ShoppingCart,
  Newspaper,
  Briefcase,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";

const quickActions = [
  { label: "New Request", href: "/requests?action=create", icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
  { label: "New AMC", href: "/amc?action=create", icon: ShieldCheck, color: "bg-green-50 text-green-600" },
  { label: "Start Chat", href: "/chats", icon: MessageSquare, color: "bg-purple-50 text-purple-600" },
  { label: "Browse Feed", href: "/feed", icon: Newspaper, color: "bg-orange-50 text-orange-600" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { profile, activeRole } = useAuth();

  const isCustomer = activeRole === "customer" || activeRole === "guest";
  const isPartner = activeRole === "partner";
  const isAdmin = activeRole === "administrator";

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {profile?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-gray-500 mt-1">
          {isCustomer && "Here's your service overview today."}
          {isPartner && "Your partner workspace and incoming leads."}
          {isAdmin && "Platform overview and management tools."}
        </p>
      </div>

      {/* Role badge */}
      <div className="flex items-center gap-2">
        <Badge variant={isAdmin ? "danger" : isPartner ? "info" : "primary"}>
          {activeRole}
        </Badge>
        <span className="text-sm text-gray-400">
          Switch roles from the top navbar to see different dashboards
        </span>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all"
          >
            <div className={`p-2.5 rounded-lg ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">AMC Contracts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partner/Admin specific sections */}
      {(isPartner || isAdmin) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-600" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">This Month</span>
                  <span className="font-semibold">₹24,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completed Jobs</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rating</span>
                  <span className="font-semibold text-yellow-600">4.8 ★</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-brand-600" />
                Workspace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Businesses</span>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Team Members</span>
                  <span className="font-semibold">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pending Approvals</span>
                  <span className="font-semibold text-warning">2</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => router.push("/workspace")}
              >
                Open Workspace
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin specific */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Businesses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">86</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Requests</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">342</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
