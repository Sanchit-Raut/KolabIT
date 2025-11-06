"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function LoginForm() {
  const router = useRouter()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!email || !password) {
      setLocalError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed")
    }
  }

  const displayError = localError || error

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">Sign In</CardTitle>
        <CardDescription className="text-gray-600">Welcome back to KolabIT. Sign in to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="border-gray-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="border-gray-300"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/register" className="text-orange-500 hover:text-orange-600 font-medium">
              Sign up
            </Link>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="text-center text-sm">
            <Link href="/forgot-password" className="text-orange-500 hover:text-orange-600 font-medium">
              Forgot password?
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
