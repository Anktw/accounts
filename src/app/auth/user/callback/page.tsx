"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SocialCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    async function handleCallback() {
      const access_token = searchParams.get("access_token");
      const refresh_token = searchParams.get("refresh_token");

      if (!access_token || !refresh_token) {
        setError("Missing tokens from social login");
        return;
      }

      try {
        const res = await fetch("/api/auth/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token, refresh_token }),
        });

        if (!res.ok) {
          throw new Error("Failed to save session");
        }

        // ✅ Redirect to dashboard
        router.push("/user/dashboard");
      } catch (err) {
        console.error("Social callback error:", err);
        setError("An error occurred while signing in");
      }
    }

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Setting up your session...</p>
    </div>
  );
}
