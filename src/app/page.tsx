import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to dashboard for now; in production this could be a landing page
  redirect("/dashboard");
}
