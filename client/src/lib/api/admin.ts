import { authAPI } from './auth';

export interface RentalCompany {
  _id: string;
  name: string;
  ownerId: any;
  description?: string;
  rating: number;
  locations: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  [key: string]: any;
}

interface AllCompaniesResponse {
  companies: RentalCompany[];
  total: number;
  page: number;
  totalPages: number;
}

interface UpdateStatusResponse {
  message: string;
  company: RentalCompany;
}

const API_BASE_URL = 'http://localhost:5000/api';

class AdminAPI {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Debug: Log the exact URL being called
    console.log('🔍 Making request to:', url);
    console.log('🔍 Request method:', options.method || 'GET');
    
    const token = (authAPI as any).getToken();
    console.log('🔍 Token exists:', !!token);

    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Debug: Log the full config
    console.log('🔍 Request config:', {
      url,
      method: config.method,
      headers: config.headers,
      body: options.body
    });

    try {
      const response = await fetch(url, config);
      
      // Debug: Log response details
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // First check if response is ok
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If can't parse JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        console.error('❌ Response not ok:', errorMessage);
        throw new Error(errorMessage);
      }

      // Try to parse JSON response
      const data = await response.json();
      console.log('✅ Request successful:', data);
      return data;
      
    } catch (error) {
      console.error('❌ API Request failed:', error);
      
      // Provide more specific error messages
      if (error instanceof TypeError) {
        if (error.message === 'Failed to fetch') {
          throw new Error('Network error: Could not connect to server. Please check if the server is running on http://localhost:5000');
        } else if (error.message.includes('NetworkError')) {
          throw new Error('Network error: Please check your internet connection');
        }
      }
      
      // Re-throw the original error if it's not a network issue
      throw error;
    }
  }

  async getAllCompanies(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<AllCompaniesResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/admin/companies${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<AllCompaniesResponse>(endpoint);
  }

  async getCompanyById(id: string): Promise<RentalCompany> {
    return this.makeRequest<RentalCompany>(`/admin/companies/${id}`);
  }

  async updateCompanyStatus(
    id: string,
    status: 'active' | 'inactive' | 'pending'
  ): Promise<UpdateStatusResponse> {
    // Debug: Log the update attempt
    console.log('🔄 Updating company status:', { id, status });
    
    // Validate inputs
    if (!id) {
      throw new Error('Company ID is required');
    }
    
    if (!['active', 'inactive', 'pending'].includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: active, inactive, pending`);
    }

    return this.makeRequest<UpdateStatusResponse>(`/admin/companies/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Add a test method to check connectivity
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/companies?limit=1`);
      console.log('🔍 Connection test - Status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

export const adminAPI = new AdminAPI();

// Test the connection when the module loads (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  adminAPI.testConnection().then(isConnected => {
    if (isConnected) {
      console.log('✅ Admin API connection successful');
    } else {
      console.warn('⚠️ Admin API connection failed - check if backend server is running');
    }
  });
}