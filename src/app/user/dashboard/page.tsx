import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"
import { decrypt } from "@/lib/crypto" // You already have this!

type TokenPayload = {
  sub: string
  email: string
  name: string
  exp: number
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const encryptedSession = (await cookieStore).get("session")?.value

  let name: string | null = null

  if (encryptedSession) {
    try {
      const sessionData = await decrypt(encryptedSession) as { token: string, expiresAt: string }
      
      if (sessionData.token) {
        const decoded: TokenPayload = jwtDecode(sessionData.token)
        name = decoded.name || "User"
      }
    } catch (error) {
      console.error("Failed to decode session token:", error)
      name = "User"
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        {name ? `Hello, ${name}! 👋` : "Loading..."}
      </h1>
    </div>
  )
}
