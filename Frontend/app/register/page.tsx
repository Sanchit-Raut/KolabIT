"use client"

import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Join KolabIT</h1>
          <p className="text-gray-600 mt-2">Start collaborating with your campus community today</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  )
}
