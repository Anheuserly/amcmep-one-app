import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AMC MEP 24x7 — One App",
  description: "Unified platform for AMC MEP services. Customers, partners, and administrators — all in one place.",
  keywords: ["AMC", "MEP", "HVAC", "fire safety", "maintenance", "services"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
