"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  fetchAllBusinesses,
  fetchAllUsers,
  fetchAmcRecords,
  fetchAssignments,
  fetchBusinesses,
  fetchChatSessions,
  fetchFeed,
  fetchRequests,
  toAmcRecord,
  toFeedPost,
  toPartnerAssignment,
  toServiceRequest,
  userIdentity,
} from "@/lib/services/appwriteServices";
import { formatDate, formatRelative } from "@/lib/utils";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  MessageCircle,
  Newspaper,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import type { AMCRecord, FeedPost, PartnerAssignment, ServiceRequest } from "@/types";

const actionCards = [
  { label: "Ask for service", description: "Create a repair or maintenance request", href: "/requests?action=create", icon: ClipboardList },
  { label: "Share an update", description: "Post to the AMC MEP community", href: "/feed", icon: Newspaper },
  { label: "Open messages", description: "Continue service conversations", href: "/chats", icon: MessageCircle },
  { label: "Explore market", description: "Find service businesses and products", href: "/marketplace", icon: ShoppingBag },
];

export default function HomePage() {
  const router = useRouter();
  const { profile, activeRole } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [amcs, setAmcs] = useState<AMCRecord[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [assignments, setAssignments] = useState<PartnerAssignment[]>([]);
  const [stats, setStats] = useState({
    unreadMessages: 0,
    businesses: 0,
    totalUsers: 0,
    totalBusinesses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = activeRole === "administrator";
  const isPartner = activeRole === "partner";
  const firstName = profile?.name?.split(" ")[0] || "there";

  useEffect(() => {
    let alive = true;
    async function loadHome() {
      setIsLoading(true);
      try {
        const identity = userIdentity(profile);
        const [requestDocs, amcDocs, chatDocs, feedDocs, businessDocs, assignmentDocs, allUsers, allBusinesses] = await Promise.all([
          fetchRequests({ ...identity, limit: 100 }),
          fetchAmcRecords({ ...identity, limit: 100 }),
          fetchChatSessions({ ...identity, limit: 100 }),
          fetchFeed({ limit: 6 }),
          profile?.userId ? fetchBusinesses({ ownerId: profile.userId, limit: 50 }) : Promise.resolve([]),
          profile?.userId ? fetchAssignments({ partnerId: profile.userId, limit: 100 }) : Promise.resolve([]),
          isAdmin ? fetchAllUsers({ limit: 500 }) : Promise.resolve([]),
          isAdmin ? fetchAllBusinesses({ limit: 500 }) : Promise.resolve([]),
        ]);
        if (!alive) return;
        setRequests(requestDocs.map(toServiceRequest));
        setAmcs(amcDocs.map(toAmcRecord));
        setPosts(feedDocs.map((doc) => toFeedPost(doc, profile?.userId)));
        setAssignments(assignmentDocs.map(toPartnerAssignment));
        setStats({
          unreadMessages: chatDocs.reduce((sum, chat) => sum + (Number(chat.unreadCount) || 0), 0),
          businesses: businessDocs.length,
          totalUsers: allUsers.length,
          totalBusinesses: allBusinesses.length,
        });
      } finally {
        if (alive) setIsLoading(false);
      }
    }
    loadHome();
    return () => {
      alive = false;
    };
  }, [isAdmin, profile]);

  const activeRequests = requests.filter((request) => request.status !== "completed" && request.status !== "cancelled");
  const activeAmc = amcs.filter((amc) => amc.status === "active" || amc.status === "expiring_soon");
  const assignedValue = assignments.reduce((sum, assignment) => sum + assignment.earnings, 0);
  const completedJobs = assignments.filter((assignment) => assignment.status === "completed").length;
  const nextVisit = useMemo(() => activeAmc.find((amc) => amc.nextVisitDate) || activeAmc[0], [activeAmc]);
  const latestRequests = activeRequests.slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  const homeStats = [
    { label: "Open requests", value: activeRequests.length, hint: requests.length ? `${requests.length} total` : "No requests yet", icon: ClipboardList },
    { label: "AMC care", value: activeAmc.length, hint: nextVisit?.nextVisitDate ? `Next visit ${formatDate(nextVisit.nextVisitDate)}` : "No visit scheduled", icon: ShieldCheck },
    { label: "Messages", value: stats.unreadMessages, hint: "Unread conversations", icon: MessageCircle },
    {
      label: isAdmin ? "Community reach" : isPartner ? "Service work" : "Network",
      value: isAdmin ? stats.totalUsers : isPartner ? completedJobs : latestPosts.length,
      hint: isAdmin ? `${stats.totalBusinesses} businesses connected` : isPartner ? `₹${assignedValue.toLocaleString("en-IN")} earned` : "Recent community posts",
      icon: isAdmin ? Users : isPartner ? Briefcase : HeartHandshake,
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_380px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-6">
            <div className="flex min-h-[300px] flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Home
                </div>
                <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Good to see you, {firstName}.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                  Follow your service community, keep requests moving, and stay close to the people and businesses you work with.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {actionCards.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => router.push(action.href)}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-blue-700 shadow-sm">
                      <action.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-slate-950">{action.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">{action.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[300px] overflow-hidden rounded-xl bg-slate-900 lg:block">
              <Image src="/amcmep-fire-fighting.jpg" alt="AMC MEP service network" fill className="object-cover" sizes="300px" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-xl bg-white/95 p-4 shadow-xl">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Today around you</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{activeRequests.length + activeAmc.length}</p>
                  <p className="mt-1 text-xs text-slate-500">active service and AMC items</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Live Pulse</h2>
                <p className="text-sm text-slate-500">A quick look at what needs attention</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/activity")}>
                Activity
              </Button>
            </div>
            <div className="grid gap-3">
              {homeStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-blue-700 shadow-sm">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">{stat.label}</p>
                    <p className="truncate text-xs text-slate-500">{stat.hint}</p>
                  </div>
                  <p className="text-xl font-black text-slate-950">{isLoading ? "..." : stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Community</h2>
                <p className="text-sm text-slate-500">Recent updates from your network</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/feed")}>
                Open feed
              </Button>
            </div>

            {latestPosts.length === 0 ? (
              <button onClick={() => router.push("/feed")} className="w-full rounded-xl border border-dashed border-slate-200 p-8 text-center hover:bg-slate-50">
                <Newspaper className="mx-auto h-9 w-9 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-700">No community updates yet.</p>
                <p className="mt-1 text-xs text-slate-500">Share the first update or check again later.</p>
              </button>
            ) : (
              <div className="space-y-3">
                {latestPosts.map((post) => (
                  <button key={post.$id} onClick={() => router.push("/feed")} className="w-full rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-100 hover:bg-blue-50/40">
                    <div className="flex items-center gap-3">
                      <Avatar src={post.authorAvatar} name={post.authorName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-950">{post.authorName}</p>
                        <p className="text-xs text-slate-400">{formatRelative(post.createdAt)}</p>
                      </div>
                    </div>
                    {post.content && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{post.content}</p>}
                    <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <span>{post.likes} likes</span>
                      <span>{post.commentsCount} comments</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Service Flow</h2>
                <p className="text-sm text-slate-500">Requests and AMC items to follow</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/requests")}>
                View
              </Button>
            </div>

            <div className="space-y-3">
              {latestRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                  <p className="mt-3 text-sm font-bold text-slate-800">Everything is calm.</p>
                  <p className="mt-1 text-xs text-slate-500">New service requests will appear here.</p>
                </div>
              ) : (
                latestRequests.map((request) => (
                  <button key={request.$id} onClick={() => router.push("/requests")} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-950">{request.title}</p>
                      <p className="truncate text-xs text-slate-500">{request.serviceType} · {request.siteAddress || "Location pending"}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                  </button>
                ))
              )}
            </div>

            {nextVisit && (
              <button onClick={() => router.push("/amc")} className="mt-4 w-full overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-left hover:bg-emerald-100">
                <p className="text-sm font-black text-emerald-950">AMC care</p>
                <p className="mt-1 text-xs leading-5 text-emerald-800">
                  {nextVisit.title || nextVisit.businessName || "Contract"} {nextVisit.nextVisitDate ? `has a visit on ${formatDate(nextVisit.nextVisitDate)}.` : "is active."}
                </p>
              </button>
            )}
          </CardContent>
        </Card>
      </section>

      {(isPartner || isAdmin) && (
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-950">Workspace Snapshot</h2>
                  <p className="text-sm text-slate-500">Business and field-work summary</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Businesses</p><p className="mt-1 text-xl font-black">{stats.businesses}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Value</p><p className="mt-1 text-xl font-black">₹{assignedValue.toLocaleString("en-IN")}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Done</p><p className="mt-1 text-xl font-black">{completedJobs}</p></div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-700">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-950">Network Snapshot</h2>
                    <p className="text-sm text-slate-500">Live platform records</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">People</p><p className="mt-1 text-xl font-black">{stats.totalUsers}</p></div>
                  <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Businesses</p><p className="mt-1 text-xl font-black">{stats.totalBusinesses}</p></div>
                  <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Requests</p><p className="mt-1 text-xl font-black">{requests.length}</p></div>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
