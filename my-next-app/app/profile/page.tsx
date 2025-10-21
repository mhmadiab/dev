"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { useUser } from "@/hooks/useUser"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loadingUser } = useUser()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      if (loadingUser) return

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .single()

      if (!profileError) setUserData({ ...profile, email: user.email })
      setLoading(false)
    }

    loadUser()
  }, [user, loadingUser, router]) 

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loadingUser || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    )
  }

  if (!userData) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-[380px] shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">My Profile</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={userData.avatar_url} />
            <AvatarFallback>
              {userData.full_name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-lg font-medium text-gray-800">
            {userData.full_name || "Anonymous User"}
          </h2>
          <p className="text-sm text-gray-500">{userData.email}</p>
          <p className="text-xs text-gray-400">{userData.auth_id}</p>
        </CardContent>

        <CardFooter>
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            Log out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
