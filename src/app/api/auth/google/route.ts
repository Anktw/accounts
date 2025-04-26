// This route redirects the user to the backend's Google login endpoint
import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.FAST_URL;
  return NextResponse.redirect(`${backendUrl}/api/auth/google`);
}
