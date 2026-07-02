"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import toast from "react-hot-toast";
import { ArrowLeft, QrCode, Scan, Check, Loader2 } from "lucide-react";

export default function QrLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"generate" | "scan">("generate");
  const [qrCode, setQrCode] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "generate") {
      // Generate a random QR code string
      const token = Math.random().toString(36).substring(2, 15);
      setQrCode(token);
      // Simulate polling for approval
      const timer = setTimeout(() => {
        setIsApproved(true);
        toast.success("Login approved from another device!");
        setTimeout(() => router.push("/dashboard"), 1500);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [mode, router]);

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>

      <div className="text-center mb-8">
        <div className="h-12 w-12 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">QR Device Login</h1>
        <p className="text-gray-500 mt-1">
          {mode === "generate"
            ? "Scan this code with another device"
            : "Scan a QR code to approve login"}
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode("generate")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            mode === "generate" ? "bg-brand-100 text-brand-700" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Generate QR
        </button>
        <button
          onClick={() => setMode("scan")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            mode === "scan" ? "bg-brand-100 text-brand-700" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Scan QR
        </button>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          {mode === "generate" ? (
            <div className="space-y-4 text-center">
              {isApproved ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-semibold text-green-700">Login Approved!</p>
                  <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                </div>
              ) : (
                <>
                  <div className="h-48 w-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Code: {qrCode}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Waiting for approval from another device...
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-center w-full">
              <div className="h-48 w-full bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Scan className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Camera access required to scan QR codes</p>
                </div>
              </div>
              <Button className="w-full" isLoading={isLoading}>
                Open Camera
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
