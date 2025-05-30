import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, new_password } = body;
    if (!token || !new_password) {
      return NextResponse.json({ detail: "Token and new_password are required" }, { status: 400 });
    }
    const backendRes = await fetch(`${process.env.FAST_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, new_password })
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
