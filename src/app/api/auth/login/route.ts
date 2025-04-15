import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ detail: "Missing email or password" }, { status: 400 })
    }

    const formBody = new URLSearchParams({
      username: email,
      password,
    }).toString()

    const response = await fetch(`${process.env.FAST_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ detail: data.detail || "Authentication failed" }, { status: response.status })
    }

    const session = {
      token: data.access_token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
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
