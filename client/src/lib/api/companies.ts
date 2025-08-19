import { apiClient } from './index';

export interface RentalCompany {
  _id: string;
  name: string;
  ownerId: string;
  category: string;
  rating: number;
  reviews: number;
  locations: string[];
  features: string[];
  phone: string;
  email: string;
  website?: string;
  verified: boolean;
  featured: boolean;
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface CompaniesResponse {
  companies: RentalCompany[];
  total: number;
  page: number;
  totalPages: number;
}

export const companiesApi = {
  getAll: async (filters?: {
    category?: string;
    location?: string;
    minRating?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<CompaniesResponse> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/rental-companies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<CompaniesResponse>(endpoint);
  },
};
