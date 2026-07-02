"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  ShieldCheck,
  Briefcase,
  Edit3,
  Camera,
  Copy,
  Check,
} from "lucide-react";

export default function ProfilePage() {
  const { profile, activeRole, roles } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState(profile?.name || "");

  const handleCopyReferral = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Referral code copied!");
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated");
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar
                src={profile?.avatar}
                name={profile?.name || "User"}
                size="xl"
              />
              <button className="absolute bottom-0 right-0 p-1.5 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-xs mx-auto sm:mx-0"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{profile?.name || "User"}</h1>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="primary">{activeRole}</Badge>
                {roles.length > 1 && (
                  <span className="text-xs text-gray-400">
                    +{roles.length - 1} more roles
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-500">{profile?.email || "Not set"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Phone</p>
              <p className="text-sm text-gray-500">{profile?.phone || "Not set"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Location</p>
              <p className="text-sm text-gray-500">India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Language</p>
              <p className="text-sm text-gray-500 capitalize">{profile?.preferredLanguage || "English"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral */}
      {profile?.referralCode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Referral Code</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-sm text-gray-700">
                {profile.referralCode}
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyReferral}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-3">
            {roles.map((role) => (
              <div
                key={role}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  role === activeRole
                    ? "border-brand-200 bg-brand-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                {role === "administrator" && <ShieldCheck className="h-5 w-5 text-brand-600" />}
                {role === "partner" && <Briefcase className="h-5 w-5 text-blue-600" />}
                {role === "customer" && <UserCircle className="h-5 w-5 text-green-600" />}
                {role === "guest" && <UserCircle className="h-5 w-5 text-gray-400" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">{role}</p>
                  <p className="text-xs text-gray-500">
                    {role === "administrator" && "Full platform access and business management"}
                    {role === "partner" && "Service provider and field technician access"}
                    {role === "customer" && "Service requests and AMC management"}
                    {role === "guest" && "Limited browsing access"}
                  </p>
                </div>
                {role === activeRole && (
                  <Badge variant="primary" size="sm">Active</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
