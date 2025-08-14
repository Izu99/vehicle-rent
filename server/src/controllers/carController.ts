import { Request, Response } from 'express';
import { Car } from '../models/Car';
import { User } from '../models/User';
import fs from 'fs';
import path from 'path';

/**
 * Add new car with images
 * Only rent-shop users can add cars
 * POST /api/cars
 */
// export const addCar = async (req: Request, res: Response) => {
    export const addCar = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;
    const uploadedFiles = req.files as Express.Multer.File[];
    
    // 🔍 DEBUG: Check what we received
    console.log('📝 DEBUG - Request body:', req.body);
    console.log('📝 DEBUG - Request files:', req.files);
    console.log('📝 DEBUG - Files array:', uploadedFiles);
    console.log('📝 DEBUG - Files count:', uploadedFiles ? uploadedFiles.length : 0);
    


    // const requestingUser = (req as any).user;
    // const uploadedFiles = req.files as Express.Multer.File[];
    
    // Authorization check - Only rent-shops can add cars
    if (requestingUser.role !== 'rent-shop') {
      // Clean up uploaded files if unauthorized
      if (uploadedFiles) {
        uploadedFiles.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return res.status(403).json({ 
        message: 'Access denied. Only rent shops can add cars.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Check if at least one image was uploaded
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ 
        message: 'At least one car image is required',
        error: 'NO_IMAGES_UPLOADED'
      });
    }

    // Extract car data from request body
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
      licensePlate
    } = req.body;

    // Validate required fields
    if (!brand || !carModel || !year || !color || !fuelType || !transmission || 
        !seatingCapacity || !engineSize || !mileage || !pricePerDay || !licensePlate) {
      
      // Clean up uploaded files on validation error
      uploadedFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['brand', 'carModel', 'year', 'color', 'fuelType', 'transmission', 'seatingCapacity', 'engineSize', 'mileage', 'pricePerDay', 'licensePlate', 'images'],
        error: 'VALIDATION_ERROR'
      });
    }

    // Check if license plate already exists
    const existingCar = await Car.findOne({ 
      licensePlate: licensePlate.toUpperCase() 
    });
    
    if (existingCar) {
      // Clean up uploaded files
      uploadedFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      
      return res.status(400).json({ 
        message: 'A car with this license plate already exists',
        error: 'DUPLICATE_LICENSE_PLATE'
      });
    }

    // Generate image URLs from uploaded files
    const imageUrls = uploadedFiles.map(file => `/uploads/cars/${file.filename}`);

    // Create new car object with images included
    const car = new Car({
      shopId: requestingUser._id,
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
      images: imageUrls, // Images included here!
      isAvailable: true
    });

    // Save car to database
    await car.save();

    // Populate shop information for response
    await car.populate('shopId', 'shopName shopAddress phone email');

    // Log successful car addition
    console.log(`✅ Car added successfully with ${imageUrls.length} images: ${brand} ${carModel} by shop ${requestingUser.shopName}`);

    // Return success response
    res.status(201).json({
      success: true,
      message: `Car added successfully with ${imageUrls.length} images`,
      car
    });

  } catch (error: any) {
    console.error('❌ Add car error:', error);
    
    // Clean up uploaded files on any error
    const uploadedFiles = req.files as Express.Multer.File[];
    if (uploadedFiles) {
      uploadedFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    // Handle specific errors...
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors,
        error: 'VALIDATION_ERROR'
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
}

/**
 * Get all cars belonging to a specific shop
 * Rent-shops can only see their own cars, admins can see any shop's cars
 * GET /api/cars/shop/:shopId
 */
export const getShopCars = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;
    const { shopId } = req.params;
    
    // Validate shopId parameter
    if (!shopId) {
      return res.status(400).json({ 
        message: 'Shop ID is required',
        error: 'MISSING_SHOP_ID'
      });
    }
    
    // Authorization check - rent-shops can only see their own cars
    if (requestingUser.role === 'rent-shop' && shopId !== requestingUser._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only view your own cars.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Verify that the shop exists
    const shop = await User.findById(shopId);
    if (!shop) {
      return res.status(404).json({ 
        message: 'Shop not found',
        error: 'SHOP_NOT_FOUND'
      });
    }

    if (shop.role !== 'rent-shop') {
      return res.status(400).json({ 
        message: 'Invalid shop ID. User is not a rent shop.',
        error: 'INVALID_SHOP'
      });
    }

    // Get all cars for this shop
    const cars = await Car.find({ shopId })
      .populate('shopId', 'shopName shopAddress phone email')
      .sort({ createdAt: -1 }); // Most recent first

    // Log successful retrieval
    console.log(`✅ Retrieved ${cars.length} cars for shop: ${shop.shopName}`);

    // Return cars with additional metadata
    res.json({
      success: true,
      cars,
      total: cars.length,
      shopInfo: {
        shopName: shop.shopName,
        shopAddress: shop.shopAddress
      },
      message: `Found ${cars.length} cars`
    });

  } catch (error: any) {
    console.error('❌ Get shop cars error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid shop ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }
    
    // Handle database errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ 
        message: 'Database connection error',
        error: 'DATABASE_ERROR'
      });
    }
    
    return res.status(500).json({ 
      message: 'Server error',
      error: 'SERVER_ERROR'
    });
  }
};

