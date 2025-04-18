import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ detail: "Missing Email go back to sign up page" }, { status: 400 })
    }


    const response = await fetch(`${process.env.FAST_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
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
