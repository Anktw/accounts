import { redirect } from "next/navigation"
import { getUserFromSession } from "@/lib/auth"
import { LogoutButton } from "@/components/logout-button"

export default async function DashboardPage() {
  const user = await getUserFromSession()

  if (!user) {
    redirect("/auth/user/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Auth System</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm">Welcome, {user.username}</p>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h2>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Username:</span> {user.username}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Account created:</span> {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
