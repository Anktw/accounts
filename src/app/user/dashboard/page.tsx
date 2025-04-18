import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"

type TokenPayload = {
  sub: string  // User ID
  email: string
  name: string
  exp: number
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const session = (await cookieStore).get("session")?.value

  let name: string | null = null
  if (session) {
    try {
      const decoded: TokenPayload = jwtDecode(session)
      name = decoded.name || "User"
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
};
