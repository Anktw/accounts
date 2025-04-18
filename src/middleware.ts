import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/crypto";

const protectedRoutes = [ "/user/dashboard"];
const publicAuthRoutes = ["/auth/user/login", "/auth/user/signup", "/auth/user/signup/verify-email"];

export async function middleware(request: NextRequest) {
  let path = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  const sessionCookie = request.cookies.get("session")?.value;
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const sessionData = await decrypt(sessionCookie);
      if (sessionData?.userId && sessionData?.expiresAt) {
        isAuthenticated = new Date(sessionData.expiresAt) > new Date();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Session decryption error:", error);
      }
    }
  }

  if (protectedRoutes.some((route) => path.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/auth/user/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (publicAuthRoutes.includes(path) && isAuthenticated) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|.*\\..*).*)",
  ],
};
