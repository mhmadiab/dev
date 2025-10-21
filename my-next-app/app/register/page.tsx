"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { handleUsers } from "@/lib/handleUser"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { SignUpParameters } from "@/types/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<SignUpParameters>({
    email: "",
    password: "",
    loading: false,
    error: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setForm((prev) => ({ ...prev, error: null, loading: true }))

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setForm((prev) => ({ ...prev, error: error.message, loading: false }))
    } else {
      await handleUsers()
      alert("Check your email for the confirmation link!")
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-[380px] shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-900">
            Create an Account
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSignUp}>
          <CardContent className="flex flex-col gap-4">
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {form.error && (
              <p className="text-red-500 text-sm text-center">{form.error}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={form.loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {form.loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
