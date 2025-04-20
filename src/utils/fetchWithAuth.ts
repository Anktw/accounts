// utils/fetchWithAuth.ts
export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
    // always include cookies
    const opts = { credentials: "include" as RequestCredentials, ...init }
  
    // 1) try the original request
    let res = await fetch(input, opts)
  
    // 2) if we got a 401, try to refresh
    if (res.status === 401) {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",       // ← send session cookie here too
      })
  
      if (refreshRes.ok) {
        // 3) retry the original request
        res = await fetch(input, opts)
      } else {
        // refresh failed: force logout, redirect, etc
        throw new Error("Session expired")
      }
    }
  
    return res
  }
  