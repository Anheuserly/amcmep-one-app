"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import toast from "react-hot-toast";
import {
  Briefcase, Building2, Users, CheckCircle, XCircle, Star, MapPin, Wrench, TrendingUp, Plus, Trash2, Edit3, Search, Filter, ArrowRight, Award, IndianRupee, Clock, UserCheck
} from "lucide-react";
import type { Business, PartnerProfile, PartnerAssignment, WorkspaceMembership } from "@/types";

const mockBusinesses: Business[] = [
  { $id: "biz1", name: "Shree Ganesh Enterprises", slug: "shree-ganesh", description: "Complete MEP solutions for commercial and industrial clients", address: "45, 2nd Main, Industrial Area", city: "Bangalore", state: "Karnataka", pincode: "560058", phone: "080-12345678", email: "contact@sge.in", website: "https://sge.in", logo: "", categories: ["HVAC", "Fire Safety", "Electrical"], servicesEnabled: true, vendorEnabled: false, status: "active", ownerId: "user1", rating: 4.7, reviewCount: 124, createdAt: "2020-01-01" },
];

const mockMemberships: WorkspaceMembership[] = [
  { $id: "m1", businessId: "biz1", userId: "user1", role: "owner", permissions: ["manage_business", "manage_members", "manage_requests", "receive_service_work"], joinedAt: "2020-01-01" },
  { $id: "m2", businessId: "biz1", userId: "user2", role: "partner", permissions: ["receive_service_work", "business_chat"], joinedAt: "2023-03-15" },
  { $id: "m3", businessId: "biz1", userId: "user3", role: "partner", permissions: ["receive_service_work", "business_chat"], joinedAt: "2023-06-20" },
  { $id: "m4", businessId: "biz1", userId: "user4", role: "staff", permissions: ["business_chat", "manage_requests"], joinedAt: "2024-01-10" },
];

const mockPartnerProfile: PartnerProfile = {
  $id: "p1", userId: "user2", skills: ["HVAC", "Electrical", "Plumbing"], serviceAreas: ["Bangalore", "Whitefield", "Electronic City"], partnerType: "service", status: "active", earnings: 245000, rating: 4.8, completedJobs: 142, createdAt: "2022-01-01"
};

const mockAssignments: PartnerAssignment[] = [
  { $id: "a1", partnerId: "user2", requestId: "req1", businessId: "biz1", status: "in_progress", earnings: 5000, assignedAt: "2024-03-01", completedAt: undefined },
  { $id: "a2", partnerId: "user2", requestId: "req2", businessId: "biz1", status: "completed", earnings: 3500, assignedAt: "2024-02-15", completedAt: "2024-02-18" },
  { $id: "a3", partnerId: "user2", requestId: "req3", businessId: "biz1", status: "completed", earnings: 8000, assignedAt: "2024-01-20", completedAt: "2024-01-25" },
];

