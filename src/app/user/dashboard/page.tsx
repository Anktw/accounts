"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { fetchWithAuth } from "@/utils/fetchWithAuth"
import DashboardLoading from "./loading"

type User = {
  email: string
  username: string
  first_name?: string
  last_name?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localUsername, setLocalUsername] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWithAuth("/api/user/me")
        if (!res.ok) {
          window.location.href = "/auth/user/login"
          return
        }
        const data: User = await res.json()
        setUser(data)
        setError(null)
        // Store username in localStorage if not already present
        if (data.username && localStorage.getItem("username") !== data.username) {
          localStorage.setItem("username", data.username)
          setLocalUsername(data.username)
        }
      } catch (err) {
        setError("Unable to load user data")
        window.location.href = "/auth/user/login"
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    // Get username from localStorage on mount
    const storedUsername = typeof window !== "undefined" ? localStorage.getItem("username") : null
    setLocalUsername(storedUsername)
  }, [])

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
      // Update username in localStorage if changed
      if (updated.username && localStorage.getItem("username") !== updated.username) {
        localStorage.setItem("username", updated.username)
        setLocalUsername(updated.username)
      }
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

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <DashboardLoading />
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
      {localUsername && (
        <div className="mb-4 text-gray-500">Hello, {localUsername}!</div>
      )}
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
            await fetch("/api/auth/logout", { method: "POST" })
            localStorage.removeItem("username")
            window.location.href = "/auth/user/login"
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}