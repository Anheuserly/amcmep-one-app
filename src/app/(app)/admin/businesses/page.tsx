"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Building2, Search, Filter, CheckCircle, XCircle, Eye, Edit3, Star, MapPin, ArrowLeft, ArrowRight, Users, ClipboardList
} from "lucide-react";
import type { Business } from "@/types";

const mockBusinesses: Business[] = [
  { $id: "b1", name: "Shree Ganesh Enterprises", slug: "shree-ganesh", description: "Complete MEP solutions for commercial and industrial clients", address: "45, 2nd Main, Industrial Area", city: "Bangalore", state: "Karnataka", pincode: "560058", phone: "080-12345678", email: "contact@sge.in", website: "https://sge.in", logo: "", categories: ["HVAC", "Fire Safety", "Electrical"], servicesEnabled: true, vendorEnabled: false, status: "active", ownerId: "u5", rating: 4.7, reviewCount: 124, createdAt: "2020-01-01" },
  { $id: "b2", name: "Agni Fire Safety", slug: "agni-fire", description: "Fire safety equipment and AMC services", address: "12, Fire Lane, Koramangala", city: "Bangalore", state: "Karnataka", pincode: "560034", phone: "080-23456789", email: "info@agni.in", website: "https://agni.in", logo: "", categories: ["Fire Safety"], servicesEnabled: true, vendorEnabled: true, status: "active", ownerId: "u2", rating: 4.9, reviewCount: 89, createdAt: "2019-06-15" },
  { $id: "b3", name: "CoolAir HVAC", slug: "coolair", description: "HVAC installation, maintenance, and repair", address: "78, AC Road, Whitefield", city: "Bangalore", state: "Karnataka", pincode: "560066", phone: "080-34567890", email: "support@coolair.in", website: "https://coolair.in", logo: "", categories: ["HVAC"], servicesEnabled: true, vendorEnabled: false, status: "active", ownerId: "u3", rating: 4.5, reviewCount: 67, createdAt: "2021-03-10" },
  { $id: "b4", name: "FlowPro Plumbing", slug: "flowpro", description: "Plumbing services and water solutions", address: "23, Pipe Street, JP Nagar", city: "Bangalore", state: "Karnataka", pincode: "560078", phone: "080-45678901", email: "hello@flowpro.in", website: "https://flowpro.in", logo: "", categories: ["Plumbing"], servicesEnabled: true, vendorEnabled: false, status: "pending", ownerId: "u6", rating: 4.2, reviewCount: 34, createdAt: "2023-08-20" },
  { $id: "b5", name: "PowerGen Services", slug: "powergen", description: "DG set sales, service, and AMC", address: "56, Generator Road, Peenya", city: "Bangalore", state: "Karnataka", pincode: "560058", phone: "080-56789012", email: "sales@powergen.in", website: "https://powergen.in", logo: "", categories: ["DG Set", "Electrical"], servicesEnabled: true, vendorEnabled: true, status: "active", ownerId: "u7", rating: 4.6, reviewCount: 45, createdAt: "2018-11-05" },
  { $id: "b6", name: "VoltTech Solutions", slug: "volttech", description: "Electrical panels and automation", address: "89, Circuit Road, Electronic City", city: "Bangalore", state: "Karnataka", pincode: "560100", phone: "080-67890123", email: "info@volttech.in", website: "https://volttech.in", logo: "", categories: ["Electrical"], servicesEnabled: true, vendorEnabled: false, status: "active", ownerId: "u8", rating: 4.3, reviewCount: 28, createdAt: "2022-05-18" },
  { $id: "b7", name: "SecureView Systems", slug: "secureview", description: "CCTV and security systems", address: "34, Camera Lane, Malleswaram", city: "Bangalore", state: "Karnataka", pincode: "560003", phone: "080-78901234", email: "support@secureview.in", website: "https://secureview.in", logo: "", categories: ["CCTV"], servicesEnabled: true, vendorEnabled: true, status: "pending", ownerId: "u9", rating: 4.1, reviewCount: 19, createdAt: "2023-12-01" },
  { $id: "b8", name: "AquaPure Water Systems", slug: "aquapure", description: "Water treatment and purification systems", address: "67, Water Lane, HSR Layout", city: "Bangalore", state: "Karnataka", pincode: "560102", phone: "080-89012345", email: "info@aquapure.in", website: "https://aquapure.in", logo: "", categories: ["Water"], servicesEnabled: true, vendorEnabled: false, status: "active", ownerId: "u10", rating: 4.4, reviewCount: 56, createdAt: "2021-09-15" },
  { $id: "b9", name: "LiftCare Elevators", slug: "liftcare", description: "Elevator maintenance and AMC", address: "11, Lift Road, MG Road", city: "Bangalore", state: "Karnataka", pincode: "560001", phone: "080-90123456", email: "service@liftcare.in", website: "https://liftcare.in", logo: "", categories: ["Elevator"], servicesEnabled: true, vendorEnabled: false, status: "inactive", ownerId: "u11", rating: 3.8, reviewCount: 12, createdAt: "2020-07-20" },
  { $id: "b10", name: "SolarMax Energy", slug: "solarmax", description: "Solar panel installation and maintenance", address: "99, Sun Road, Jayanagar", city: "Bangalore", state: "Karnataka", pincode: "560041", phone: "080-01234567", email: "sales@solarmax.in", website: "https://solarmax.in", logo: "", categories: ["Solar", "Electrical"], servicesEnabled: true, vendorEnabled: true, status: "pending", ownerId: "u12", rating: 4.8, reviewCount: 38, createdAt: "2022-11-10" },
];

const statusColors = { active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", inactive: "bg-red-100 text-red-700" };
const statusIcons = { active: CheckCircle, pending: Eye, inactive: XCircle };

export default function AdminBusinessesPage() {
  const [businesses] = useState<Business[]>(mockBusinesses);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "inactive">("all");

  const filtered = businesses.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    toast.success(`Business ${id} approved`);
  };

  const handleReject = (id: string) => {
    toast.success(`Business ${id} rejected`);
  };

  return (
    <RoleGuard allowedRoles={["administrator"]}>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-2">
          <a href="/admin" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><ArrowLeft className="h-5 w-5" /></a>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Management</h1>
            <p className="text-gray-500 mt-1">Approve, manage, and monitor all businesses</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search businesses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["all", "active", "pending", "inactive"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${statusFilter === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="md:col-span-2"><EmptyState icon={<Building2 className="h-12 w-12" />} title="No businesses found" description="Try adjusting your search or filters" /></div>
          ) : (
            filtered.map((b) => {
              const StatusIcon = statusIcons[b.status];
              return (
                <Card key={b.$id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{b.name}</h3>
                          <Badge className={statusColors[b.status]}><StatusIcon className="h-3 w-3 mr-1" />{b.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{b.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{b.city}</span>
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" />{b.rating} ({b.reviewCount})</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />Team</span>
                          <span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" />Requests</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {b.categories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      {b.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleApprove(b.$id)}><CheckCircle className="h-4 w-4 mr-1" />Approve</Button>
                          <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:bg-red-50" onClick={() => handleReject(b.$id)}><XCircle className="h-4 w-4 mr-1" />Reject</Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="ml-auto"><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost"><Edit3 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
