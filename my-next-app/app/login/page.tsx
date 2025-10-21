"use client"

import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import React, { useState, useEffect} from "react"
import { handleUsers } from "@/lib/handleUser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginParameters } from "@/types/auth"

export default function loginPage (){

  const router = useRouter()
  const [form, setForm]= useState<loginParameters>({
    email: "",
    password: "",
    loading: false,
    error: null
  })  

  useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) router.push("/profile")
  }

  checkSession()
}, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
     setForm({...form,  [e.target.name] : e.target.value})
  }

  const handleLogin = async(e: React.FormEvent)=>{
    e.preventDefault()
    setForm((prev=>({
        ...prev, 
        loading: true, 
        error  : null
    })))

    const {error} = await supabase.auth.signInWithPassword({
        email : form.email,
        password : form.password,
    })

    if (error){
        setForm((prev) => ({
            ...prev, 
            loading: false, 
            error: error.message, 
        }))
    }
    else{
        await handleUsers()
        router.push("/profile")
    }
  }

  const handleGoogleLogin = async () => {
    setForm((prev) => ({ ...prev, loading: true, error: null }))

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://studious-space-couscous-v66g67ggpvjp3xvvv-3000.app.github.dev/auth/callback", 
      },
    })

    if (error) {
      setForm((prev) => ({ ...prev, loading: false, error: error.message }))
    }
  }


  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-[380px] shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-900">
            Welcome back 👋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => router.push("/reset-password")}
                  className="text-sm text-blue-600 hover:underline"
                  aria-label="Reset password"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              disabled={form.loading}
              type="submit"
              className="w-full mt-2"
            >
              {form.loading ? "Logging in..." : "Login"}
            </Button>

            <div className="relative my-2 text-center text-gray-500 text-sm">
              <span className="px-2 bg-white">or</span>
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gray-200"></div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={form.loading}
              variant="outline"
              className="w-full"
            >
              Continue with Google
            </Button>

            {form.error && (
              <p className="text-sm text-red-500 text-center mt-2">
                {form.error}
              </p>
            )}

            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-blue-600"
                onClick={() => router.push("/register")}
              >
                Sign up
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

