"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function PhoneSignup() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [username, setUsername] = useState("")
  const [step, setStep] = useState<"phone" | "verification" | "username">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSendCode() {
    if (!phoneNumber) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/phone/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Failed to send verification code")
      }

      setStep("verification")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyCode() {
    if (!verificationCode) {
      setError("Please enter the verification code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/phone/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Invalid verification code")
      }

      // If this is a new user, ask for username
      if (data.isNewUser) {
        setStep("username")
      } else {
        // If existing user, redirect to dashboard
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCompleteSignup() {
    if (!username) {
      setError("Please enter a username")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/phone/complete-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, username }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Failed to complete signup")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === "phone" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">We'll send a verification code to this number</p>
          </div>
          <Button onClick={handleSendCode} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </>
      )}

      {step === "verification" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to {phoneNumber}</p>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-xs text-primary underline underline-offset-4"
              >
                Change number
              </button>
            </div>
          </div>
          <Button onClick={handleVerifyCode} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </>
      )}

      {step === "username" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="username">Choose a Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <Button onClick={handleCompleteSignup} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Complete Signup"
            )}
          </Button>
        </>
      )}
    </div>
  )
}
