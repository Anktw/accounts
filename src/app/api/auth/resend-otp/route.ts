import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ detail: "Missing Email go back to sign up page" }, { status: 400 })
    }


    const backendRes = await fetch(`${process.env.FAST_URL}/auth/resend-reset-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    let data: any = null;
    let isJSON = true;
    try {
      data = await backendRes.json();
    } catch {
      isJSON = false;
      data = await backendRes.text();
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        typeof data === "object" ? data : { detail: data || "Failed to resend OTP" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(
      typeof data === "object" ? data : { message: data || "OTP resent successfully" },
      { status: backendRes.status }
    );
    
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
