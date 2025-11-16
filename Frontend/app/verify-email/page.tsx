"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { apiCall } from "@/lib/api"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await apiCall(`/auth/verify-email/${token}`, {
          method: "GET",
        })

        if (response.success) {
          setStatus("success")
          setMessage(response.data?.message || "Email verified successfully!")
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login?verified=true")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(response.error?.message || "Verification failed")
        }
      } catch (error: any) {
        setStatus("error")
        setMessage(error.message || "Verification failed. The link may have expired.")
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            {status === "loading" && <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />}
            {status === "success" && <CheckCircle2 className="h-8 w-8 text-green-500" />}
            {status === "error" && <XCircle className="h-8 w-8 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying Your Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email address..."}
            {status === "success" && "Your account is now active"}
            {status === "error" && "We couldn't verify your email"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === "loading" && (
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Verifying your email address...
              </AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {message}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2 text-center text-sm text-gray-600">
                <p>You can now log in to your account and start exploring KolabIT!</p>
                <p className="text-xs">Redirecting to login page...</p>
              </div>

              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                asChild
              >
                <Link href="/login">
                  Go to Login
                </Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2 text-center text-sm text-gray-600">
                <p>The verification link may have expired or is invalid.</p>
                <p>Please try registering again or contact support.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  asChild
                >
                  <Link href="/register">
                    Register Again
                  </Link>
                </Button>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  asChild
                >
                  <Link href="/login">
                    Go to Login
                  </Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
