"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push("/user/dashboard");
  }, [router]);

  return (
    <div>
      <Skeleton className="w-[100px] h-[20px] rounded-full" />
    </div>
  )
}