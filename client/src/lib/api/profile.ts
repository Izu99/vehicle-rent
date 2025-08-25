
import { authAPI } from './auth';

// Assuming User and RentalCompany interfaces are defined elsewhere
// For now, let's define basic ones for type safety.
interface User {
  _id: string;
  [key: string]: any;
}

interface RentalCompany {
  _id: string;
  [key: string]: any;
}

const API_BASE_URL = 'http://localhost:5000/api';

class ProfileAPI {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = (authAPI as any).getToken(); // Re-using token logic from authAPI

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

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

  async getUserProfile(): Promise<User> {
    return this.makeRequest('/auth/me');
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    return this.makeRequest(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getCompanyProfile(): Promise<RentalCompany> {
    return this.makeRequest('/my-rental-company');
  }

  async updateCompanyProfile(companyId: string, data: Partial<RentalCompany>): Promise<RentalCompany> {
    return this.makeRequest(`/rental-companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const profileAPI = new ProfileAPI();
