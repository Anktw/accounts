import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decrypt } from "./crypto"

export type User = {
  id: string
  username: string
  email: string
  created_at: string
}

// This function would verify the session cookie and return the user data
export async function getUserFromSession(): Promise<User | null> {
  const cookieStore = cookies()
  const sessionCookie = (await cookieStore).get("session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const sessionData = await decrypt(sessionCookie.value)

    if (!sessionData?.userId) {
      return null
    }

    // Fetch user data from API
    const response = await fetch(`${process.env.FAST_URL}/users/${sessionData.userId}`, {
      headers: {
        Cookie: `session=${sessionCookie.value}`,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

// Middleware-like function to protect routes
export async function requireAuth() {
  const user = await getUserFromSession()

  if (!user) {
    redirect("/login")
  }

  return user
}
