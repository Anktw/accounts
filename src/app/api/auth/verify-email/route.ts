import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, otp, timezone } = await request.json()

    if (!otp) {
      return NextResponse.json({ detail: "Please Enter OTP" }, { status: 400 })
    }

    const response = await fetch(`${process.env.FAST_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, timezone }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ detail: data.detail || "Verification failed" }, { status: response.status })
    }

    // ✅ Return the token so client can store session
    return NextResponse.json({ access_token: data.access_token }, { status: 200 })
  } catch (error) {
    console.error("Verify email route error:", error)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
