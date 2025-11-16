"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function VerificationPendingPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("http://localhost:5000/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to resend verification email")
      }

      setSuccess(true)
      setEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Check Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            We've sent you a verification link to activate your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>You'll be redirected to login</li>
              <li>Start collaborating! 🚀</li>
            </ol>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Didn't receive the email?</h4>
            
            {success && (
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  Verification email sent! Check your inbox.
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleResendVerification} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="border-gray-300"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            </form>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already verified? </span>
            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
