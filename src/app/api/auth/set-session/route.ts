import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"
import { jwtDecode } from "jwt-decode"

export async function POST(req: Request) {
    try {
        const { access_token, refresh_token } = await req.json();
        if (!access_token) {
            return new Response(JSON.stringify({ detail: "Missing token" }), { status: 400 })
        }

        const decoded: any = jwtDecode(access_token)

        const session = {
            token: access_token,
            refreshToken: refresh_token,
            userId: decoded.sub,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }

        const encrypted = await encrypt(session)

        const cookieStore = await cookies()
        cookieStore.set({
            name: "session",
            value: encrypted,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
            sameSite: "lax",
        })

        return new Response(JSON.stringify({ message: "Session set" }), { status: 200 })
    } catch (err) {
        console.error("Session set error:", err)
        return new Response(JSON.stringify({ detail: "Internal server error" }), { status: 500 })
    }
}
