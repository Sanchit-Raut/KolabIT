"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to send reset email")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">Check Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            If an account exists with that email, we've sent a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <p className="text-xs text-gray-500">Didn't receive the email? Check your spam folder or try again.</p>
          </div>

          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Try Another Email
          </Button>

          <Link href="/login" className="block text-center text-orange-500 hover:text-orange-600 text-sm font-medium">
            Back to Sign In
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">Reset Password</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your email and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
