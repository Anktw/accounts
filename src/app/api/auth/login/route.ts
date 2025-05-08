import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"
import { jwtDecode } from "jwt-decode"

export async function POST(request: Request) {
  try {
    const { username_or_email, password } = await request.json()

    if (!username_or_email || !password) {
      return NextResponse.json({ detail: "Missing email/username or password" }, { status: 400 })
    }

    const body = JSON.stringify({ username_or_email, password })

    const response = await fetch(`${process.env.FAST_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : {}

    if (!response.ok) {
      return NextResponse.json({ detail: data.detail || "Authentication failed" }, { status: response.status })
    }

    const access_token = data.access_token
    const refresh_token = data.refresh_token
    const decoded: any = jwtDecode(access_token)

    const session = {
      token: access_token,
      refreshToken: refresh_token,
      userId: decoded.sub,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days

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
      domain: "unkit.site",
    })
    // Set the username in localStorage (if needed)(i am doing this for slow backend response)
    localStorage.setItem("username", data.username)

    return NextResponse.json({ message: "Login successful" }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
