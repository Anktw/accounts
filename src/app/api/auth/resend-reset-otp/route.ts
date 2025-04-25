import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || body.email_or_username;
    if (!email) {
      return NextResponse.json({ detail: "Email is required" }, { status: 400 });
    }
    const backendRes = await fetch(`${process.env.FAST_URL}/auth/resend-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    let data: any = null;
    let isJSON = true;
    try {
      data = await backendRes.json();
    } catch {
      isJSON = false;
      data = await backendRes.text();
    }
    return NextResponse.json(
      typeof data === "object" ? data : { detail: data },
      { status: backendRes.status }
    );
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || "Internal server error" }, { status: 500 });
  }
}
