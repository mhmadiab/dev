"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!error) setUser(data.user)
      setLoadingUser(false)
    }

    getUser()

    
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  return { user, loadingUser }
}
