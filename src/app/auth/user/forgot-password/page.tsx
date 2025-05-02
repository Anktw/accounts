"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"


export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resentMsg, setResentMsg] = useState("")

  async function handleRequestReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_or_username: email })
      })
      let data: any
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
        throw new Error(data || "Unexpected response from server")
      }
      if (!response.ok) {
        let detail = data.detail || data.msg || data.message || data
        if (typeof detail === "object") detail = JSON.stringify(detail)
        throw new Error(detail)
      }
      setSuccess("If your account exists, a password reset email has been sent.")
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
      })
      let data: any
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
        throw new Error(data || "Unexpected response from server")
      }
      if (!response.ok) {
        let detail = data.detail || data.msg || data.message || data
        if (typeof detail === "object") detail = JSON.stringify(detail)
        throw new Error(detail)
      }
      setResetToken(data.reset_token)
      setSuccess("OTP verified. You can now set a new password.")
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
    } finally {
      setIsLoading(false)
    }
  }
  async function handleResendOtp() {
    setIsLoading(true)
    setError("")
    setResentMsg("")
    try {
      const response = await fetch("/api/auth/resend-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      let data: any
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
        throw new Error(data || "Unexpected response from server")
      }
      if (!response.ok) {
        let detail = data.detail || data.msg || data.message || data
        if (typeof detail === "object") detail = JSON.stringify(detail)
        throw new Error(detail)
      }
      setResentMsg(data.msg || data.message || "A new OTP has been sent to your email.")
    } catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
    } finally {
      setIsLoading(false)
    }
  }
  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, new_password: newPassword })
      })
      let data: any
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
        throw new Error(data || "Unexpected response from server")
      }
      if (!response.ok) {
        let detail = data.detail || data.msg || data.message || data
        if (typeof detail === "object") detail = JSON.stringify(detail)
        throw new Error(detail)
      }
      setSuccess("Password updated successfully. You can now log in.")
      setTimeout(() => {
        router.push("/auth/user/login")
      }, 1500)
      setStep(1)
      setEmail("")
      setOtp("")
      setResetToken("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {step === 1 && "Enter your email or username to receive a reset OTP."}
            {step === 2 && `Enter the OTP sent to your email (${email}).`}
            {step === 3 && "Set your new password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Username</Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleResendOtp} disabled={isLoading}>
                Resend OTP
              </Button>
              {resentMsg && (
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{resentMsg}</AlertDescription>
                </Alert>
              )}
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/auth/user/login" className="text-primary underline underline-offset-4">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
