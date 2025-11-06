"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "./types"
import { authApi, tokenManager } from "./api"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (tokenManager.isAuthenticated()) {
          const profile = await authApi.getProfile()
          setUser(profile)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        tokenManager.removeToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.login({ email, password })
      setUser(response.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.register(data)
      setUser(response.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
