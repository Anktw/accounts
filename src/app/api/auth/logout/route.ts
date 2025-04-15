import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Delete the session cookie
    (await
      // Delete the session cookie
      cookies()).delete("session")

    // In a real app, you might also want to invalidate the session on the backend
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `session=${(await cookies()).get("session")?.value || ""}`,
      },
    }).catch((error) => {
      console.error("Error invalidating session on backend:", error)
    })

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