/**
 * Get all available cars with filtering and pagination
 * Public endpoint - customers can browse all available cars
 * GET /api/cars
 */
export const getAllCars = async (req: Request, res: Response) => {
  try {
    // Extract query parameters for filtering
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
      sortOrder = 'desc'
    } = req.query;

    // Build filter object - only show available cars
    let filter: any = { isAvailable: true };
    
    // Apply brand filter (case-insensitive)
    if (brand) {
      filter.brand = new RegExp(brand as string, 'i');
    }
    
    // Apply fuel type filter
    if (fuelType && ['Petrol', 'Diesel', 'Electric', 'Hybrid'].includes(fuelType as string)) {
      filter.fuelType = fuelType;
    }
    
    // Apply transmission filter
    if (transmission && ['Manual', 'Automatic'].includes(transmission as string)) {
      filter.transmission = transmission;
    }
    
    // Apply seating capacity filter
    if (seatingCapacity) {
      const capacity = Number(seatingCapacity);
      if (!isNaN(capacity) && capacity > 0) {
        filter.seatingCapacity = capacity;
      }
    }
    
    // Apply price range filter
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) {
        const min = Number(minPrice);
        if (!isNaN(min) && min >= 0) {
          filter.pricePerDay.$gte = min;
        }
      }
      if (maxPrice) {
        const max = Number(maxPrice);
        if (!isNaN(max) && max > 0) {
          filter.pricePerDay.$lte = max;
        }
      }
    }

    // Pagination calculations
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit))); // Max 50 cars per page
    const skip = (pageNumber - 1) * limitNumber;
    
    // Build sort object
    const validSortFields = ['createdAt', 'pricePerDay', 'year', 'brand', 'carModel'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const sortDirection: 1 | -1 = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    // Execute queries in parallel for better performance
    const [cars, total] = await Promise.all([
      Car.find(filter)
        .populate('shopId', 'shopName shopAddress phone email')
        .sort(sort)
        .skip(skip)
        .limit(limitNumber),
      Car.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    // Log successful retrieval
    console.log(`✅ Retrieved ${cars.length} cars (page ${pageNumber}/${totalPages})`);

    // Return cars with pagination info
    res.json({
      success: true,
      cars,
      pagination: {
        current: pageNumber,
        total: totalPages,
        limit: limitNumber,
        totalCars: total,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage
      },
      filters: {
        brand,
        fuelType,
        transmission,
        minPrice,
        maxPrice,
        seatingCapacity
      },
      message: `Found ${total} cars`
    });

  } catch (error: any) {
    console.error('❌ Get all cars error:', error);
    
    // Handle database errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ 
        message: 'Database connection error',
        error: 'DATABASE_ERROR'
      });
    }
    
    return res.status(500).json({ 
      message: 'Server error',
      error: 'SERVER_ERROR'
    });
  }
};

