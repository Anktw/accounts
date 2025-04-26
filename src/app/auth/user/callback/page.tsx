"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"
import { jwtDecode } from "jwt-decode"

export default function SocialCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function finalizeLogin() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) {
          throw new Error("Failed to get session")
        }

        const data = await res.json()
        const access_token = data.access_token
        const refresh_token = data.refresh_token

        const decoded: any = jwtDecode(access_token)

        const session = {
          token: access_token,
          refreshToken: refresh_token,
          userId: decoded.sub,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }

        const encryptedSession = await encrypt(session)

        const cookieStore = await cookies()
        cookieStore.set({
          name: "session",
          value: encryptedSession,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "lax",
        })

        router.push("/user/dashboard")
      } catch (error) {
        console.error("Social login error:", error)
        router.push("/login")
      }
    }

    finalizeLogin()
  }, [router])

  return <p>Finalizing login...</p>
}
