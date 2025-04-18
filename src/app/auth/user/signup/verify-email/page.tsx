"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function VerifyEmailFunction() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [remainingTime, setRemainingTime] = useState(600);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, timezone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Verification failed");

      const token = data.access_token;
      if (!token) throw new Error("No token received");

      // Securely set encrypted cookie
      const cookieRes = await fetch("/api/auth/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });

      if (!cookieRes.ok) throw new Error("Failed to save session");

      router.push("/user/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Resend failed");

      setCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Invalid request. No email provided.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            I’ve sent a verification code to <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <p className="text-xs text-center text-muted-foreground">
                {remainingTime > 0
                  ? `Code expires in ${formatTime(remainingTime)}`
                  : `Code expired. Please request a new one.`}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" onClick={handleResend} disabled={cooldown > 0 || isResending}>
              {isResending
                ? "Resending..."
                : cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Resend OTP"}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          <Link href="/auth/user/signup" className="text-primary underline underline-offset-4">
            Back to Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <VerifyEmailFunction />
    </Suspense>
  )
}