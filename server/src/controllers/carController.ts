import { Request, Response } from 'express';
import { Car } from '../models/Car';
import { RentalCompany } from '../models/RentalCompany';
import fs from 'fs';

//
// Add new vehicle with flexible pricing structure
// Only rental-company users with rental company can add vehicles
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
        message: 'Access denied. Only rental company owners can add vehicles.',
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
        message: 'No rental company profile found. Please create your company profile first.',
        error: 'NO_COMPANY_PROFILE',
      });
    }

    // Image check
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        message: 'At least one vehicle image is required',
        error: 'NO_IMAGES_UPLOADED',
      });
    }

    // Extract fields
    const {
      vehicleCategory,
      vehicleSubCategory,
      brand,
      carModel,
      year,
      color,
      fuelType,
      transmission,
      seatingCapacity,
      engineSize,
      fuelConsumption,
      dimensions,
      // Updated pricing fields
      dailyWithoutDriver,
      dailyWithDriver,
      weeklyWithoutDriver,
      weeklyWithDriver,
      monthlyWithoutDriver,
      monthlyWithDriver,
      driverAvailable,
      airConditioning,
      bluetooth,
      gps,
      sunroof,
      description,
      licensePlate,
    } = req.body;

    // Basic validation
    if (
      !vehicleCategory ||
      !brand ||
      !carModel ||
      !year ||
      !color ||
      !dailyWithoutDriver ||
      !licensePlate
    ) {
      uploadedFiles.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        message: 'Missing required basic fields',
        required: [
          'vehicleCategory',
          'brand',
          'carModel',
          'year',
          'color',
          'dailyWithoutDriver',
          'licensePlate',
        ],
        error: 'VALIDATION_ERROR',
      });
    }

    // Sub-category validation for 'car' and 'van' categories
    if (vehicleCategory === 'car') {
      if (
        !vehicleSubCategory ||
        !['flex', 'mini', 'regular'].includes(vehicleSubCategory)
      ) {
        uploadedFiles.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
        return res.status(400).json({
          message: 'Car category requires sub-category (flex, mini, or regular)',
          required: ['vehicleSubCategory'],
          error: 'VALIDATION_ERROR',
        });
      }
    } else if (vehicleCategory === 'van') {
      if (
        !vehicleSubCategory ||
        !['mini', 'regular'].includes(vehicleSubCategory)
      ) {
        uploadedFiles.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
        return res.status(400).json({
          message: 'Van category requires sub-category (mini or regular)',
          required: ['vehicleSubCategory'],
          error: 'VALIDATION_ERROR',
        });
      }
    }

    // Pricing validation
    const dailyWithoutDriverNum = Number(dailyWithoutDriver);
    if (isNaN(dailyWithoutDriverNum) || dailyWithoutDriverNum <= 0) {
      uploadedFiles.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        message: 'Valid daily price without driver is required',
        error: 'VALIDATION_ERROR',
      });
    }

    // Driver pricing validation
    const isDriverAvailable = driverAvailable === 'true' || driverAvailable === true;
    if (dailyWithDriver && !isDriverAvailable) {
      uploadedFiles.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        message: 'Cannot set driver pricing when driver service is not available',
        error: 'VALIDATION_ERROR',
      });
    }

    // Vehicle type specific validation
    if (vehicleCategory === 'lorry') {
      // Only lorry needs dimensions
      if (
        !dimensions ||
        !dimensions.length ||
        !dimensions.width ||
        !dimensions.height
      ) {
        uploadedFiles.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
        return res.status(400).json({
          message: 'Lorry requires dimensions (length, width, height)',
          required: [
            'dimensions.length',
            'dimensions.width',
            'dimensions.height',
          ],
          error: 'VALIDATION_ERROR',
        });
      }
    } else {
      // All other vehicles need these fields
      if (
        !fuelType ||
        !transmission ||
        !seatingCapacity ||
        !engineSize ||
        !fuelConsumption
      ) {
        uploadedFiles.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
        return res.status(400).json({
          message:
            'Vehicle requires fuel type, transmission, seating capacity, engine size, and fuel consumption',
          required: [
            'fuelType',
            'transmission',
            'seatingCapacity',
            'engineSize',
            'fuelConsumption',
          ],
          error: 'VALIDATION_ERROR',
        });
      }
    }

    

    // Images
    const imageUrls = uploadedFiles.map(
      (file) => `/uploads/cars/${file.filename}`,
    );

    // Build pricing object
    const pricingData: any = {
      daily: {
        withoutDriver: dailyWithoutDriverNum,
        withDriver: dailyWithDriver ? Number(dailyWithDriver) : undefined
      }
    };

    // Add weekly pricing if provided
    if (weeklyWithoutDriver) {
      pricingData.weekly = {
        withoutDriver: Number(weeklyWithoutDriver),
        withDriver: weeklyWithDriver ? Number(weeklyWithDriver) : undefined
      };
    }

    // Add monthly pricing if provided
    if (monthlyWithoutDriver) {
      pricingData.monthly = {
        withoutDriver: Number(monthlyWithoutDriver),
        withDriver: monthlyWithDriver ? Number(monthlyWithDriver) : undefined
      };
    }

    // Create vehicle data
    const vehicleData: any = {
      companyId: company._id,
      vehicleCategory,
      brand: brand.trim(),
      carModel: carModel.trim(),
      year: Number(year),
      color: color.trim(),
      pricing: pricingData,
      driverAvailable: isDriverAvailable,
      description: description ? description.trim() : undefined,
      licensePlate: licensePlate.toUpperCase().trim(),
      images: imageUrls,
      isAvailable: true,
      airConditioning: airConditioning === 'true',
      bluetooth: bluetooth === 'true',
      gps: gps === 'true',
      sunroof: sunroof === 'true',
    };

    // Add sub-category for car and van
    if (vehicleCategory === 'car' || vehicleCategory === 'van') {
      vehicleData.vehicleSubCategory = vehicleSubCategory;
    }

    // Add fields based on vehicle category
    if (vehicleCategory === 'lorry') {
      // Only add dimensions for lorry
      vehicleData.dimensions = {
        length: Number(dimensions.length),
        width: Number(dimensions.width),
        height: Number(dimensions.height),
      };
    } else {
      // Add vehicle fields for all other categories
      vehicleData.fuelType = fuelType;
      vehicleData.transmission = transmission;
      vehicleData.seatingCapacity = Number(seatingCapacity);
      vehicleData.engineSize = engineSize.trim();
      vehicleData.fuelConsumption = fuelConsumption.trim();
    }

    // Create and save vehicle
    const car = new Car(vehicleData);
    await car.save();

    // Populate company info for response
    await car.populate('companyId', 'name locations phone email');

    const vehicleTypeDisplay =
      vehicleCategory === 'car' || vehicleCategory === 'van'
        ? `${vehicleSubCategory} ${vehicleCategory}`
        : vehicleCategory;

    res.status(201).json({
      success: true,
      message: `${vehicleTypeDisplay.charAt(0).toUpperCase() + vehicleTypeDisplay.slice(1)} added successfully with ${imageUrls.length} images`,
      car,
      pricingInfo: {
        dailyWithoutDriver: pricingData.daily.withoutDriver,
        dailyWithDriver: pricingData.daily.withDriver,
        weeklyWithoutDriver: pricingData.weekly?.withoutDriver,
        weeklyWithDriver: pricingData.weekly?.withDriver,
        monthlyWithoutDriver: pricingData.monthly?.withoutDriver,
        monthlyWithDriver: pricingData.monthly?.withDriver,
        driverAvailable: isDriverAvailable
      }
    });
  } catch (error: any) {
    console.error('❌ Add vehicle error:', error);
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
// Get all available vehicles with updated filtering for driver options
// Public endpoint
//
export const getAllCars = async (req: Request, res: Response) => {
  try {
    const {
      vehicleCategory,
      vehicleSubCategory,
      brand,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      withDriver, // New filter: 'true', 'false', or undefined (both)
      seatingCapacity,
      minLength,
      maxLength,
      minHeight,
      maxHeight,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    let filter: any = { isAvailable: true };

    // Vehicle category filter
    if (
      vehicleCategory &&
      ['car', 'van', 'lorry', 'bus'].includes(vehicleCategory as string)
    ) {
      filter.vehicleCategory = vehicleCategory;
    }

    // Vehicle sub-category filter (valid for 'car' and 'van' categories)
    if (vehicleSubCategory) {
      if (
        vehicleCategory === 'car' &&
        ['flex', 'mini', 'regular'].includes(vehicleSubCategory as string)
      ) {
        filter.vehicleSubCategory = vehicleSubCategory;
      } else if (
        vehicleCategory === 'van' &&
        ['mini', 'regular'].includes(vehicleSubCategory as string)
      ) {
        filter.vehicleSubCategory = vehicleSubCategory;
      } else if (
        !vehicleCategory &&
        ['flex', 'mini', 'regular'].includes(vehicleSubCategory as string)
      ) {
        // If no specific category is selected, allow all valid sub-categories
        filter.vehicleSubCategory = vehicleSubCategory;
      }
    }

    if (brand) filter.brand = new RegExp(brand as string, 'i');

    // Driver availability filter
    if (withDriver === 'true') {
      filter.driverAvailable = true;
    } else if (withDriver === 'false') {
      filter.driverAvailable = false;
    }
    // If withDriver is undefined, show all vehicles regardless of driver availability

    // Only filter by fuel type for non-lorry vehicles
    if (
      fuelType &&
      ['Petrol', 'Diesel', 'Electric', 'Hybrid'].includes(fuelType as string)
    ) {
      filter.fuelType = fuelType;
    }

    // Only filter by transmission for non-lorry vehicles
    if (
      transmission &&
      ['Manual', 'Automatic'].includes(transmission as string)
    ) {
      filter.transmission = transmission;
    }

    // Only filter by seating capacity for non-lorry vehicles
    if (seatingCapacity) {
      const capacity = Number(seatingCapacity);
      if (!isNaN(capacity) && capacity > 0) filter.seatingCapacity = capacity;
    }

    // Dimension filters for lorries
    if (minLength || maxLength) {
      filter['dimensions.length'] = {};
      if (minLength) {
        const min = Number(minLength);
        if (!isNaN(min) && min > 0) filter['dimensions.length'].$gte = min;
      }
      if (maxLength) {
        const max = Number(maxLength);
        if (!isNaN(max) && max > 0) filter['dimensions.length'].$lte = max;
      }
    }

    if (minHeight || maxHeight) {
      filter['dimensions.height'] = {};
      if (minHeight) {
        const min = Number(minHeight);
        if (!isNaN(min) && min > 0) filter['dimensions.height'].$gte = min;
      }
      if (maxHeight) {
        const max = Number(maxHeight);
        if (!isNaN(max) && max > 0) filter['dimensions.height'].$lte = max;
      }
    }

    // Price filtering - now based on daily withoutDriver price by default
    if (minPrice || maxPrice) {
      filter['pricing.daily.withoutDriver'] = {};
      if (minPrice) {
        const min = Number(minPrice);
        if (!isNaN(min) && min >= 0) filter['pricing.daily.withoutDriver'].$gte = min;
      }
      if (maxPrice) {
        const max = Number(maxPrice);
        if (!isNaN(max) && max > 0) filter['pricing.daily.withoutDriver'].$lte = max;
      }
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    const validSortFields = [
      'createdAt',
      'pricing.daily.withoutDriver',
      'year',
      'brand',
      'carModel',
      'vehicleCategory',
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
        vehicleCategory,
        vehicleSubCategory,
        brand,
        fuelType,
        transmission,
        minPrice,
        maxPrice,
        withDriver,
        seatingCapacity,
        minLength,
        maxLength,
        minHeight,
        maxHeight,
      },
      message: `Found ${total} vehicles`,
    });
  } catch (error: any) {
    console.error('❌ Get all vehicles error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};

//
// Get vehicle details by ID
// Public endpoint
//
export const getCarById = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    if (!carId) {
      return res.status(400).json({
        message: 'Vehicle ID is required',
        error: 'MISSING_CAR_ID',
      });
    }

    const car = await Car.findById(carId).populate(
      'companyId',
      'name locations phone email',
    );

    if (!car) {
      return res.status(404).json({
        message: 'Vehicle not found',
        error: 'CAR_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      car,
      message: 'Vehicle details retrieved successfully',
    });
  } catch (error: any) {
    console.error('❌ Get vehicle by ID error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};

//
// Updated updateCar function with new pricing structure
//
export const updateCar = async (req: Request, res: Response) => {
  const startTime = Date.now();
  let uploadedFiles: Express.Multer.File[] | undefined;

  // Helper function to clean up uploaded files
  const cleanupFiles = () => {
    if (uploadedFiles && Array.isArray(uploadedFiles)) {
      uploadedFiles.forEach((file) => {
        try {
          if (file && file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.error('Error cleaning up file:', file?.path, err);
        }
      });
    }
  };

  try {
    console.log('🚀 Update vehicle request started');
    
    // Extract uploaded files
    uploadedFiles = req.files as Express.Multer.File[];
    
    // Basic request validation
    const { carId } = req.params;
    if (!carId || !carId.match(/^[0-9a-fA-F]{24}$/)) {
      cleanupFiles();
      return res.status(400).json({
        message: 'Valid vehicle ID is required',
        error: 'INVALID_CAR_ID',
      });
    }

    // Check if req.body exists
    if (!req.body || typeof req.body !== 'object') {
      cleanupFiles();
      return res.status(400).json({
        message: 'Request body is missing. Make sure you are sending form-data.',
        error: 'MISSING_BODY',
        debug: {
          contentType: req.headers['content-type'],
          bodyExists: !!req.body,
          bodyType: typeof req.body,
          hasFiles: uploadedFiles ? uploadedFiles.length : 0
        }
      });
    }

    console.log('📋 Request body fields:', Object.keys(req.body));
    console.log('📁 Files received:', uploadedFiles?.length || 0);

    // User authentication check
    const requestingUser = (req as any).user;
    if (!requestingUser) {
      cleanupFiles();
      return res.status(401).json({
        message: 'Authentication required',
        error: 'NO_USER_CONTEXT',
      });
    }

    // Check if user has rental-company role
    if (requestingUser.role !== 'rental-company') {
      cleanupFiles();
      return res.status(403).json({
        message: 'Access denied. Only rental company owners can update vehicles.',
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    console.log('👤 User authenticated:', requestingUser._id, 'Role:', requestingUser.role);

    // Find vehicle and check ownership
    const car = await Car.findById(carId).populate('companyId', 'ownerId');
    if (!car) {
      cleanupFiles();
      return res.status(404).json({
        message: 'Vehicle not found',
        error: 'CAR_NOT_FOUND',
      });
    }

    // Authorization check
    const vehicleOwnerId = (car.companyId as any).ownerId?.toString();
    const requestingUserId = requestingUser._id.toString();
    
    if (vehicleOwnerId !== requestingUserId) {
      cleanupFiles();
      return res.status(403).json({
        message: 'Access denied. You can only update vehicles belonging to your company.',
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    console.log('✅ Authorization passed, processing updates...');

    // Track changes
    const updatedFields: string[] = [];
    const changes: any = {};

    // Handle basic string fields
    const stringFields = ['brand', 'carModel', 'color', 'description', 'licensePlate'];
    stringFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        const newValue = req.body[field].toString().trim();
        const oldValue = (car as any)[field];
        
        if (newValue && newValue !== oldValue) {
          changes[field] = { old: oldValue, new: newValue };
          if (field === 'licensePlate') {
            (car as any)[field] = newValue.toUpperCase();
          } else {
            (car as any)[field] = newValue;
          }
          updatedFields.push(field);
          console.log(`✏️ Updated ${field}: ${oldValue} → ${newValue}`);
        }
      }
    });

    // Handle numeric fields
    const numericFields = ['year', 'seatingCapacity'];
    numericFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        const numValue = Number(req.body[field]);
        const oldValue = (car as any)[field];
        
        if (!isNaN(numValue) && numValue > 0 && numValue !== oldValue) {
          changes[field] = { old: oldValue, new: numValue };
          (car as any)[field] = numValue;
          updatedFields.push(field);
          console.log(`🔢 Updated ${field}: ${oldValue} → ${numValue}`);
        }
      }
    });

    // Handle boolean fields
    const booleanFields = ['airConditioning', 'bluetooth', 'gps', 'sunroof', 'isAvailable', 'driverAvailable'];
    booleanFields.forEach(field => {
      if (req.body[field] !== undefined) {
        const boolValue = req.body[field] === 'true' || req.body[field] === true;
        const oldValue = (car as any)[field];
        
        if (boolValue !== oldValue) {
          changes[field] = { old: oldValue, new: boolValue };
          (car as any)[field] = boolValue;
          updatedFields.push(field);
          console.log(`☑️ Updated ${field}: ${oldValue} → ${boolValue}`);
        }
      }
    });

    // Handle pricing updates
    let pricingUpdated = false;
    const pricingFields = [
      'dailyWithoutDriver', 'dailyWithDriver',
      'weeklyWithoutDriver', 'weeklyWithDriver', 
      'monthlyWithoutDriver', 'monthlyWithDriver'
    ];

    pricingFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        const numValue = Number(req.body[field]);
        if (!isNaN(numValue) && numValue >= 0) {
          const [period, driverType] = field.replace(/([A-Z])/g, ' $1').toLowerCase().split(' ');
          const driverKey = driverType === 'with' ? 'withDriver' : 'withoutDriver';
          
          if (!car.pricing) car.pricing = { daily: { withoutDriver: 0 } };
          if (!car.pricing[period as keyof typeof car.pricing]) {
            (car.pricing as any)[period] = {};
          }
          
          const oldValue = (car.pricing as any)[period][driverKey];
          if (numValue !== oldValue) {
            if (!changes.pricing) changes.pricing = {};
            if (!changes.pricing[period]) changes.pricing[period] = {};
            changes.pricing[period][driverKey] = { old: oldValue, new: numValue };
            
            (car.pricing as any)[period][driverKey] = numValue;
            pricingUpdated = true;
            console.log(`💰 Updated ${period} ${driverKey}: ${oldValue} → ${numValue}`);
          }
        }
      }
    });

    if (pricingUpdated) {
      updatedFields.push('pricing');
    }

    // Validate driver pricing consistency
    if (car.driverAvailable === false) {
      // Remove driver pricing if driver is not available
      if (car.pricing?.daily?.withDriver) {
        car.pricing.daily.withDriver = undefined;
      }
      if (car.pricing?.weekly?.withDriver) {
        car.pricing.weekly.withDriver = undefined;
      }
      if (car.pricing?.monthly?.withDriver) {
        car.pricing.monthly.withDriver = undefined;
      }
    }

    // Handle vehicle category changes
    if (req.body.vehicleCategory && req.body.vehicleCategory !== car.vehicleCategory) {
      const newCategory = req.body.vehicleCategory;
      
      // Category-specific validation
      if (newCategory === 'car' || newCategory === 'van') {
        const requiredSubCategories = newCategory === 'car' 
          ? ['flex', 'mini', 'regular'] 
          : ['mini', 'regular'];
        
        if (!req.body.vehicleSubCategory || !requiredSubCategories.includes(req.body.vehicleSubCategory)) {
          cleanupFiles();
          return res.status(400).json({
            message: `${newCategory} category requires sub-category (${requiredSubCategories.join(', ')})`,
            error: 'VALIDATION_ERROR',
          });
        }
      }

      if (newCategory === 'lorry') {
        // Check dimensions for lorry
        const hasLength = req.body['dimensions[length]'] || req.body.dimensionsLength;
        const hasWidth = req.body['dimensions[width]'] || req.body.dimensionsWidth;
        const hasHeight = req.body['dimensions[height]'] || req.body.dimensionsHeight;
        
        if (!hasLength || !hasWidth || !hasHeight) {
          cleanupFiles();
          return res.status(400).json({
            message: 'Lorry category requires dimensions (length, width, height)',
            error: 'VALIDATION_ERROR',
          });
        }
      }

      changes.vehicleCategory = { old: car.vehicleCategory, new: newCategory };
      car.vehicleCategory = newCategory;
      updatedFields.push('vehicleCategory');
      console.log(`🚗 Updated category: ${car.vehicleCategory} → ${newCategory}`);
    }

    // Handle vehicle sub-category
    if (req.body.vehicleSubCategory !== undefined) {
      const currentCategory = car.vehicleCategory;
      let validSubCategory = true;
      
      if (currentCategory === 'car' && req.body.vehicleSubCategory && 
          !['flex', 'mini', 'regular'].includes(req.body.vehicleSubCategory)) {
        validSubCategory = false;
      }
      
      if (currentCategory === 'van' && req.body.vehicleSubCategory && 
          !['mini', 'regular'].includes(req.body.vehicleSubCategory)) {
        validSubCategory = false;
      }

      if (!validSubCategory) {
        cleanupFiles();
        return res.status(400).json({
          message: `Invalid sub-category for ${currentCategory}`,
          error: 'VALIDATION_ERROR',
        });
      }

      if (req.body.vehicleSubCategory !== car.vehicleSubCategory) {
        changes.vehicleSubCategory = { old: car.vehicleSubCategory, new: req.body.vehicleSubCategory };
        car.vehicleSubCategory = req.body.vehicleSubCategory || undefined;
        updatedFields.push('vehicleSubCategory');
        console.log(`📋 Updated sub-category: ${car.vehicleSubCategory} → ${req.body.vehicleSubCategory}`);
      }
    }

    // Handle category-specific fields
    const currentCategory = car.vehicleCategory;
    
    if (currentCategory === 'lorry') {
      // Handle dimensions for lorry (support both formats)
      const length = req.body['dimensions[length]'] || req.body.dimensionsLength;
      const width = req.body['dimensions[width]'] || req.body.dimensionsWidth;
      const height = req.body['dimensions[height]'] || req.body.dimensionsHeight;
      
      if (length || width || height) {
        const newDimensions = {
          length: length ? Number(length) : car.dimensions?.length || 0,
          width: width ? Number(width) : car.dimensions?.width || 0,
          height: height ? Number(height) : car.dimensions?.height || 0
        };
        
        const dimensionsChanged = !car.dimensions ||
          car.dimensions.length !== newDimensions.length ||
          car.dimensions.width !== newDimensions.width ||
          car.dimensions.height !== newDimensions.height;
          
        if (dimensionsChanged) {
          changes.dimensions = { old: car.dimensions, new: newDimensions };
          car.dimensions = newDimensions;
          updatedFields.push('dimensions');
          console.log('📐 Updated dimensions:', newDimensions);
        }
      }
    } else {
      // Handle vehicle-specific fields for non-lorry vehicles
      const vehicleFields = ['fuelType', 'transmission', 'engineSize', 'fuelConsumption'];
      vehicleFields.forEach(field => {
        if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
          const newValue = req.body[field].toString().trim();
          const oldValue = (car as any)[field];
          
          if (newValue && newValue !== oldValue) {
            changes[field] = { old: oldValue, new: newValue };
            (car as any)[field] = newValue;
            updatedFields.push(field);
            console.log(`⚙️ Updated ${field}: ${oldValue} → ${newValue}`);
          }
        }
      });
    }

    // Handle image updates
    const newImageUrls = (uploadedFiles || []).map(
      (file) => `/uploads/cars/${file.filename}`
    );
    
    let existingImages: string[] = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        console.error('Error parsing existingImages JSON:', e);
        // Decide if you want to fail or proceed without old images
      }
    }

    const finalImages = [...existingImages, ...newImageUrls];

    // Check if the image array has actually changed
    if (
      !car.images ||
      car.images.length !== finalImages.length ||
      car.images.some((img, i) => img !== finalImages[i])
    ) {
      changes.images = { old: car.images, new: finalImages };
      car.images = finalImages;
      updatedFields.push('images');
      console.log('📸 Updated images. Total:', finalImages.length);
    }

    

    console.log('📝 Total updated fields:', updatedFields.length, updatedFields);

    // Save changes if any updates were made
    if (updatedFields.length === 0) {
      cleanupFiles();
      return res.status(200).json({
        success: true,
        message: 'No changes detected',
        car,
        updatedFields: [],
        changes: {}
      });
    }

    // Save to database
    console.log('💾 Saving changes to database...');
    await car.save();
    await car.populate('companyId', 'name locations phone email');

    // Success response
    const executionTime = Date.now() - startTime;
    const vehicleTypeDisplay = (car.vehicleCategory === 'car' || car.vehicleCategory === 'van') 
      ? `${car.vehicleSubCategory || ''} ${car.vehicleCategory}`.trim()
      : car.vehicleCategory;

    console.log('✅ Vehicle updated successfully in', executionTime + 'ms');
    console.log('🎉 Updated fields:', updatedFields);

    res.json({
      success: true,
      message: `${vehicleTypeDisplay.charAt(0).toUpperCase() + vehicleTypeDisplay.slice(1)} updated successfully`,
      car,
      updatedFields,
      changes,
      executionTime: executionTime + 'ms',
      pricingInfo: {
        dailyWithoutDriver: car.pricing?.daily?.withoutDriver,
        dailyWithDriver: car.pricing?.daily?.withDriver,
        weeklyWithoutDriver: car.pricing?.weekly?.withoutDriver,
        weeklyWithDriver: car.pricing?.weekly?.withDriver,
        monthlyWithoutDriver: car.pricing?.monthly?.withoutDriver,
        monthlyWithDriver: car.pricing?.monthly?.withDriver,
        driverAvailable: car.driverAvailable
      }
    });

  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    console.error('❌ Update vehicle error:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    cleanupFiles();
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors,
        error: 'VALIDATION_ERROR',
        executionTime: executionTime + 'ms'
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid data format',
        error: 'CAST_ERROR',
        details: error.message,
        executionTime: executionTime + 'ms'
      });
    }
    
    return res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR',
      executionTime: executionTime + 'ms'
    });
  }
};

