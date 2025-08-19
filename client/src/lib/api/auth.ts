"use client";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'rental-company';
  // Customer fields
  firstName?: string;
  lastName?: string;
  drivingLicenseNumber?: string;
  dateOfBirth?: string;
  address?: string;
  // Company fields
  CompanyName?: string;
  CompanyAddress?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: 'customer' | 'rental-company' | 'admin';
  firstName?: string;
  lastName?: string;
  CompanyName?: string;
  CompanyAddress?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  role?: 'customer' | 'rental-company' | 'admin';
  username?: string;
  userId?: string;
  companyId?: string; // ✅ Added for rental-company
}

interface StoredUser {
  username: string;
  role: 'customer' | 'rental-company' | 'admin';
  userId: string;
  companyId?: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

class AuthAPI {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add token to headers if available
    const token = this.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token and user data if login successful
    if (response.token) {
      this.setToken(response.token);

      const userData: StoredUser = {
        username: response.username!,
        role: response.role!,
        userId: response.userId!,
        companyId: response.companyId, // ✅ Make sure this gets stored!
      };
      this.setStoredUser(userData);
    }

    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/auth/me');
  }

  async updateUserProfile(
    userId: string,
    updateData: Partial<User>
  ): Promise<{ message: string; user: User }> {
    return this.makeRequest<{ message: string; user: User }>(
      `/auth/users/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }
    );
  }

  async getAllUsers(params?: {
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
    message: string;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/auth/users${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return this.makeRequest(endpoint);
  }

  // Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }

  // User data management
  getStoredUser(): StoredUser | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      const parsed = JSON.parse(userStr);

      // Validate the role is one of expected values
      if (!['customer', 'rental-company', 'admin'].includes(parsed.role)) {
        console.warn('Invalid user role in stored data:', parsed.role);
        this.clearStoredUser();
        return null;
      }

      // Validate required fields
      if (!parsed.username || !parsed.userId || !parsed.role) {
        console.warn('Incomplete user data in storage');
        this.clearStoredUser();
        return null;
      }

      return {
        username: parsed.username,
        role: parsed.role as 'customer' | 'rental-company' | 'admin',
        userId: parsed.userId,
        companyId: parsed.companyId, // ✅ Make sure this gets loaded
      };
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      this.clearStoredUser();
      return null;
    }
  }

  private setStoredUser(userData: StoredUser): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  private clearStoredUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  }

  // Authentication status
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Logout
  logout(): void {
    this.removeToken();
    this.clearStoredUser();
  }

  // Utility methods
  getCurrentUserId(): string | null {
    const user = this.getStoredUser();
    return user?.userId || null;
  }

  getCurrentUserRole(): 'customer' | 'rental-company' | 'admin' | null {
    const user = this.getStoredUser();
    return user?.role || null;
  }

  getCurrentUsername(): string | null {
    const user = this.getStoredUser();
    return user?.username || null;
  }

  getCurrentCompanyId(): string | null {
    const user = this.getStoredUser();
    return user?.companyId || null;
  }

  // Role checking utilities
  isCustomer(): boolean {
    return this.getCurrentUserRole() === 'customer';
  }

  isRentCompany(): boolean {
    return this.getCurrentUserRole() === 'rental-company';
  }

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  // Check if user has permission for certain actions
  canAccessAdminPanel(): boolean {
    return this.isAdmin();
  }

  canAccessCompanyDashboard(): boolean {
    return this.isRentCompany() || this.isAdmin();
  }

  canManageCars(): boolean {
    return this.isRentCompany() || this.isAdmin();
  }
}

// Export singleton instance
export const authAPI = new AuthAPI();

// Export types for use in components
export type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
  StoredUser,
};
