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
  
    useEffect(() => {
      const cachedUsername = localStorage.getItem("cachedUsername")
      if (cachedUsername) {
        setUser((prev) => ({
          email: "",
          username: cachedUsername,
          first_name: "",
          last_name: "",
          ...prev,
        }))
      }
  
      async function load() {
        try {
          const res = await fetchWithAuth("/api/user/me")
          if (!res.ok) throw new Error("Not authorized")
          const data: User = await res.json()
          setUser(data)
          localStorage.setItem("cachedUsername", data.username)
        } catch {
        } finally {
          setLoading(false)
        }
      }
  
      load()
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
  

  if (loading) return <div><DashboardLoading /></div>
  if (!user) return <div>
    please refresh this page, Backend is in cold start mode, so it takes a while to load the page.
    <Button onClick={() => window.location.reload()} className="mt-4">Refresh</Button>
  </div>

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