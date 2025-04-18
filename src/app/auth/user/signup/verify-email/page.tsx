"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { setCookie } from "nookies";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [remainingTime, setRemainingTime] = useState(600) // 10 minutes

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (remainingTime <= 0) return

    const timer = setTimeout(() => {
      setRemainingTime((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [remainingTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const timezone = (() => {
        try {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (error) {
          console.error("Failed to detect timezone:", error);
          return "UTC";
        }
      })();

      const res: Response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, timezone }),
      });

      const data: { access_token: string; detail?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Verification failed");
      }

      const accessToken = data.access_token;

      if (accessToken) {
        // Save token for 30 days
        setCookie(null, "session", accessToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Redirect to dashboard
        router.push("/user/dashboard");
      }
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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

      if (!res.ok) {
        throw new Error(data.detail || "Resend failed");
      }

      setCooldown(30); // 30s cooldown
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsVerifying(false);
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
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>

          <CardTitle className="text-2xl text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            {email ? (
              <>
                I have sent a verification code to <span className="font-medium">{email}</span>
              </>
            ) : (
              "Enter the verification code sent to your email"
            )}
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
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {remainingTime > 0 && (
                <p className="text-xs text-muted-foreground text-center">Code expires in {formatTime(remainingTime)}</p>
              )}
              {remainingTime <= 0 && (
                <p className="text-xs text-destructive text-center">Code expired. Please request a new one.</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="p-0"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : cooldown > 0 ? (
                `Resend OTP in ${cooldown}s`
              ) : (
                "Resend OTP"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <Link href="./" className="text-primary underline underline-offset-4">
              Back to Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
