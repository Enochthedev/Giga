import { Prisma, PrismaClient, RoleName } from '../generated/prisma-client';

const prisma = new PrismaClient();

interface CustomerProfileUpdateData {
  preferences?: Prisma.InputJsonValue;
}

interface VendorProfileUpdateData {
  businessName?: string;
  businessType?: string;
  description?: string;
  logo?: string;
  website?: string;
  subscriptionTier?: 'BASIC' | 'PRO' | 'ENTERPRISE';
}

interface DriverProfileUpdateData {
  licenseNumber?: string;
  vehicleInfo?: Prisma.InputJsonValue;
  isOnline?: boolean;
  currentLocation?: Prisma.InputJsonValue;
  subscriptionTier?: 'BASIC' | 'PRO';
}

interface HostProfileUpdateData {
  businessName?: string;
  description?: string;
  subscriptionTier?: 'BASIC' | 'PRO';
  responseRate?: number;
  responseTime?: number;
}

interface AdvertiserProfileUpdateData {
  companyName?: string;
  industry?: string;
  website?: string;
}

// Removed unused interfaces - they are defined inline where needed

// Business logic validation errors
export class ProfileValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ProfileValidationError';
  }
}

export class InsufficientRoleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientRoleError';
  }
}

interface AddressCreateData {
  label: string;
  address: string;
  city: string;
  country: string;
  isDefault?: boolean;
}

interface AddressUpdateData {
  label?: string;
  address?: string;
  city?: string;
  country?: string;
  isDefault?: boolean;
}

