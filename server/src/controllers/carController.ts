import { Request, Response } from 'express';
import { Car } from '../models/Car';
import { RentalCompany } from '../models/RentalCompany'; // <-- Updated import
import fs from 'fs';

//
// Add new car with images
// Only rental-company users with rental company can add cars
//
export const addCar = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;
    const uploadedFiles = req.files as Express.Multer.File[];

    // Only rental-company role allowed
    if (requestingUser.role !== 'rental-company') {
      if (uploadedFiles) {
        uploadedFiles.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      return res.status(403).json({
        message: 'Access denied. Only rental company owners can add cars.',
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    // Find user's rental company profile
    const company = await RentalCompany.findOne({
      ownerId: requestingUser._id,
    });
    if (!company) {
      if (uploadedFiles) {
        uploadedFiles.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      return res.status(400).json({
        message:
          'No rental company profile found. Please create your company profile first.',
        error: 'NO_COMPANY_PROFILE',
      });
    }

    // Image check
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        message: 'At least one car image is required',
        error: 'NO_IMAGES_UPLOADED',
      });
    }

    // Extract and validate car fields
    const {
      brand,
      carModel,
      year,
      color,
      fuelType,
      transmission,
      seatingCapacity,
      engineSize,
      mileage,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      airConditioning,
      bluetooth,
      gps,
      sunroof,
      description,
      licensePlate,
    } = req.body;

    if (
      !brand ||
      !carModel ||
      !year ||
      !color ||
      !fuelType ||
      !transmission ||
      !seatingCapacity ||
      !engineSize ||
      !mileage ||
      !pricePerDay ||
      !licensePlate
    ) {
      uploadedFiles.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        message: 'Missing required fields',
        required: [
          'brand',
          'carModel',
          'year',
          'color',
          'fuelType',
          'transmission',
          'seatingCapacity',
          'engineSize',
          'mileage',
          'pricePerDay',
          'licensePlate',
          'images',
        ],
        error: 'VALIDATION_ERROR',
      });
    }

    // License plate uniqueness
    const existingCar = await Car.findOne({
      licensePlate: licensePlate.toUpperCase(),
    });
    if (existingCar) {
      uploadedFiles.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        message: 'A car with this license plate already exists',
        error: 'DUPLICATE_LICENSE_PLATE',
      });
    }

    // Images
    const imageUrls = uploadedFiles.map(
      (file) => `/uploads/cars/${file.filename}`,
    );

    // Create Car
    const car = new Car({
      companyId: company._id, // <<< Changed here
      brand: brand.trim(),
      carModel: carModel.trim(),
      year: Number(year),
      color: color.trim(),
      fuelType,
      transmission,
      seatingCapacity: Number(seatingCapacity),
      engineSize: engineSize.trim(),
      mileage: mileage.trim(),
      pricePerDay: Number(pricePerDay),
      pricePerWeek: pricePerWeek ? Number(pricePerWeek) : undefined,
      pricePerMonth: pricePerMonth ? Number(pricePerMonth) : undefined,
      airConditioning: Boolean(airConditioning),
      bluetooth: Boolean(bluetooth),
      gps: Boolean(gps),
      sunroof: Boolean(sunroof),
      description: description ? description.trim() : undefined,
      licensePlate: licensePlate.toUpperCase().trim(),
      images: imageUrls,
      isAvailable: true,
    });

    await car.save();

    // Populate company info for response
    await car.populate('companyId', 'name locations phone email');

    res.status(201).json({
      success: true,
      message: `Car added successfully with ${imageUrls.length} images`,
      car,
    });
  } catch (error: any) {
    console.error('❌ Add car error:', error);
    const uploadedFiles = req.files as Express.Multer.File[];
    if (uploadedFiles) {
      uploadedFiles.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors,
        error: 'VALIDATION_ERROR',
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR',
    });
  }
};

