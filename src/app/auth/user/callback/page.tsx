"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SocialCallbackPage() {
  /*const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const access_token = searchParams.get("access_token")
    const refresh_token = searchParams.get("refresh_token")

    if (!access_token || !refresh_token) {
      router.push("/auth/user/login")
      return
    }

    async function handleSession() {
      const res = await fetch("/api/auth/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token, refresh_token }),
      })

      if (res.ok) {
        router.push("/user/dashboard")
      } else {
        console.error("Failed to set session")
        router.push("/auth/user/login")
      }
    }

    handleSession()
  }, [searchParams, router])*/

  return <p>Logging you in...</p>
}