export class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Create all necessary profiles for user roles with enhanced initialization
   */
  async createProfilesForRoles(
    prismaClient: PrismaClient,
    userId: string,
    roles: RoleName[]
  ): Promise<void> {
    const profileCreationPromises = [];

    for (const role of roles) {
      switch (role) {
        case 'CUSTOMER':
          profileCreationPromises.push(
            prisma.customerProfile.upsert({
              where: { userId },
              create: {
                userId: userId,
                preferences: {
                  language: 'en',
                  currency: 'USD',
                  notifications: {
                    email: true,
                    sms: false,
                    push: true,
                  },
                  privacy: {
                    shareLocation: false,
                    shareProfile: true,
                  },
                },
              },
              update: {},
            })
          );
          break;

        case 'VENDOR':
          profileCreationPromises.push(
            prisma.vendorProfile.upsert({
              where: { userId },
              create: {
                userId: userId,
                businessName: '',
                businessType: '',
                subscriptionTier: 'BASIC',
                commissionRate: 0.15,
                isVerified: false,
                totalSales: 0,
                rating: null,
              },
              update: {},
            })
          );
          break;

        case 'DRIVER':
          profileCreationPromises.push(
            prisma.driverProfile.upsert({
              where: { userId },
              create: {
                userId: userId,
                licenseNumber: '',
                vehicleInfo: {
                  verified: false,
                  documents: [],
                },
                isOnline: false,
                totalRides: 0,
                isVerified: false,
                subscriptionTier: 'BASIC',
                rating: null,
                currentLocation: null as any,
              },
              update: {},
            })
          );
          break;

        case 'HOST':
          profileCreationPromises.push(
            prisma.hostProfile.upsert({
              where: { userId },
              create: {
                userId: userId,
                totalBookings: 0,
                isVerified: false,
                subscriptionTier: 'BASIC',
                rating: null,
                responseRate: null,
                responseTime: null,
              },
              update: {},
            })
          );
          break;

        case 'ADVERTISER':
          profileCreationPromises.push(
            prisma.advertiserProfile.upsert({
              where: { userId },
              create: {
                userId: userId,
                companyName: '',
                industry: '',
                totalSpend: 0,
                isVerified: false,
              },
              update: {},
            })
          );
          break;
      }
    }

    await Promise.all(profileCreationPromises);
  }

  /**
   * Get user profile with all role-specific profiles
   */
  async getUserWithProfiles(prismaClient: PrismaClient, userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        customerProfile: {
          include: {
            addresses: true,
          },
        },
        vendorProfile: true,
        driverProfile: true,
        hostProfile: true,
        advertiserProfile: true,
      },
    });
  }

  /**
   * Update customer profile
   */
  async updateCustomerProfile(
    prismaClient: PrismaClient,
    userId: string,
    data: CustomerProfileUpdateData
  ) {
    return prisma.customerProfile.update({
      where: { userId },
      data: {
        preferences: data.preferences,
      },
      include: {
        addresses: true,
      },
    });
  }

  /**
   * Update vendor profile with enhanced business logic
   */
  async updateVendorProfile(
    prismaClient: PrismaClient,
    userId: string,
    data: VendorProfileUpdateData
  ) {
    // Get current profile to validate business rules
    const currentProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!currentProfile) {
      throw new ProfileValidationError('Vendor profile not found');
    }

    const updateData: Partial<VendorProfileUpdateData> = {};

    // Business name validation
    if (data.businessName !== undefined) {
      if (data.businessName.trim().length === 0) {
        throw new ProfileValidationError(
          'Business name cannot be empty',
          'businessName'
        );
      }

      // Check for duplicate business names (optional business rule)
      const existingBusiness = await prisma.vendorProfile.findFirst({
        where: {
          businessName: data.businessName,
          userId: { not: userId },
        },
      });

      if (existingBusiness) {
        throw new ProfileValidationError(
          'Business name already exists',
          'businessName'
        );
      }

      updateData.businessName = data.businessName;
    }

    // Business type validation
    if (data.businessType !== undefined) {
      const validBusinessTypes = [
        'Electronics',
        'Clothing',
        'Food & Beverage',
        'Health & Beauty',
        'Home & Garden',
        'Sports & Outdoors',
        'Books & Media',
        'Automotive',
        'Services',
        'Other',
      ];

      if (!validBusinessTypes.includes(data.businessType)) {
        throw new ProfileValidationError(
          'Invalid business type',
          'businessType'
        );
      }

      updateData.businessType = data.businessType;
    }

    // Description validation
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    // Logo URL validation
    if (data.logo !== undefined) {
      updateData.logo = data.logo;
    }

    // Website URL validation
    if (data.website !== undefined) {
      updateData.website = data.website;
    }

    // Subscription tier validation with business rules
    if (data.subscriptionTier !== undefined) {
      // Check if downgrade is allowed
      if (
        currentProfile.subscriptionTier === 'ENTERPRISE' &&
        data.subscriptionTier !== 'ENTERPRISE'
      ) {
        // Could add business rules here, e.g., check if they have active enterprise features
        console.warn(
          `Vendor ${userId} downgrading from ENTERPRISE to ${data.subscriptionTier}`
        );
      }

      updateData.subscriptionTier = data.subscriptionTier;
    }

    return prisma.vendorProfile.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * Update driver profile with enhanced business logic
   */
  async updateDriverProfile(
    prismaClient: PrismaClient,
    userId: string,
    data: DriverProfileUpdateData
  ) {
    // Get current profile to validate business rules
    const currentProfile = await prisma.driverProfile.findUnique({
      where: { userId },
    });

    if (!currentProfile) {
      throw new ProfileValidationError('Driver profile not found');
    }

    const updateData: Partial<DriverProfileUpdateData> = {};

    // License number validation
    if (data.licenseNumber !== undefined) {
      if (data.licenseNumber.trim().length === 0) {
        throw new ProfileValidationError(
          'License number cannot be empty',
          'licenseNumber'
        );
      }

      // Check for duplicate license numbers
      const existingLicense = await prisma.driverProfile.findFirst({
        where: {
          licenseNumber: data.licenseNumber,
          userId: { not: userId },
        },
      });

      if (existingLicense) {
        throw new ProfileValidationError(
          'License number already registered',
          'licenseNumber'
        );
      }

      updateData.licenseNumber = data.licenseNumber;
    }

    // Vehicle info validation with enhanced structure
    if (data.vehicleInfo !== undefined) {
      const vehicleInfo = data.vehicleInfo as any;

      // Validate required vehicle fields if provided
      if (vehicleInfo.make && vehicleInfo.model && vehicleInfo.year) {
        const currentYear = new Date().getFullYear();
        if (vehicleInfo.year < 1900 || vehicleInfo.year > currentYear + 1) {
          throw new ProfileValidationError(
            'Invalid vehicle year',
            'vehicleInfo.year'
          );
        }
      }

      // Merge with existing vehicle info to preserve verification status
      const currentVehicleInfo = (currentProfile.vehicleInfo as any) || {};
      updateData.vehicleInfo = {
        ...currentVehicleInfo,
        ...vehicleInfo,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Online status validation
    if (data.isOnline !== undefined) {
      // Business rule: Can only go online if verified and has complete vehicle info
      if (data.isOnline && !currentProfile.isVerified) {
        throw new ProfileValidationError(
          'Cannot go online without driver verification',
          'isOnline'
        );
      }

      const vehicleInfo = (updateData.vehicleInfo ||
        currentProfile.vehicleInfo) as any;
      if (data.isOnline && (!vehicleInfo?.make || !vehicleInfo?.model)) {
        throw new ProfileValidationError(
          'Cannot go online without complete vehicle information',
          'isOnline'
        );
      }

      updateData.isOnline = data.isOnline;
    }

    // Location validation
    if (data.currentLocation !== undefined) {
      if (data.currentLocation === null) {
        updateData.currentLocation = null as any;
      } else {
        const location = data.currentLocation as any;

        // Validate coordinates
        if (location.latitude < -90 || location.latitude > 90) {
          throw new ProfileValidationError(
            'Invalid latitude',
            'currentLocation.latitude'
          );
        }
        if (location.longitude < -180 || location.longitude > 180) {
          throw new ProfileValidationError(
            'Invalid longitude',
            'currentLocation.longitude'
          );
        }

        updateData.currentLocation = {
          ...location,
          timestamp: new Date().toISOString(),
        };
      }
    }

    // Subscription tier validation
    if (data.subscriptionTier !== undefined) {
      updateData.subscriptionTier = data.subscriptionTier;
    }

    return prisma.driverProfile.update({
      where: { userId },
      data: updateData as Prisma.DriverProfileUpdateInput,
    });
  }

  /**
   * Update host profile with enhanced business logic
   */
  async updateHostProfile(
    prismaClient: PrismaClient,
    userId: string,
    data: HostProfileUpdateData
  ) {
    // Get current profile to validate business rules
    const currentProfile = await prisma.hostProfile.findUnique({
      where: { userId },
    });

    if (!currentProfile) {
      throw new ProfileValidationError('Host profile not found');
    }

    const updateData: Partial<HostProfileUpdateData> = {};

    // Business name validation
    if (data.businessName !== undefined) {
      updateData.businessName = data.businessName;
    }

    // Description validation
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    // Response rate validation
    if (data.responseRate !== undefined) {
      if (data.responseRate < 0 || data.responseRate > 100) {
        throw new ProfileValidationError(
          'Response rate must be between 0 and 100',
          'responseRate'
        );
      }
      updateData.responseRate = data.responseRate;
    }

    // Response time validation (in minutes)
    if (data.responseTime !== undefined) {
      if (data.responseTime < 1 || data.responseTime > 1440) {
        // 1 minute to 24 hours
        throw new ProfileValidationError(
          'Response time must be between 1 and 1440 minutes',
          'responseTime'
        );
      }
      updateData.responseTime = data.responseTime;
    }

    // Subscription tier validation with business rules
    if (data.subscriptionTier !== undefined) {
      // Check if downgrade is allowed based on current bookings
      if (
        currentProfile.subscriptionTier === 'PRO' &&
        data.subscriptionTier === 'BASIC'
      ) {
        // Could add business rules here, e.g., check active bookings
        console.warn(`Host ${userId} downgrading from PRO to BASIC`);
      }

      updateData.subscriptionTier = data.subscriptionTier;
    }

    return prisma.hostProfile.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * Update advertiser profile with enhanced business logic
   */
  async updateAdvertiserProfile(
    prismaClient: PrismaClient,
    userId: string,
    data: AdvertiserProfileUpdateData
  ) {
    // Get current profile to validate business rules
    const currentProfile = await prisma.advertiserProfile.findUnique({
      where: { userId },
    });

    if (!currentProfile) {
      throw new ProfileValidationError('Advertiser profile not found');
    }

    const updateData: Partial<AdvertiserProfileUpdateData> = {};

    // Company name validation
    if (data.companyName !== undefined) {
      if (data.companyName.trim().length === 0) {
        throw new ProfileValidationError(
          'Company name cannot be empty',
          'companyName'
        );
      }

      // Check for duplicate company names (optional business rule)
      const existingCompany = await prisma.advertiserProfile.findFirst({
        where: {
          companyName: data.companyName,
          userId: { not: userId },
        },
      });

      if (existingCompany) {
        throw new ProfileValidationError(
          'Company name already exists',
          'companyName'
        );
      }

      updateData.companyName = data.companyName;
    }

    // Industry validation
    if (data.industry !== undefined) {
      const validIndustries = [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Retail',
        'Manufacturing',
        'Real Estate',
        'Entertainment',
        'Travel',
        'Food & Beverage',
        'Automotive',
        'Fashion',
        'Sports',
        'Non-Profit',
        'Government',
        'Other',
      ];

      if (!validIndustries.includes(data.industry)) {
        throw new ProfileValidationError('Invalid industry type', 'industry');
      }

      updateData.industry = data.industry;
    }

    // Website validation
    if (data.website !== undefined) {
      updateData.website = data.website;
    }

    return prisma.advertiserProfile.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * Add address to customer profile
   */
  async addCustomerAddress(
    prismaClient: PrismaClient,
    userId: string,
    addressData: AddressCreateData
  ) {
    // Get customer profile
    const customerProfile = await prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!customerProfile) {
      throw new Error('Customer profile not found');
    }

    // If this is the first address or marked as default, make it default
    if (addressData.isDefault) {
      // Remove default from other addresses
      await prisma.address.updateMany({
        where: { customerProfileId: customerProfile.id },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        customerProfileId: customerProfile.id,
        label: addressData.label,
        address: addressData.address,
        city: addressData.city,
        country: addressData.country,
        isDefault: addressData.isDefault ?? false,
      },
    });
  }

  /**
   * Update customer address
   */
  async updateCustomerAddress(
    prismaClient: PrismaClient,
    userId: string,
    addressId: string,
    addressData: AddressUpdateData
  ) {
    // Verify the address belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        customerProfile: {
          userId: userId,
        },
      },
    });

    if (!address) {
      throw new Error('Address not found or access denied');
    }

    // If setting as default, remove default from other addresses
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: {
          customerProfile: {
            userId: userId,
          },
          id: { not: addressId },
        },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data: {
        label: addressData.label,
        address: addressData.address,
        city: addressData.city,
        country: addressData.country,
        isDefault: addressData.isDefault,
      },
    });
  }

  /**
   * Delete customer address
   */
  async deleteCustomerAddress(
    prismaClient: PrismaClient,
    userId: string,
    addressId: string
  ) {
    // Verify the address belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        customerProfile: {
          userId: userId,
        },
      },
    });

    if (!address) {
      throw new Error('Address not found or access denied');
    }

    return prisma.address.delete({
      where: { id: addressId },
    });
  }

  /**
   * Verify user has specific role
   */
  async verifyUserRole(
    prismaClient: PrismaClient,
    userId: string,
    requiredRole: RoleName
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      return false;
    }

    return user.roles.some((ur: any) => ur.role.name === requiredRole);
  }

  /**
   * Get profile statistics for vendor
   */
  async getVendorStats(prismaClient: PrismaClient, userId: string) {
    const profile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ProfileValidationError('Vendor profile not found');
    }

    return {
      totalSales: profile.totalSales,
      rating: profile.rating,
      isVerified: profile.isVerified,
      subscriptionTier: profile.subscriptionTier,
      commissionRate: profile.commissionRate,
      // Could add more computed stats here
      salesGrowth: 0, // Placeholder for future implementation
      customerCount: 0, // Placeholder for future implementation
    };
  }

  /**
   * Get profile statistics for driver
   */
  async getDriverStats(prismaClient: PrismaClient, userId: string) {
    const profile = await prisma.driverProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ProfileValidationError('Driver profile not found');
    }

    return {
      totalRides: profile.totalRides,
      rating: profile.rating,
      isVerified: profile.isVerified,
      isOnline: profile.isOnline,
      subscriptionTier: profile.subscriptionTier,
      // Could add more computed stats here
      earnings: 0, // Placeholder for future implementation
      completionRate: 0, // Placeholder for future implementation
    };
  }

  /**
   * Get profile statistics for host
   */
  async getHostStats(prismaClient: PrismaClient, userId: string) {
    const profile = await prisma.hostProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ProfileValidationError('Host profile not found');
    }

    return {
      totalBookings: profile.totalBookings,
      rating: profile.rating,
      isVerified: profile.isVerified,
      responseRate: profile.responseRate,
      responseTime: profile.responseTime,
      subscriptionTier: profile.subscriptionTier,
      // Could add more computed stats here
      occupancyRate: 0, // Placeholder for future implementation
      revenue: 0, // Placeholder for future implementation
    };
  }

  /**
   * Get profile statistics for advertiser
   */
  async getAdvertiserStats(prismaClient: PrismaClient, userId: string) {
    const profile = await prisma.advertiserProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ProfileValidationError('Advertiser profile not found');
    }

    return {
      totalSpend: profile.totalSpend,
      isVerified: profile.isVerified,
      // Could add more computed stats here
      activeCampaigns: 0, // Placeholder for future implementation
      impressions: 0, // Placeholder for future implementation
      clicks: 0, // Placeholder for future implementation
      conversions: 0, // Placeholder for future implementation
    };
  }

  /**
   * Update profile verification status (admin only)
   */
  updateProfileVerification(
    _prisma: PrismaClient,
    userId: string,
    role: RoleName,
    isVerified: boolean,
    _adminUserId: string
  ) {
    // Verify admin has permission (this would be checked in controller)

    switch (role) {
      case 'VENDOR':
        return prisma.vendorProfile.update({
          where: { userId },
          data: { isVerified },
        });

      case 'DRIVER':
        return prisma.driverProfile.update({
          where: { userId },
          data: { isVerified },
        });

      case 'HOST':
        return prisma.hostProfile.update({
          where: { userId },
          data: { isVerified },
        });

      case 'ADVERTISER':
        return prisma.advertiserProfile.update({
          where: { userId },
          data: { isVerified },
        });

      default:
        throw new ProfileValidationError('Invalid role for verification');
    }
  }

  /**
   * Bulk update profile ratings (for external rating systems)
   */
  updateProfileRating(
    _prisma: PrismaClient,
    userId: string,
    role: RoleName,
    rating: number
  ) {
    if (rating < 0 || rating > 5) {
      throw new ProfileValidationError('Rating must be between 0 and 5');
    }

    switch (role) {
      case 'VENDOR':
        return prisma.vendorProfile.update({
          where: { userId },
          data: { rating },
        });

      case 'DRIVER':
        return prisma.driverProfile.update({
          where: { userId },
          data: { rating },
        });

      case 'HOST':
        return prisma.hostProfile.update({
          where: { userId },
          data: { rating },
        });

      default:
        throw new ProfileValidationError('Invalid role for rating update');
    }
  }
}
