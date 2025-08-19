"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api/auth';

interface AuthUser {
  userId: string;
  username: string;
  email?: string;
  role?: string;
  companyId?: string; // ✅ Added for rental companies
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// ✅ Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// ✅ AuthProvider component with explicit typing
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load user from storage on mount
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = authAPI.getStoredUser();
        console.log('🔍 AuthContext - Loading stored user:', storedUser);
        
        if (storedUser) {
          const userData: AuthUser = {
            username: storedUser.username,
            role: storedUser.role as 'customer' | 'rental-company' | 'admin',
            userId: storedUser.userId,
            companyId: storedUser.companyId, // ✅ Include companyId from storage
            email: storedUser.email
          };
          console.log('✅ AuthContext - Setting user data:', userData);
          setUser(userData);
        } else {
          console.log('❌ AuthContext - No stored user found');
        }
      } catch (error) {
        console.error('❌ AuthContext - Error loading stored user:', error);
        // Clear potentially corrupted data
        authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  // ✅ Login function with proper error handling and debugging
  const login = async (username: string, password: string): Promise<void> => {
    try {
      console.log('🔄 AuthContext - Attempting login for username:', username);
      const response = await authAPI.login({ username, password });
      console.log('✅ AuthContext - Login response:', response);
      
      // Ensure we have all required data
      if (!response.username || !response.role || !response.userId) {
        console.error('❌ AuthContext - Missing required data in login response:', {
          username: response.username,
          role: response.role,
          userId: response.userId,
          companyId: response.companyId
        });
        throw new Error('Incomplete user data received from server');
      }
      
      const newUser: AuthUser = {
        username: response.username,
        role: response.role as 'customer' | 'rental-company' | 'admin',
        userId: response.userId,
        companyId: response.companyId, // ✅ Include companyId from login response
        email: response.email
      };
      
      console.log('✅ AuthContext - Setting new user:', newUser);
      setUser(newUser);
    } catch (error) {
      console.error('❌ AuthContext - Login error:', error);
      throw error;
    }
  };

  // ✅ Logout function with debugging
  const logout = (): void => {
    console.log('🔄 AuthContext - Logging out user:', user?.username);
    authAPI.logout();
    setUser(null);
    console.log('✅ AuthContext - User logged out');
  };

  // ✅ Context value with all required properties
  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  // Add debugging effect to monitor user changes
  useEffect(() => {
    console.log('🔄 AuthContext - User state changed:', {
      hasUser: !!user,
      userId: user?.userId,
      username: user?.username,
      role: user?.role,
      companyId: user?.companyId // ✅ Show companyId in debug logs
    });
  }, [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook with proper error handling
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
