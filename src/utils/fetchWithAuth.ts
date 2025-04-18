export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    let res = await fetch(input, init)
  
    if (res.status === 401) {
      // Try refreshing token
      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" })
  
      if (refreshRes.ok) {
        // Retry original request
        res = await fetch(input, init)
      }
    }
  
    return res
  }
  