"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RoleGuard } from "@/components/layout/RoleGuard";
import {
  Shield, Users, Building2, ClipboardList, ShieldCheck, IndianRupee, AlertTriangle, TrendingUp, BarChart3, PieChart, Activity, CheckCircle, ArrowRight, Eye
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,247", icon: Users, color: "bg-indigo-50 text-indigo-600" },
  { label: "Active Businesses", value: "86", icon: Building2, color: "bg-pink-50 text-pink-600" },
  { label: "Service Requests", value: "342", icon: ClipboardList, color: "bg-teal-50 text-teal-600" },
  { label: "AMC Contracts", value: "189", icon: ShieldCheck, color: "bg-green-50 text-green-600" },
  { label: "Revenue (Monthly)", value: "₹18.5L", icon: IndianRupee, color: "bg-blue-50 text-blue-600" },
  { label: "Pending Approvals", value: "12", icon: AlertTriangle, color: "bg-orange-50 text-orange-600" },
];

const recentActivity = [
  { user: "Rahul Kumar", action: "Completed service request #SR-2847", time: "2 min ago", type: "success" },
  { user: "Agni Fire Safety", action: "New business registration", time: "15 min ago", type: "info" },
  { user: "Vikram Singh", action: "Updated partner profile", time: "32 min ago", type: "info" },
  { user: "System", action: "Auto-renewed 14 AMC contracts", time: "1 hr ago", type: "success" },
  { user: "John Doe", action: "Created new service request", time: "2 hr ago", type: "info" },
  { user: "Admin", action: "Approved business #B-145", time: "3 hr ago", type: "success" },
];

const quickActions = [
  { label: "Approve Businesses", href: "/admin/businesses", icon: CheckCircle, count: 5 },
  { label: "Manage Users", href: "/admin/users", icon: Users, count: 12 },
  { label: "View Reports", href: "#", icon: BarChart3, count: 0 },
  { label: "System Health", href: "#", icon: Activity, count: 0 },
];

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["administrator"]}>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Platform overview and management</p>
          </div>
          <Badge variant="danger" className="px-3 py-1"><Shield className="h-3.5 w-3.5 mr-1" />Administrator</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className={`p-2 rounded-lg w-fit ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button key={action.label} variant="outline" className="h-auto py-4 justify-start flex-col items-start gap-2" asChild>
              <a href={action.href}>
                <div className="flex items-center gap-2">
                  <action.icon className="h-5 w-5 text-brand-600" />
                  {action.count > 0 && (
                    <span className="h-5 min-w-[1.25rem] px-1 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center">{action.count}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </a>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-brand-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${activity.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Placeholders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-brand-600" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Revenue chart integration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChart className="h-5 w-5 text-brand-600" />
                Service Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                <div className="text-center">
                  <PieChart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Service category chart</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-brand-600" />
                Platform Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">API Uptime</span><span className="text-sm font-semibold text-green-600">99.97%</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: "99.97%" }} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Auth Service</span><span className="text-sm font-semibold text-green-600">Healthy</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Database</span><span className="text-sm font-semibold text-green-600">Healthy</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Push Notifications</span><span className="text-sm font-semibold text-yellow-600">Degraded</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 rounded-full" style={{ width: "85%" }} /></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
