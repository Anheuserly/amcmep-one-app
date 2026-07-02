"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import toast from "react-hot-toast";
import { ArrowLeft, Smartphone, ArrowRight } from "lucide-react";

export default function PhoneAuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    // TODO: Integrate MSG91 or Appwrite phone auth
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      toast.success("OTP sent to your phone");
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length < 4) {
      toast.error("Please enter the OTP");
      return;
    }
    setIsLoading(true);
    // TODO: Verify OTP via Appwrite
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Phone verified successfully!");
      router.push("/dashboard");
    }, 1500);
  };

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
          <Smartphone className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {step === "phone" ? "Phone Sign In" : "Verify OTP"}
        </h1>
        <p className="text-gray-500 mt-1">
          {step === "phone"
            ? "Enter your phone number to continue"
            : `Enter the OTP sent to +91 ${phone}`}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {step === "phone" ? (
            <div className="space-y-4">
              <Input
                label="Phone Number"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
              />
              <Button
                className="w-full"
                size="lg"
                isLoading={isLoading}
                onClick={handleSendOtp}
              >
                Send OTP
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="OTP"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
              />
              <Button
                className="w-full"
                size="lg"
                isLoading={isLoading}
                onClick={handleVerifyOtp}
              >
                Verify & Sign In
              </Button>
              <button
                onClick={() => setStep("phone")}
                className="w-full text-center text-sm text-brand-600 hover:text-brand-700"
              >
                Change phone number
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
