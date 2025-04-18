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
      return NextResponse.json({ detail: data.detail || "Registration failed" }, { status: response.status })
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
