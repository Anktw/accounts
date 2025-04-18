import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"


export async function POST(request: Request) {
  try {
    const { username_or_email, password } = await request.json()

    if (!username_or_email || !password) {
      return NextResponse.json({ detail: "Missing email/username or password" }, { status: 400 })
    }

    const body = JSON.stringify({
      username_or_email,
      password,
    })

    const response = await fetch(`${process.env.FAST_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ detail: data.detail || "Authentication failed" }, { status: response.status })
    }

    const session = {
      token: data.access_token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    const encryptedSession = await encrypt(session)

    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: encryptedSession,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    })

    return NextResponse.json({ message: "Login successful" }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
