import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = cookies()
  ;(await cookieStore).set({
    name: "session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    domain: "*.unkit.site",
  })

  return new Response(JSON.stringify({ message: "Logged out" }), { status: 200 })
}
