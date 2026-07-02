"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Users, Search, Shield, UserCheck, UserX, Edit3, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, ArrowLeft
} from "lucide-react";
import type { UserRole } from "@/types";

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastActive: string;
}

const mockUsers: MockUser[] = [
  { id: "u1", name: "John Doe", email: "john@example.com", phone: "9876543210", roles: ["customer"], status: "active", createdAt: "2024-01-15", lastActive: "2024-03-20" },
  { id: "u2", name: "Rahul Kumar", email: "rahul@example.com", phone: "9876543211", roles: ["partner", "customer"], status: "active", createdAt: "2023-06-10", lastActive: "2024-03-20" },
  { id: "u3", name: "Vikram Singh", email: "vikram@example.com", phone: "9876543212", roles: ["partner"], status: "active", createdAt: "2023-08-22", lastActive: "2024-03-19" },
  { id: "u4", name: "Priya Sharma", email: "priya@example.com", phone: "9876543213", roles: ["customer", "vendor"], status: "active", createdAt: "2024-02-01", lastActive: "2024-03-18" },
  { id: "u5", name: "Amit Patel", email: "amit@example.com", phone: "9876543214", roles: ["administrator"], status: "active", createdAt: "2022-01-01", lastActive: "2024-03-20" },
  { id: "u6", name: "Sneha Gupta", email: "sneha@example.com", phone: "9876543215", roles: ["customer"], status: "pending", createdAt: "2024-03-15", lastActive: "2024-03-15" },
  { id: "u7", name: "Rajesh Nair", email: "rajesh@example.com", phone: "9876543216", roles: ["partner"], status: "suspended", createdAt: "2023-05-10", lastActive: "2024-02-28" },
  { id: "u8", name: "Divya Iyer", email: "divya@example.com", phone: "9876543217", roles: ["customer"], status: "active", createdAt: "2024-01-20", lastActive: "2024-03-19" },
  { id: "u9", name: "Karan Mehta", email: "karan@example.com", phone: "9876543218", roles: ["vendor"], status: "active", createdAt: "2023-11-15", lastActive: "2024-03-17" },
  { id: "u10", name: "Ananya Reddy", email: "ananya@example.com", phone: "9876543219", roles: ["customer", "partner"], status: "active", createdAt: "2024-02-28", lastActive: "2024-03-20" },
  { id: "u11", name: "Suresh Babu", email: "suresh@example.com", phone: "9876543220", roles: ["administrator"], status: "active", createdAt: "2022-03-01", lastActive: "2024-03-20" },
  { id: "u12", name: "Meena Kumari", email: "meena@example.com", phone: "9876543221", roles: ["customer"], status: "pending", createdAt: "2024-03-18", lastActive: "2024-03-18" },
  { id: "u13", name: "Deepak Sharma", email: "deepak@example.com", phone: "9876543222", roles: ["partner"], status: "active", createdAt: "2023-09-05", lastActive: "2024-03-19" },
  { id: "u14", name: "Lakshmi Menon", email: "lakshmi@example.com", phone: "9876543223", roles: ["customer"], status: "active", createdAt: "2024-01-10", lastActive: "2024-03-20" },
  { id: "u15", name: "Harish Rao", email: "harish@example.com", phone: "9876543224", roles: ["vendor", "partner"], status: "suspended", createdAt: "2023-07-20", lastActive: "2024-01-15" },
];

const statusColors = { active: "bg-green-100 text-green-700", suspended: "bg-red-100 text-red-700", pending: "bg-yellow-100 text-yellow-700" };
const roleTabColors = { all: "bg-gray-900 text-white", customer: "bg-green-600 text-white", partner: "bg-blue-600 text-white", administrator: "bg-red-600 text-white" };

export default function AdminUsersPage() {
  const [users] = useState<MockUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "partner" | "administrator">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "pending">("all");

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery);
    const matchesRole = roleFilter === "all" || u.roles.includes(roleFilter);
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspend = (id: string) => {
    toast.success(`User ${id} suspended`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      toast.success(`User ${id} deleted`);
    }
  };

  return (
    <RoleGuard allowedRoles={["administrator"]}>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-2">
          <a href="/admin" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><ArrowLeft className="h-5 w-5" /></a>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage and monitor all platform users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["all", "customer", "partner", "administrator"] as const).map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${roleFilter === r ? roleTabColors[r] : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}</button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["all", "active", "suspended", "pending"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${statusFilter === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Roles</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-8"><EmptyState icon={<Users className="h-12 w-12" />} title="No users found" description="Try adjusting your filters" /></td></tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4"><div className="flex items-center gap-2"><Avatar name={u.name} size="sm" /><span className="font-medium">{u.name}</span></div></td>
                      <td className="py-3 px-4"><div className="text-xs text-gray-500">{u.email}</div><div className="text-xs text-gray-400">{u.phone}</div></td>
                      <td className="py-3 px-4"><div className="flex gap-1">{u.roles.map((r) => (<Badge key={r} variant={r === "administrator" ? "danger" : r === "partner" ? "info" : "default"} className="text-xs">{r}</Badge>))}</div></td>
                      <td className="py-3 px-4"><Badge className={statusColors[u.status]}>{u.status}</Badge></td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(u.createdAt)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><Edit3 className="h-4 w-4" /></button>
                          <button className="p-1.5 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600 rounded" onClick={() => handleSuspend(u.id)}><UserX className="h-4 w-4" /></button>
                          <button className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filtered.length} of {users.length} users</span>
          <div className="flex gap-1">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-3 py-1 bg-brand-100 text-brand-700 rounded-lg font-medium">1</button>
            <button className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-lg">2</button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
