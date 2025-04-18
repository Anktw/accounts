"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { fetchWithAuth } from "@/utils/fetchWithAuth"

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

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetchWithAuth("/api/user/me")
      const data = await res.json()
      if (res.ok) setUser(data)
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch("/api/user/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    setSaving(false)
    if (res.ok) {
      alert("User info updated!")
    } else {
      const error = await res.json()
      alert(error.detail || "Update failed")
    }
  }

  if (loading || !user) return <div className="text-center mt-10">Loading...</div>

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
