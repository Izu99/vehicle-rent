import { apiClient } from './index';

// Types
export interface Car {
  _id: string;
  shopId: {
    _id: string;
    shopName: string;
    shopAddress: string;
    phone: string;
    email: string;
  } | string; // Can be populated or just ID
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
  pagination?: {
    current: number;
    total: number;
    limit: number;
    totalCars: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CarResponse {
  success: boolean;
  car: Car;
  message: string;
}

export interface ShopCarsResponse {
  success: boolean;
  cars: Car[];
  total: number;
  shopInfo: {
    shopName: string;
    shopAddress: string;
  };
  message: string;
}

export const carsApi = {
  // Get all cars with filters (public endpoint)
  getAll: async (filters?: {
    brand?: string;
    fuelType?: string;
    transmission?: string;
    minPrice?: number;
    maxPrice?: number;
    seatingCapacity?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<CarsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<CarsResponse>(endpoint);
  },

  // Get single car by ID (public endpoint)
  getById: async (carId: string): Promise<CarResponse> => {
    if (!carId) {
      throw new Error('Car ID is required');
    }
    return apiClient.get<CarResponse>(`/cars/${carId}`);
  },

  // Get cars for a specific shop (protected endpoint)
  getShopCars: async (shopId: string): Promise<ShopCarsResponse> => {
    if (!shopId) {
      throw new Error('Shop ID is required');
    }
    return apiClient.get<ShopCarsResponse>(`/cars/shop/${shopId}`);
  },

  // Add new car (protected endpoint - rent-shop only)
  addCar: async (carData: FormData): Promise<CarResponse> => {
    return apiClient.post<CarResponse>('/cars', carData);
  },

  // Update car (protected endpoint)
  updateCar: async (carId: string, carData: Partial<Car>): Promise<CarResponse> => {
    if (!carId) {
      throw new Error('Car ID is required');
    }
    return apiClient.put<CarResponse>(`/cars/${carId}`, carData);
  },

  // Delete car (protected endpoint)
  deleteCar: async (carId: string): Promise<{ success: boolean; message: string }> => {
    if (!carId) {
      throw new Error('Car ID is required');
    }
    return apiClient.delete(`/cars/${carId}`);
  },

  // Toggle car availability (protected endpoint)
  toggleAvailability: async (carId: string): Promise<CarResponse> => {
    if (!carId) {
      throw new Error('Car ID is required');
    }
    return apiClient.put<CarResponse>(`/cars/${carId}/toggle-availability`, {});
  }
};
