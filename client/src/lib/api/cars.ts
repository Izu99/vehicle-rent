// lib/api/cars.ts

import { apiClient } from './index'; // Make sure ./index exports apiClient (axios or fetch wrapper)

// --- Types ---
export interface RentalCompany {
  _id: string;
  name: string;
  locations: string[];
  phone?: string;
  email?: string;
}

export interface Car {
  _id: string;
  companyId: RentalCompany; // Populated!
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

// --- API Responses ---
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

export interface CompanyCarsResponse {
  success: boolean;
  cars: Car[];
  total: number;
  companyInfo: {
    name: string;
    locations: string[];
    phone?: string;
    email?: string;
  };
  message: string;
}

// --- API Methods ---
export const carsApi = {
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

  getById: async (carId: string): Promise<CarResponse> => {
    if (!carId) throw new Error('Car ID is required');
    return apiClient.get<CarResponse>(`/cars/${carId}`);
  },

  getCompanyCars: async (companyId: string): Promise<CompanyCarsResponse> => {
    if (!companyId) throw new Error('Company ID is required');
    return apiClient.get<CompanyCarsResponse>(`/cars/company/${companyId}`);
  },

  addCar: async (carData: FormData): Promise<CarResponse> => {
    return apiClient.post<CarResponse>(`/cars`, carData);
  },

  updateCar: async (carId: string, carData: Partial<Car>): Promise<CarResponse> => {
    if (!carId) throw new Error('Car ID is required');
    return apiClient.put<CarResponse>(`/cars/${carId}`, carData);
  },

  deleteCar: async (carId: string): Promise<{ success: boolean; message: string }> => {
    if (!carId) throw new Error('Car ID is required');
    return apiClient.delete(`/cars/${carId}`);
  },

  toggleAvailability: async (carId: string): Promise<CarResponse> => {
    if (!carId) throw new Error('Car ID is required');
    return apiClient.put<CarResponse>(`/cars/${carId}/toggle-availability`, {});
  },
};
