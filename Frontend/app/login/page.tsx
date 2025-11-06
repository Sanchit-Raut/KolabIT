"use client"

import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">KolabIT</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Continue your campus collaboration journey</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-600 mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-orange-500 hover:text-orange-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-orange-500 hover:text-orange-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
