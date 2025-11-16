"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { apiCall } from "@/lib/api"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No reset token provided")
    }
  }, [token])

  const validatePassword = (pwd: string): string[] => {
    const validationErrors: string[] = []
    if (pwd.length < 8) validationErrors.push("Password must be at least 8 characters")
    if (!/[A-Z]/.test(pwd)) validationErrors.push("Password must contain at least one uppercase letter")
    if (!/[a-z]/.test(pwd)) validationErrors.push("Password must contain at least one lowercase letter")
    if (!/[0-9]/.test(pwd)) validationErrors.push("Password must contain at least one number")
    return validationErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setMessage("")

    // Validate passwords
    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"])
      return
    }

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setErrors(passwordErrors)
      return
    }

    if (!token) {
      setErrors(["Invalid reset token"])
      return
    }

    setLoading(true)

    try {
      const response = await apiCall(`/auth/reset-password/${token}`, {
        method: "PUT",
        body: JSON.stringify({ password }),
      })

      if (response.success) {
        setStatus("success")
        setMessage("Password reset successfully!")
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login?reset=true")
        }, 2000)
      } else {
        setStatus("error")
        setMessage(response.error?.message || "Failed to reset password")
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "Failed to reset password. The link may have expired.")
    } finally {
      setLoading(false)
    }
  }

  if (!token || (status === "error" && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
            <CardDescription>The password reset link is invalid or has expired</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {message || "This reset link is no longer valid. Please request a new password reset."}
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild>
                <Link href="/forgot-password">Request New Link</Link>
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Password Reset Successfully!</CardTitle>
            <CardDescription>You can now log in with your new password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm text-gray-600">Redirecting to login page...</p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium">Password must contain:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-orange-600 hover:text-orange-700 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
