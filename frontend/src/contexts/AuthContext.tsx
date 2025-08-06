"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  isInitialized: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        fetchUser(storedToken)
      } else {
        setLoading(false)
        setIsInitialized(true)
      }
    }
  }, [])

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }
        setToken(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
      setToken(null)
    } finally {
      setLoading(false)
      setIsInitialized(true)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Login failed")
    }

    const data = await response.json()
    const authToken = data.access_token

    if (typeof window !== "undefined") {
      localStorage.setItem("token", authToken)
    }
    setToken(authToken)
    await fetchUser(authToken)
  }

  const signup = async (name: string, email: string, password: string) => {
    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Signup failed")
    }

    await login(email, password)
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, isInitialized, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
