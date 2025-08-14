import { apiClient } from './index';

// Inline types - no separate file needed
export interface Car {
  _id: string;
  shopId: {
    _id: string;
    shopName: string;
    shopAddress: string;
    phone: string;
    email: string;
  };
  brand: string;
  carModel: string;
  year: number;
  color: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  seatingCapacity: number;
  engineSize: string;
  mileage: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  airConditioning: boolean;
  bluetooth: boolean;
  gps: boolean;
  sunroof: boolean;
  images: string[];
  isAvailable: boolean;
  description?: string;
  licensePlate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarsResponse {
  success: boolean;
  cars: Car[];
  total: number;
  message: string;
}

export interface CarResponse {
  success: boolean;
  car: Car;
  message: string;
}

export const carsApi = {
  // Get all cars with filters
  getAll: async (filters?: {
    brand?: string;
    fuelType?: string;
    transmission?: string;
    minPrice?: number;
    maxPrice?: number;
    seatingCapacity?: number;
    page?: number;
    limit?: number;
  }): Promise<CarsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<CarsResponse>(endpoint);
  },

  // Get single car
  getById: async (carId: string): Promise<CarResponse> => {
    return apiClient.get<CarResponse>(`/cars/${carId}`);
  }
};
