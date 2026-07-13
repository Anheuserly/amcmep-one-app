"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, Calendar, CheckCircle2, ClipboardList, Loader2, MapPin } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { fetchBusinessRequests, fetchMembershipsForUser, toServiceRequest } from "@/lib/services/appwriteServices";
import type { ServiceRequest } from "@/types";

const workspaceUrl = process.env.NEXT_PUBLIC_WORKSPACE_URL || "https://workspace.amcmep.in";

export default function WorkPage() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!profile?.userId) return;
      setLoading(true);
      try {
        const memberships = await fetchMembershipsForUser(profile.userId);
        const businessIds = Array.from(new Set([...(profile.businessIds || []), ...memberships.map((item) => (item as any).businessId?.toString() || "")].filter(Boolean)));
        const rows = await Promise.all(businessIds.map((businessId) => fetchBusinessRequests(businessId)));
        const merged = new Map(rows.flat().map((row) => [row.$id, toServiceRequest(row)]));
        if (alive) setRequests(Array.from(merged.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [profile?.businessIds, profile?.userId]);

  const active = useMemo(() => requests.filter((request) => request.status === "open" || request.status === "in_progress" || request.status === "awaiting_payment"), [requests]);
  const completed = requests.filter((request) => request.status === "completed").length;

  return <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-bold uppercase text-blue-600">Work</p><h1 className="mt-2 text-3xl font-black text-slate-950">Requests that need attention</h1><p className="mt-2 text-sm text-slate-600">Assigned service work from every business connected to your account.</p></div>
      <a href={workspaceUrl} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">Open workspace <ArrowUpRight size={17} /></a>
    </header>

    <section className="grid gap-3 sm:grid-cols-3">
      <Metric label="Needs action" value={active.length} icon={ClipboardList} tone="blue" />
      <Metric label="In progress" value={requests.filter((item) => item.status === "in_progress").length} icon={BriefcaseBusiness} tone="amber" />
      <Metric label="Completed" value={completed} icon={CheckCircle2} tone="green" />
    </section>

    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-950">Active requests</h2><p className="mt-1 text-xs text-slate-500">Only work connected to your business memberships is shown.</p></div>
      {loading ? <div className="grid min-h-52 place-items-center"><Loader2 className="size-6 animate-spin text-blue-600" /></div> : active.length ? <div className="divide-y divide-slate-100">{active.map((request) => <article key={request.$id} className="grid gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_150px_120px] sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-bold text-slate-950">{request.title}</h3><Status value={request.status} /></div><p className="mt-1 line-clamp-1 text-xs text-slate-500">{request.description}</p><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} /> {request.siteAddress || "Location not added"}</p></div><p className="text-xs font-semibold text-slate-600">{request.serviceType}</p><p className="flex items-center gap-1 text-xs text-slate-500"><Calendar size={13} /> {new Date(request.createdAt).toLocaleDateString("en-IN")}</p></article>)}</div> : <div className="px-6 py-16 text-center"><CheckCircle2 className="mx-auto text-emerald-500" size={30} /><h2 className="mt-4 font-bold text-slate-900">No work needs attention</h2><p className="mt-2 text-sm text-slate-500">New assigned requests will appear here automatically.</p></div>}
    </section>
  </div>;
}

function Metric({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof ClipboardList; tone: "blue" | "amber" | "green" }) { const tones={blue:"bg-blue-50 text-blue-600",amber:"bg-amber-50 text-amber-600",green:"bg-emerald-50 text-emerald-600"}; return <article className="rounded-lg border border-slate-200 bg-white p-4"><div className={`grid size-9 place-items-center rounded-md ${tones[tone]}`}><Icon size={17} /></div><p className="mt-4 text-2xl font-black text-slate-950">{value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></article>; }
function Status({ value }: { value: ServiceRequest["status"] }) { return <span className={`rounded-full px-2 py-1 text-[11px] font-bold capitalize ${value === "in_progress" ? "bg-blue-50 text-blue-700" : value === "awaiting_payment" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"}`}>{value.replaceAll("_", " ")}</span>; }
