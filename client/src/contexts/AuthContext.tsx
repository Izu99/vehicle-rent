"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '@/lib/api/auth'

interface AuthUser {
  username: string;
  role: 'customer' | 'rent-shop' | 'admin';
  userId: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// ✅ Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode;
}

// ✅ AuthProvider component with explicit typing
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Load user from storage on mount
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = authAPI.getStoredUser()
        if (storedUser) {
          setUser({
            username: storedUser.username,
            role: storedUser.role as 'customer' | 'rent-shop' | 'admin',
            userId: storedUser.userId
          })
        }
      } catch (error) {
        console.error('Error loading stored user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredUser()
  }, [])

  // ✅ Login function with proper error handling
  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.login({ username, password })
      
      const newUser: AuthUser = {
        username: response.username!,
        role: response.role! as 'customer' | 'rent-shop' | 'admin',
        userId: response.userId!
      }
      
      setUser(newUser)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // ✅ Logout function
  const logout = (): void => {
    authAPI.logout()
    setUser(null)
  }

  // ✅ Context value with all required properties
  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// ✅ Custom hook with proper error handling
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
