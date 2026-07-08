"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import toast from "react-hot-toast";
import { ArrowRight, Lock, Mail, QrCode, ShieldCheck, Smartphone } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, activeRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && activeRole !== "guest") router.replace("/");
  }, [activeRole, isAuthenticated, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Enter your email and password");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      router.replace("/");
    } catch (err: any) {
      toast.error(err.message || "Email or password is incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <img src="/amcmep-one-icon.png" alt="AMC MEP 24x7" className="h-11 w-11 rounded-2xl shadow-sm" />
        <div>
          <p className="text-sm font-semibold text-blue-700">AMC MEP 24x7 One</p>
          <h1 className="text-lg font-black text-slate-950">Account login</h1>
        </div>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/60">
        <CardContent className="p-6 sm:p-7">
          <div className="mb-6">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Welcome back</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Use your email account or approve this browser from your verified mobile app.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              icon={<Lock className="h-4 w-4" />}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg" isLoading={isLoading}>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="h-auto justify-start p-4 text-left" onClick={() => router.push("/qr-login")}>
              <QrCode className="h-5 w-5 text-blue-600" />
              <span>
                <span className="block text-sm font-bold">QR approval</span>
                <span className="block text-xs font-medium text-slate-500">Use mobile app</span>
              </span>
            </Button>
            <Button variant="outline" className="h-auto justify-start p-4 text-left" onClick={() => router.push("/phone-auth")}>
              <Smartphone className="h-5 w-5 text-slate-700" />
              <span>
                <span className="block text-sm font-bold">SIM profile</span>
                <span className="block text-xs font-medium text-slate-500">Mobile only</span>
              </span>
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 text-sm">
            <button onClick={() => router.push("/register")} className="font-semibold text-blue-700 hover:text-blue-800">
              Create account
            </button>
            <span className="text-slate-400">Password reset is handled by support.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