const roleBadgeColors = { owner: "bg-red-100 text-red-700", admin: "bg-orange-100 text-orange-700", partner: "bg-blue-100 text-blue-700", staff: "bg-gray-100 text-gray-700" };
const assignmentStatusColors = { assigned: "bg-yellow-100 text-yellow-700", in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

export default function WorkspacePage() {
  const { activeRole, profile } = useAuth();
  const isAdmin = activeRole === "administrator";
  const isPartner = activeRole === "partner";
  const [business] = useState<Business | undefined>(mockBusinesses[0]);
  const [memberships] = useState<WorkspaceMembership[]>(mockMemberships);
  const [partnerProfile] = useState<PartnerProfile | undefined>(mockPartnerProfile);
  const [assignments] = useState<PartnerAssignment[]>(mockAssignments);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinForm, setJoinForm] = useState({ skills: "", serviceAreas: "", partnerType: "service" as const });

  const handleJoinProgram = () => {
    if (!joinForm.skills || !joinForm.serviceAreas) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Partner program application submitted!");
    setShowJoinModal(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
        <p className="text-gray-500 mt-1">
          {isAdmin && "Manage your business, team, and incoming work"}
          {isPartner && "Your partner profile, assignments, and earnings"}
          {!isAdmin && !isPartner && "Join our partner program to start earning"}
        </p>
      </div>

      {/* ADMIN VIEW */}
      {isAdmin && business && (
        <>
          {/* Business Profile */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-20 w-20 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-10 w-10 text-brand-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{business.name}</h2>
                  <p className="text-gray-500 text-sm">{business.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{business.city}, {business.state}</span>
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" />{business.rating} ({business.reviewCount} reviews)</span>
                    <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" />{business.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {business.categories.map((cat) => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Edit3 className="h-4 w-4 mr-1" />Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-brand-600" />
                Team ({memberships.length} members)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Member</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Role</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Permissions</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Joined</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map((m) => (
                      <tr key={m.$id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Avatar name={`User ${m.userId.slice(-1)}`} size="sm" />
                            <span className="font-medium">User {m.userId.slice(-1)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2"><Badge className={roleBadgeColors[m.role]}>{m.role}</Badge></td>
                        <td className="py-3 px-2"><span className="text-xs text-gray-500">{m.permissions.length} permissions</span></td>
                        <td className="py-3 px-2 text-gray-500">{new Date(m.joinedAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2 text-right">
                          {m.role !== "owner" && (
                            <button className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4" size="sm"><Plus className="h-4 w-4 mr-2" />Add Member</Button>
            </CardContent>
          </Card>

          {/* Incoming Work */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-brand-600" />
                Incoming Work Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">HVAC Annual Maintenance</p>
                    <p className="text-xs text-gray-500">Tech Park, Bangalore • High Priority</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4 mr-1" />Accept</Button>
                    <Button size="sm" variant="ghost"><ArrowRight className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Fire Extinguisher Refill</p>
                    <p className="text-xs text-gray-500">Warehouse B, Industrial Area • Medium Priority</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4 mr-1" />Accept</Button>
                    <Button size="sm" variant="ghost"><ArrowRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-brand-600" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-2xl font-bold text-gray-900">₹4.2L</p><p className="text-xs text-gray-500 mt-1">This Month</p></div>
                <div><p className="text-2xl font-bold text-gray-900">₹38L</p><p className="text-xs text-gray-500 mt-1">This Year</p></div>
                <div><p className="text-2xl font-bold text-gray-900">142</p><p className="text-xs text-gray-500 mt-1">Jobs Completed</p></div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* PARTNER VIEW */}
      {isPartner && partnerProfile && (
        <>
          {/* Partner Profile */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-20 w-20 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wrench className="h-10 w-10 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{profile?.name || "Partner"}</h2>
                  <p className="text-gray-500 text-sm">{partnerProfile.partnerType} partner • {partnerProfile.status}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" />{partnerProfile.rating} rating</span>
                    <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" />{partnerProfile.completedJobs} jobs</span>
                    <span className="flex items-center gap-1"><IndianRupee className="h-4 w-4 text-brand-600" />{partnerProfile.earnings.toLocaleString("en-IN")} earned</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {partnerProfile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-brand-600" />
                Active Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {assignments.filter((a) => a.status === "in_progress").map((a) => (
                  <div key={a.$id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Request #{a.requestId}</p>
                      <p className="text-xs text-gray-500">Assigned: {new Date(a.assignedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-brand-600">₹{a.earnings.toLocaleString("en-IN")}</span>
                      <Badge className={assignmentStatusColors[a.status]}>{a.status}</Badge>
                    </div>
                  </div>
                ))}
                {assignments.filter((a) => a.status === "in_progress").length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No active assignments</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Completed Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {assignments.filter((a) => a.status === "completed").map((a) => (
                  <div key={a.$id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Request #{a.requestId}</p>
                      <p className="text-xs text-gray-500">Completed: {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-green-700">₹{a.earnings.toLocaleString("en-IN")}</span>
                      <Badge className={assignmentStatusColors[a.status]}>{a.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* CUSTOMER / GUEST VIEW - Join Partner Program */}
      {!isAdmin && !isPartner && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-brand-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Join the Partner Program</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Are you a skilled technician, service provider, or vendor? Join our partner network to get access to service requests, earn income, and grow your business.
            </p>
            <Button size="lg" onClick={() => setShowJoinModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b"><h2 className="text-lg font-bold">Join Partner Program</h2><button onClick={() => setShowJoinModal(false)}><X className="h-5 w-5" /></button></div>
            <div className="p-4 space-y-4">
              <Input label="Skills" placeholder="e.g., HVAC, Electrical, Plumbing, Fire Safety" value={joinForm.skills} onChange={(e) => setJoinForm({ ...joinForm, skills: e.target.value })} />
              <Input label="Service Areas" placeholder="e.g., Bangalore, Whitefield, Electronic City" value={joinForm.serviceAreas} onChange={(e) => setJoinForm({ ...joinForm, serviceAreas: e.target.value })} />
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Partner Type</label><select className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={joinForm.partnerType} onChange={(e) => setJoinForm({ ...joinForm, partnerType: e.target.value as any })}><option value="service">Service Partner</option><option value="vendor">Vendor Partner</option><option value="both">Hybrid (Both)</option></select></div>
              <div className="flex gap-2 pt-2"><Button variant="outline" className="flex-1" onClick={() => setShowJoinModal(false)}>Cancel</Button><Button className="flex-1" onClick={handleJoinProgram}>Submit Application</Button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
