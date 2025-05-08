"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchWithAuth } from "@/utils/fetchWithAuth"
import DashboardLoading from "../dashboard/loading"
import { Separator } from "@/components/ui/separator"

type User = {
  email: string
  username: string
  first_name?: string
  last_name?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      } catch (err) {
        setError("Unable to load user data")
        window.location.href = "/auth/user/login"
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!user) return
    setUser({ ...user, [field]: e.target.value })
  }

  const handleSave = async (field: string) => {
    if (!user) return
    setSaving(field)
    try {
      const res = await fetchWithAuth("/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
      if (!res.ok) throw new Error("Update failed")
      const updated = await res.json()
      setUser(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(null)
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
      <div className="max-w-2xl mx-auto mt-10">
        <DashboardLoading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <p className="mb-4">Unable to load user data. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    )
  }

  const getDisplayName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user.first_name || user.last_name || ""
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold mb-8">Account Settings</h1>

      {/* Display Name Section */}
      <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-2">Display Name</h2>
          <p className="text-zinc-400 mb-4">Please enter your full name, or a display name you are comfortable with.</p>
          <Input
            className="bg-black border-zinc-700 focus-visible:ring-zinc-500"
            value={getDisplayName()}
            onChange={(e) => {
              const names = e.target.value.split(" ")
              setUser({
                ...user,
                first_name: names[0] || "",
                last_name: names.slice(1).join(" ") || "",
              })
            }}
          />
        </div>
        <Separator className="bg-zinc-800" />
        <div className="p-4 flex justify-between items-center">
          <p className="text-sm text-zinc-400">Please use 32 characters at maximum.</p>
          <Button
            onClick={() => handleSave("name")}
            disabled={saving === "name"}
            className="bg-white text-black hover:bg-zinc-200"
          >
            {saving === "name" ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Username Section */}
      <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-2">Username</h2>
          <p className="text-zinc-400 mb-4">This is your URL namespace within the application.</p>
          <div className="flex">
            <div className="bg-zinc-900 text-zinc-400 px-3 flex items-center border border-r-0 border-zinc-700 rounded-l-md">
              yourapp.com/
            </div>
            <Input
              className="rounded-l-none bg-black border-zinc-700 focus-visible:ring-zinc-500"
              value={user.username}
              onChange={(e) => handleChange(e, "username")}
            />
          </div>
        </div>
        <Separator className="bg-zinc-800" />
        <div className="p-4 flex justify-between items-center">
          <p className="text-sm text-zinc-400">Please use 48 characters at maximum.</p>
          <Button
            onClick={() => handleSave("username")}
            disabled={saving === "username"}
            className="bg-white text-black hover:bg-zinc-200"
          >
            {saving === "username" ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-2">Email</h2>
          <p className="text-zinc-400 mb-4">Your email address is used for notifications and login.</p>
          <Input
            className="bg-black border-zinc-700 focus-visible:ring-zinc-500"
            type="email"
            value={user.email}
            onChange={(e) => handleChange(e, "email")}
          />
        </div>
        <Separator className="bg-zinc-800" />
        <div className="p-4 flex justify-between items-center">
          <p className="text-sm text-zinc-400">We'll send a verification email if changed.</p>
          <Button
            onClick={() => handleSave("email")}
            disabled={saving === "email"}
            className="bg-white text-black hover:bg-zinc-200"
          >
            {saving === "email" ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-4">
        <Button
          variant="outline"
          className="border-zinc-700 text-zinc-400 hover:bg-zinc-900 hover:text-white"
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
