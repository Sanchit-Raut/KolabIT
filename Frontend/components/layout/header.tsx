"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, Bell, LogOut } from "lucide-react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setMobileMenuOpen(false)
  }

  const navItems = [
    { href: "/projects", label: "Projects" },
    { href: "/resources", label: "Resources" },
    { href: "/community", label: "Community" },
    ...(isAuthenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

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
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className={
                  isActive(item.href)
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                {item.label}
              </Button>
            </Link>
          ))}
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
              {/* Mobile menu icon */}
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
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg ${isActive(item.href) ? "bg-orange-500 text-white font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  href="/notifications"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                >
                  Notifications
                </Link>
                <Link
                  href={`/profile/${user?.id}`}
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