// Keep the existing functions for company cars, delete, and toggle availability
export const getCompanyCars = async (req: Request, res: Response) => {
  const { companyId } = req.params;

  try {
    // Check if company exists
    const company = await RentalCompany.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Rental company not found',
      });
    }

    // Find vehicles for this company, always latest first
    const cars = await Car.find({ companyId })
      .sort({ createdAt: -1 }) // 🔥 newest cars first
      .populate('companyId', 'name locations phone email');

    return res.status(200).json({
      success: true,
      cars,
      total: cars.length,
      message:
        cars.length === 0
          ? 'No vehicles found'
          : `Found ${cars.length} vehicles`,
    });
  } catch (error) {
    console.error('Error getting company vehicles:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const requestingUser = (req as any).user;

    if (!carId) {
      return res.status(400).json({
        message: 'Vehicle ID is required',
        error: 'MISSING_CAR_ID',
      });
    }

    const car = await Car.findById(carId).populate('companyId', 'ownerId');
    if (!car) {
      return res.status(404).json({
        message: 'Vehicle not found',
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
          'Access denied. You can only delete vehicles belonging to your company.',
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    await Car.findByIdAndDelete(carId);

    const vehicleTypeDisplay =
      car.vehicleCategory === 'car' || car.vehicleCategory === 'van'
        ? `${car.vehicleSubCategory} ${car.vehicleCategory}`
        : car.vehicleCategory;

    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
      deletedCar: {
        id: carId,
        vehicleCategory: car.vehicleCategory,
        vehicleSubCategory: car.vehicleSubCategory,
        vehicleType: vehicleTypeDisplay,
        brand: car.brand,
        carModel: car.carModel,
        licensePlate: car.licensePlate,
      },
    });
  } catch (error: any) {
    console.error('❌ Delete vehicle error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};

export const toggleCarAvailability = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const requestingUser = (req as any).user;

    if (!carId) {
      return res.status(400).json({
        message: 'Vehicle ID is required',
        error: 'MISSING_CAR_ID',
      });
    }

    const car = await Car.findById(carId).populate('companyId', 'ownerId');
    if (!car) {
      return res.status(404).json({
        message: 'Vehicle not found',
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
          'Access denied. You can only update vehicles belonging to your company.',
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    const previousStatus = car.isAvailable;
    car.isAvailable = !car.isAvailable;

    await car.save();
    await car.populate('companyId', 'name locations phone email');

    res.json({
      success: true,
      message: `Vehicle is now ${car.isAvailable ? 'available' : 'unavailable'}`,
      car,
      previousStatus,
      currentStatus: car.isAvailable,
    });
  } catch (error: any) {
    console.error('❌ Toggle vehicle availability error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
};