"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, Bell, LogOut } from "lucide-react"

export function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">KolabIT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link href="/projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors">
                Resources
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-gray-900 transition-colors">
                Community
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">
                Explore
              </Link>
              <Link href="/projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors">
                Resources
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-gray-900 transition-colors">
                Community
              </Link>
            </>
          )}
        </nav>

        {/* Right Side - Auth or User Menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:flex hidden">
                <Bell className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="hidden sm:flex items-center space-x-2">
                <Link href={`/profile/${user?.id}`}>
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                    {user?.firstName}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              {/* Mobile user menu icon */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hidden sm:flex">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link href="/dashboard" className="block text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/projects" className="block text-gray-600 hover:text-gray-900">
              Projects
            </Link>
            <Link href="/resources" className="block text-gray-600 hover:text-gray-900">
              Resources
            </Link>
            <Link href="/community" className="block text-gray-600 hover:text-gray-900">
              Community
            </Link>
            <Link href="/notifications" className="block text-gray-600 hover:text-gray-900">
              Notifications
            </Link>
            <Link href={`/profile/${user?.id}`} className="block text-gray-600 hover:text-gray-900">
              My Profile
            </Link>
            <button onClick={handleLogout} className="w-full text-left text-red-600 hover:text-red-700 py-2">
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
