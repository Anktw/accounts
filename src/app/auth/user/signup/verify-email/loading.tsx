import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-4 w-32 mx-auto mb-6" />
            <Skeleton className="h-10 w-full mb-4" />

            <div className="mt-4 text-center">
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Skeleton className="h-4 w-32" />
        </CardFooter>
      </Card>
    </div>
  )
}
