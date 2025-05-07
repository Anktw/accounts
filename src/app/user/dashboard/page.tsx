"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { fetchWithAuth } from "@/utils/fetchWithAuth"
import { warmupApi } from "@/utils/warmupApi"
import DashboardLoading from "./loading"

type User = {
  email: string
  username: string
  first_name?: string
  last_name?: string
}

const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [warmingUp, setWarmingUp] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const cached = localStorage.getItem("cachedUsername")
    if (cached) {
      setUser({
        email: "",
        username: cached,
        first_name: "",
        last_name: "",
      })
    }

    async function load(retryAttempt = 0) {
      try {
        // First try to warm up the API
        if (!warmingUp) {
          setWarmingUp(true)
          await warmupApi()
          setWarmingUp(false)
        }

        const res = await fetchWithAuth("/api/user/me")
        if (!res.ok) {
          if (retryAttempt < MAX_RETRIES) {
            setTimeout(() => {
              setRetryCount(retryAttempt + 1)
              load(retryAttempt + 1)
            }, RETRY_DELAY)
            return
          }
          throw new Error("Not authorized")
        }
        const data: User = await res.json()
        // Only update user if we have new data
        if (data.username !== user?.username) {
          setUser(data)
          localStorage.setItem("cachedUsername", data.username)
        }
        setError(null)
      } catch (err) {
        if (retryAttempt < MAX_RETRIES) {
          setTimeout(() => {
            setRetryCount(retryAttempt + 1)
            load(retryAttempt + 1)
          }, RETRY_DELAY)
          return
        }
        setError("Unable to load user data. Please try again.")
        localStorage.removeItem("cachedUsername")
        window.location.href = "/auth/user/login"
      } finally {
        if (retryAttempt === MAX_RETRIES) {
          setLoading(false)
          setIsInitialLoad(false)
        }
      }
    }

    load()
  }, [retryCount, warmingUp])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const res = await fetchWithAuth("/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
      if (!res.ok) throw new Error("Update failed")
      const updated = await res.json()
      setUser(updated)
      alert("Profile updated!")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const redirect = sessionStorage.getItem("redirectAfterLogin")
    if (redirect) {
      sessionStorage.removeItem("redirectAfterLogin")
      window.location.href = redirect
    }
  }, [])

  if (loading && isInitialLoad) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <DashboardLoading />
        {warmingUp && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Warming up the backend...
          </p>
        )}
        {retryCount > 0 && !warmingUp && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Attempting to connect... (Attempt {retryCount}/{MAX_RETRIES})
          </p>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <p className="mb-4">Unable to load user data. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      <div className="grid gap-4">
        {["email", "username", "first_name", "last_name"].map((field) => (
          <div key={field}>
            <Label htmlFor={field}>{field.replace("_", " ").toUpperCase()}</Label>
            <Input
              id={field}
              name={field}
              value={(user as any)[field] || ""}
              onChange={handleChange}
              type={field === "email" ? "email" : "text"}
            />
          </div>
        ))}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Update"}
        </Button>
        <Button
          onClick={async () => {
            localStorage.removeItem("cachedUsername")
            await fetch("/api/auth/logout", { method: "POST" })
            window.location.href = "/auth/user/login"
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}