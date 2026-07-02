"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  ShoppingCart,
  Newspaper,
  TrendingUp,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

const assistantModules = [
  {
    title: "Today's Chats",
    description: "5 active conversations",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600",
    href: "/chats",
  },
  {
    title: "Active Requests",
    description: "3 requests in progress",
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-600",
    href: "/requests",
  },
  {
    title: "AMC Status",
    description: "2 contracts active",
    icon: ShieldCheck,
    color: "bg-green-50 text-green-600",
    href: "/amc",
  },
  {
    title: "Marketplace",
    description: "Browse equipment & parts",
    icon: ShoppingCart,
    color: "bg-orange-50 text-orange-600",
    href: "/marketplace",
  },
  {
    title: "Feed Updates",
    description: "12 new posts",
    icon: Newspaper,
    color: "bg-pink-50 text-pink-600",
    href: "/feed",
  },
  {
    title: "Upcoming Visits",
    description: "Next: Tomorrow 10 AM",
    icon: CalendarDays,
    color: "bg-teal-50 text-teal-600",
    href: "/amc",
  },
];

export default function AssistantPage() {
  const router = useRouter();
  const { activeRole } = useAuth();
  const isPartner = activeRole === "partner" || activeRole === "administrator";

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assistant</h1>
        <p className="text-gray-500 mt-1">Your central hub for all activities</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Open Requests</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Active AMC</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Unread Chats</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">New Leads</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{isPartner ? "2" : "0"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assistantModules.map((module) => (
          <Card key={module.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(module.href)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${module.color}`}>
                    <module.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{module.title}</p>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partner specific */}
      {isPartner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-600" />
              Partner Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">₹24,500</p>
                <p className="text-xs text-gray-500 mt-1">This Month</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500 mt-1">Jobs Done</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">4.8 ★</p>
                <p className="text-xs text-gray-500 mt-1">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
