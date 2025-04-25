import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email_or_username = body.email || body.email_or_username;
    if (!email_or_username) {
      return NextResponse.json({ detail: "Email or username is required" }, { status: 400 });
    }
    const backendRes = await fetch(`${process.env.FAST_URL}/auth/request-password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_or_username })
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || "Internal server error" }, { status: 500 });
  }
}