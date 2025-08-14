"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'rent-shop' | 'customer'
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Function to set auth cookies
  const setAuthCookies = (userData: User, token: string) => {
    const maxAge = 24 * 60 * 60 // 24 hours
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'Secure;' : ''
    
    document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=${maxAge}; SameSite=strict; ${secure}`
    document.cookie = `authToken=${token}; path=/; max-age=${maxAge}; SameSite=strict; ${secure}`
    
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('authToken', token)
  }

  // Function to clear auth cookies
  const clearAuthCookies = () => {
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
  }

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('authToken')
        
        if (storedUser && storedToken && storedUser !== 'undefined' && storedToken !== 'undefined') {
          try {
            const userData = JSON.parse(storedUser)
            if (userData && userData.id && userData.username && userData.role) {
              setUser(userData)
              setAuthCookies(userData, storedToken)
              console.log('Auth restored from storage:', userData.username)
            } else {
              console.warn('Invalid user data in storage, clearing...')
              clearAuthCookies()
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError)
            clearAuthCookies()
          }
        } else {
          console.log('No valid auth data found in storage')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        clearAuthCookies()
      } finally {
        setIsLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      
      console.log('Attempting login for:', username)
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      console.log('Login response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || 'Invalid credentials')
      }

      const data = await response.json()
      console.log('Login response data:', data)

      // ✅ Handle your actual API response structure
      if (!data.token || !data.username || !data.role) {
        throw new Error('Invalid response from server - missing required fields')
      }

      // ✅ Create user object from flat response
      const userData: User = {
        id: data.userId || data.id || Date.now().toString(),
        username: data.username,
        email: data.email || `${data.username}@skyline.com`,
        role: data.role
      }

      // Set both cookies and localStorage
      setAuthCookies(userData, data.token)
      setUser(userData)

      console.log('Login successful:', userData.username, 'Role:', userData.role)

    } catch (error) {
      console.error('Login error:', error)
      clearAuthCookies()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log('Logging out user:', user?.username)
    clearAuthCookies()
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