/**
 * Get single car details by ID
 * Public endpoint - anyone can view car details
 * GET /api/cars/:carId
 */
export const getCarById = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    
    // Validate carId parameter
    if (!carId) {
      return res.status(400).json({ 
        message: 'Car ID is required',
        error: 'MISSING_CAR_ID'
      });
    }
    
    // Find car and populate shop information
    const car = await Car.findById(carId)
      .populate('shopId', 'shopName shopAddress phone email');
    
    // Check if car exists
    if (!car) {
      return res.status(404).json({ 
        message: 'Car not found',
        error: 'CAR_NOT_FOUND'
      });
    }

    // Log successful retrieval
    console.log(`✅ Retrieved car details: ${car.brand} ${car.carModel} (${car.licensePlate})`);

    res.json({ 
      success: true,
      car,
      message: 'Car details retrieved successfully'
    });

  } catch (error: any) {
    console.error('❌ Get car by ID error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid car ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }
    
    // Handle database errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ 
        message: 'Database connection error',
        error: 'DATABASE_ERROR'
      });
    }
    
    return res.status(500).json({ 
      message: 'Server error',
      error: 'SERVER_ERROR'
    });
  }
};

/**
 * Update car details
 * Only the shop owner can update their own cars
 * PUT /api/cars/:carId
 */
export const updateCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const requestingUser = (req as any).user;
    
    // Validate carId parameter
    if (!carId) {
      return res.status(400).json({ 
        message: 'Car ID is required',
        error: 'MISSING_CAR_ID'
      });
    }
    
    // Find the car
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ 
        message: 'Car not found',
        error: 'CAR_NOT_FOUND'
      });
    }

    // Authorization check - only the shop owner can update their car
    if (car.shopId.toString() !== requestingUser._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only update your own cars.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Define allowed fields for update
    const allowedFields = [
      'brand', 'carModel', 'year', 'color', 'fuelType', 'transmission',
      'seatingCapacity', 'engineSize', 'mileage', 'pricePerDay',
      'pricePerWeek', 'pricePerMonth', 'airConditioning', 'bluetooth',
      'gps', 'sunroof', 'description', 'isAvailable'
    ];

    // Track what fields are being updated
    const updatedFields: string[] = [];

    // Update only allowed fields that are provided
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Special handling for numeric fields
        if (['year', 'seatingCapacity', 'pricePerDay', 'pricePerWeek', 'pricePerMonth'].includes(field)) {
          const numValue = Number(req.body[field]);
          if (!isNaN(numValue) && numValue > 0) {
            (car as any)[field] = numValue;
            updatedFields.push(field);
          }
        }
        // Special handling for boolean fields
        else if (['airConditioning', 'bluetooth', 'gps', 'sunroof', 'isAvailable'].includes(field)) {
          (car as any)[field] = Boolean(req.body[field]);
          updatedFields.push(field);
        }
        // String fields
        else {
          (car as any)[field] = req.body[field].toString().trim();
          updatedFields.push(field);
        }
      }
    });

    // Validate year if it's being updated
    if (req.body.year) {
      const currentYear = new Date().getFullYear();
      if (car.year < 1990 || car.year > currentYear + 1) {
        return res.status(400).json({ 
          message: `Year must be between 1990 and ${currentYear + 1}`,
          error: 'INVALID_YEAR'
        });
      }
    }

    // Check if any fields were actually updated
    if (updatedFields.length === 0) {
      return res.status(400).json({ 
        message: 'No valid fields provided for update',
        allowedFields,
        error: 'NO_UPDATE_FIELDS'
      });
    }

    // Save the updated car
    await car.save();
    
    // Populate shop information for response
    await car.populate('shopId', 'shopName shopAddress phone email');

    // Log successful update
    console.log(`✅ Car updated successfully: ${car.brand} ${car.carModel} (${car.licensePlate})`);
    console.log(`   Updated fields: ${updatedFields.join(', ')}`);

    res.json({
      success: true,
      message: 'Car updated successfully',
      car,
      updatedFields
    });

  } catch (error: any) {
    console.error('❌ Update car error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid car ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors,
        error: 'VALIDATION_ERROR'
      });
    }
    
    // Handle database errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ 
        message: 'Database connection error',
        error: 'DATABASE_ERROR'
      });
    }
    
    return res.status(500).json({ 
      message: 'Server error',
      error: 'SERVER_ERROR'
    });
  }
};

