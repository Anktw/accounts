import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export function ProfileSkeleton() {
  return (
    <div className="container max-w-xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Account Settings</CardTitle>
          </div>
          <CardDescription>Manage your account information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Email field skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>

              {/* Username field skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* First name and last name fields skeleton */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex justify-between pt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
