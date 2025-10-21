"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { handleUsers } from "@/lib/handleUser"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const completeSignIn = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await handleUsers() 
        router.push("/profile") 
      } else {
        router.push("/login")
      }
    }

    completeSignIn()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Signing you in...</p>
    </div>
  )
}