//
// Get all cars for a rental company
// GET /api/cars/company/:companyId
//
// ✅ CORRECT - GET /api/cars/company/:companyId
export const getCompanyCars = async (req, res) => {
  const { companyId } = req.params; // ✅ Get from URL params, NOT body

  try {
    // Check if company exists
    const company = await RentalCompany.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Rental company not found',
      });
    }

    // Find cars for this company
    const cars = await Car.find({ companyId }).populate(
      'companyId',
      'name locations phone email',
    );

    // Return success with cars (even if empty array)
    return res.status(200).json({
      success: true,
      cars: cars,
      total: cars.length,
      message:
        cars.length === 0 ? 'No cars found' : `Found ${cars.length} cars`,
    });
  } catch (error) {
    console.error('Error getting company cars:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

//
// Get all available cars with filtering and pagination
// Public endpoint
//
export const getAllCars = async (req: Request, res: Response) => {
  try {
    const {
      brand,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      seatingCapacity,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    let filter: any = { isAvailable: true };
    if (brand) filter.brand = new RegExp(brand as string, 'i');
    if (
      fuelType &&
      ['Petrol', 'Diesel', 'Electric', 'Hybrid'].includes(fuelType as string)
    )
      filter.fuelType = fuelType;
    if (
      transmission &&
      ['Manual', 'Automatic'].includes(transmission as string)
    )
      filter.transmission = transmission;
    if (seatingCapacity) {
      const capacity = Number(seatingCapacity);
      if (!isNaN(capacity) && capacity > 0) filter.seatingCapacity = capacity;
    }
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) {
        const min = Number(minPrice);
        if (!isNaN(min) && min >= 0) filter.pricePerDay.$gte = min;
      }
      if (maxPrice) {
        const max = Number(maxPrice);
        if (!isNaN(max) && max > 0) filter.pricePerDay.$lte = max;
      }
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    const validSortFields = [
      'createdAt',
      'pricePerDay',
      'year',
      'brand',
      'carModel',
    ];
    const sortField = validSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : 'createdAt';
    const sortDirection: 1 | -1 = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    const [cars, total] = await Promise.all([
      Car.find(filter)
        .populate('companyId', 'name locations phone email')
        .sort(sort)
        .skip(skip)
        .limit(limitNumber),
      Car.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.json({
      success: true,
      cars,
      pagination: {
        current: pageNumber,
        total: totalPages,
        limit: limitNumber,
        totalCars: total,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage,
      },
      filters: {
        brand,
        fuelType,
        transmission,
        minPrice,
        maxPrice,
        seatingCapacity,
      },
      message: `Found ${total} cars`,
    });
  } catch (error: any) {
    console.error('❌ Get all cars error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};

//
// Get car details by ID
// Public endpoint
//
export const getCarById = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    if (!carId) {
      return res.status(400).json({
        message: 'Car ID is required',
        error: 'MISSING_CAR_ID',
      });
    }

    const car = await Car.findById(carId).populate(
      'companyId',
      'name locations phone email',
    );

    if (!car) {
      return res.status(404).json({
        message: 'Car not found',
        error: 'CAR_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      car,
      message: 'Car details retrieved successfully',
    });
  } catch (error: any) {
    console.error('❌ Get car by ID error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};

//
// Update car details (only company owner)
//
export const updateCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const requestingUser = (req as any).user;
    if (!carId) {
      return res.status(400).json({
        message: 'Car ID is required',
        error: 'MISSING_CAR_ID',
      });
    }

    const car = await Car.findById(carId).populate('companyId', 'ownerId');
    if (!car) {
      return res.status(404).json({
        message: 'Car not found',
        error: 'CAR_NOT_FOUND',
      });
    }

    // Authorization: only company owner can update
    if (
      !car.companyId ||
      (car.companyId as any).ownerId.toString() !==
        requestingUser._id.toString()
    ) {
      return res.status(403).json({
        message:
          'Access denied. You can only update cars belonging to your company.',
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    const allowedFields = [
      'brand',
      'carModel',
      'year',
      'color',
      'fuelType',
      'transmission',
      'seatingCapacity',
      'engineSize',
      'mileage',
      'pricePerDay',
      'pricePerWeek',
      'pricePerMonth',
      'airConditioning',
      'bluetooth',
      'gps',
      'sunroof',
      'description',
      'isAvailable',
    ];

    const updatedFields: string[] = [];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (
          [
            'year',
            'seatingCapacity',
            'pricePerDay',
            'pricePerWeek',
            'pricePerMonth',
          ].includes(field)
        ) {
          const numValue = Number(req.body[field]);
          if (!isNaN(numValue) && numValue > 0) {
            (car as any)[field] = numValue;
            updatedFields.push(field);
          }
        } else if (
          [
            'airConditioning',
            'bluetooth',
            'gps',
            'sunroof',
            'isAvailable',
          ].includes(field)
        ) {
          (car as any)[field] = Boolean(req.body[field]);
          updatedFields.push(field);
        } else {
          (car as any)[field] = req.body[field].toString().trim();
          updatedFields.push(field);
        }
      }
    });

    if (updatedFields.length === 0) {
      return res.status(400).json({
        message: 'No valid fields provided for update',
        allowedFields,
        error: 'NO_UPDATE_FIELDS',
      });
    }

    await car.save();
    await car.populate('companyId', 'name locations phone email');

    res.json({
      success: true,
      message: 'Car updated successfully',
      car,
      updatedFields,
    });
  } catch (error: any) {
    console.error('❌ Update car error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};

//
// Delete car (only company owner)
//
export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const requestingUser = (req as any).user;
    if (!carId) {
      return res.status(400).json({
        message: 'Car ID is required',
        error: 'MISSING_CAR_ID',
      });
    }

    const car = await Car.findById(carId).populate('companyId', 'ownerId');
    if (!car) {
      return res.status(404).json({
        message: 'Car not found',
        error: 'CAR_NOT_FOUND',
      });
    }

    // Only owner can delete
    if (
      !car.companyId ||
      (car.companyId as any).ownerId.toString() !==
        requestingUser._id.toString()
    ) {
      return res.status(403).json({
        message:
          'Access denied. You can only delete cars belonging to your company.',
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    await Car.findByIdAndDelete(carId);

    res.json({
      success: true,
      message: 'Car deleted successfully',
      deletedCar: {
        id: carId,
        brand: car.brand,
        carModel: car.carModel,
        licensePlate: car.licensePlate,
      },
    });
  } catch (error: any) {
    console.error('❌ Delete car error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};

//
// Toggle car availability (only company owner)
//
export const toggleCarAvailability = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const requestingUser = (req as any).user;
    if (!carId) {
      return res.status(400).json({
        message: 'Car ID is required',
        error: 'MISSING_CAR_ID',
      });
    }

    const car = await Car.findById(carId).populate('companyId', 'ownerId');
    if (!car) {
      return res.status(404).json({
        message: 'Car not found',
        error: 'CAR_NOT_FOUND',
      });
    }

    // Only owner can toggle
    if (
      !car.companyId ||
      (car.companyId as any).ownerId.toString() !==
        requestingUser._id.toString()
    ) {
      return res.status(403).json({
        message:
          'Access denied. You can only update cars belonging to your company.',
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    const previousStatus = car.isAvailable;
    car.isAvailable = !car.isAvailable;

    await car.save();
    await car.populate('companyId', 'name locations phone email');

    res.json({
      success: true,
      message: `Car is now ${car.isAvailable ? 'available' : 'unavailable'}`,
      car,
      previousStatus,
      currentStatus: car.isAvailable,
    });
  } catch (error: any) {
    console.error('❌ Toggle car availability error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};
