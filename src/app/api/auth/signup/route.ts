import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ detail: "Missing required fields" }, { status: 400 })
    }


    const response = await fetch(`${process.env.FAST_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
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