/**
 * Delete car from inventory
 * Only the shop owner can delete their own cars
 * DELETE /api/cars/:carId
 */
export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const requestingUser = (req as any).user;
    
    // Validate carId parameter
    if (!carId) {
      return res.status(400).json({ 
        message: 'Car ID is required',
        error: 'MISSING_CAR_ID'
      });
    }
    
    // Find the car
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ 
        message: 'Car not found',
        error: 'CAR_NOT_FOUND'
      });
    }

    // Authorization check - only the shop owner can delete their car
    if (car.shopId.toString() !== requestingUser._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only delete your own cars.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Store car info for logging before deletion
    const carInfo = `${car.brand} ${car.carModel} (${car.licensePlate})`;

    // Delete the car
    await Car.findByIdAndDelete(carId);

    // Log successful deletion
    console.log(`✅ Car deleted successfully: ${carInfo} by shop ${requestingUser.shopName}`);

    res.json({ 
      success: true,
      message: 'Car deleted successfully',
      deletedCar: {
        id: carId,
        brand: car.brand,
        carModel: car.carModel,
        licensePlate: car.licensePlate
      }
    });

  } catch (error: any) {
    console.error('❌ Delete car error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid car ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }
    
    // Handle database errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ 
        message: 'Database connection error',
        error: 'DATABASE_ERROR'
      });
    }
    
    return res.status(500).json({ 
      message: 'Server error',
      error: 'SERVER_ERROR'
    });
  }
};

/**
 * Toggle car availability status
 * Only the shop owner can toggle their car's availability
 * PATCH /api/cars/:carId/toggle-availability
 */
export const toggleCarAvailability = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const requestingUser = (req as any).user;
    
    // Validate carId parameter
    if (!carId) {
      return res.status(400).json({ 
        message: 'Car ID is required',
        error: 'MISSING_CAR_ID'
      });
    }
    
    // Find the car
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ 
        message: 'Car not found',
        error: 'CAR_NOT_FOUND'
      });
    }

    // Authorization check - only the shop owner can toggle their car's availability
    if (car.shopId.toString() !== requestingUser._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only modify your own cars.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Toggle availability
    const previousStatus = car.isAvailable;
    car.isAvailable = !car.isAvailable;
    
    await car.save();
    await car.populate('shopId', 'shopName shopAddress phone email');

    // Log the change
    console.log(`✅ Car availability toggled: ${car.brand} ${car.carModel} (${car.licensePlate}) - ${previousStatus ? 'Available' : 'Unavailable'} → ${car.isAvailable ? 'Available' : 'Unavailable'}`);

    res.json({
      success: true,
      message: `Car is now ${car.isAvailable ? 'available' : 'unavailable'}`,
      car,
      previousStatus,
      currentStatus: car.isAvailable
    });

  } catch (error: any) {
    console.error('❌ Toggle car availability error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid car ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }
    
    // Handle database errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ 
        message: 'Database connection error',
        error: 'DATABASE_ERROR'
      });
    }
    
    return res.status(500).json({ 
      message: 'Server error',
      error: 'SERVER_ERROR'
    });
  }
};
