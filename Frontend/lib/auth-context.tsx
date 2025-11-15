"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { User } from "./types"
import { authApi, tokenManager } from "./api"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const initializationAttempted = useRef(false)

  useEffect(() => {
    if (initializationAttempted.current) return
    initializationAttempted.current = true

    const checkAuth = async () => {
      try {
        if (tokenManager.isAuthenticated()) {
          const profile = await authApi.getProfile()
          setUser(profile)
          setError(null)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("[v0] Auth check failed:", err)
        tokenManager.removeToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.login({ email, password })
      setUser(response.user)
      setError(null)
      return Promise.resolve()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      setUser(null)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.register(data)
      setUser(response.user)
      setError(null)
      return Promise.resolve()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed"
      setError(message)
      setUser(null)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
    setError(null)
  }, [])

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser)
  }, [])

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
        updateUser,
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
