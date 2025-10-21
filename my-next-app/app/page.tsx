"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-[340px] p-6">
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Card className="w-[380px] shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-900">
            Welcome to My Next.js App 🚀
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 text-center">
          {user ? (
            <>
              <p className="text-gray-700">
                Signed in as <span className="font-medium">{user.email}</span>
              </p>
              <Button
                onClick={() => router.push("/profile")}
                className="w-full"
              >
                Go to Profile
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.refresh()
                }}
                className="w-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-700">
                Please login or register to continue.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/register")}
                className="w-full"
              >
                Register
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
