import { Request, Response } from 'express';
import {
  ProfileService,
  ProfileValidationError,
} from '../services/profile.service';

export class ProfileController {
  private profileService = ProfileService.getInstance();

  /**
   * Get complete user profile with all role-specific profiles
   */
  async getCompleteProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const userWithProfiles = await this.profileService.getUserWithProfiles(
        req.prisma,
        req.user.sub
      );

      if (!userWithProfiles) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      // Format response with all profiles
      const profileData: any = {
        user: {
          id: userWithProfiles.id,
          email: userWithProfiles.email,
          firstName: userWithProfiles.firstName,
          lastName: userWithProfiles.lastName,
          phone: userWithProfiles.phone,
          avatar: userWithProfiles.avatar,
          isEmailVerified: userWithProfiles.isEmailVerified,
          isPhoneVerified: userWithProfiles.isPhoneVerified,
          activeRole: userWithProfiles.activeRole,
          roles: userWithProfiles.roles.map((ur: any) => ur.role.name),
          lastLoginAt: userWithProfiles.lastLoginAt,
        },
        profiles: {},
      };

      // Add role-specific profiles
      if (userWithProfiles.customerProfile) {
        profileData.profiles.customer = {
          id: userWithProfiles.customerProfile.id,
          preferences: userWithProfiles.customerProfile.preferences,
          addresses: userWithProfiles.customerProfile.addresses,
          createdAt: userWithProfiles.customerProfile.createdAt,
          updatedAt: userWithProfiles.customerProfile.updatedAt,
        };
      }

      if (userWithProfiles.vendorProfile) {
        profileData.profiles.vendor = {
          id: userWithProfiles.vendorProfile.id,
          businessName: userWithProfiles.vendorProfile.businessName,
          businessType: userWithProfiles.vendorProfile.businessType,
          description: userWithProfiles.vendorProfile.description,
          logo: userWithProfiles.vendorProfile.logo,
          website: userWithProfiles.vendorProfile.website,
          subscriptionTier: userWithProfiles.vendorProfile.subscriptionTier,
          commissionRate: userWithProfiles.vendorProfile.commissionRate,
          isVerified: userWithProfiles.vendorProfile.isVerified,
          rating: userWithProfiles.vendorProfile.rating,
          totalSales: userWithProfiles.vendorProfile.totalSales,
          createdAt: userWithProfiles.vendorProfile.createdAt,
          updatedAt: userWithProfiles.vendorProfile.updatedAt,
        };
      }

      if (userWithProfiles.driverProfile) {
        profileData.profiles.driver = {
          id: userWithProfiles.driverProfile.id,
          licenseNumber: userWithProfiles.driverProfile.licenseNumber,
          vehicleInfo: userWithProfiles.driverProfile.vehicleInfo,
          isOnline: userWithProfiles.driverProfile.isOnline,
          currentLocation: userWithProfiles.driverProfile.currentLocation,
          rating: userWithProfiles.driverProfile.rating,
          totalRides: userWithProfiles.driverProfile.totalRides,
          isVerified: userWithProfiles.driverProfile.isVerified,
          subscriptionTier: userWithProfiles.driverProfile.subscriptionTier,
          createdAt: userWithProfiles.driverProfile.createdAt,
          updatedAt: userWithProfiles.driverProfile.updatedAt,
        };
      }

      if (userWithProfiles.hostProfile) {
        profileData.profiles.host = {
          id: userWithProfiles.hostProfile.id,
          businessName: userWithProfiles.hostProfile.businessName,
          description: userWithProfiles.hostProfile.description,
          rating: userWithProfiles.hostProfile.rating,
          totalBookings: userWithProfiles.hostProfile.totalBookings,
          isVerified: userWithProfiles.hostProfile.isVerified,
          subscriptionTier: userWithProfiles.hostProfile.subscriptionTier,
          responseRate: userWithProfiles.hostProfile.responseRate,
          responseTime: userWithProfiles.hostProfile.responseTime,
          createdAt: userWithProfiles.hostProfile.createdAt,
          updatedAt: userWithProfiles.hostProfile.updatedAt,
        };
      }

      if (userWithProfiles.advertiserProfile) {
        profileData.profiles.advertiser = {
          id: userWithProfiles.advertiserProfile.id,
          companyName: userWithProfiles.advertiserProfile.companyName,
          industry: userWithProfiles.advertiserProfile.industry,
          website: userWithProfiles.advertiserProfile.website,
          totalSpend: userWithProfiles.advertiserProfile.totalSpend,
          isVerified: userWithProfiles.advertiserProfile.isVerified,
          createdAt: userWithProfiles.advertiserProfile.createdAt,
          updatedAt: userWithProfiles.advertiserProfile.updatedAt,
        };
      }

      res.json({
        success: true,
        data: profileData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get complete profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile',
        code: 'GET_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update customer profile
   */
  async updateCustomerProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has CUSTOMER role
      const user = await req.prisma.user.findUnique({
        where: { id: req.user.sub },
        include: {
          roles: {
            include: { role: true },
          },
        },
      });

      const hasCustomerRole = user?.roles.some(
        (ur: any) => ur.role.name === 'CUSTOMER'
      );
      if (!hasCustomerRole) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Customer role required.',
          code: 'INSUFFICIENT_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      const updatedProfile = await this.profileService.updateCustomerProfile(
        req.prisma,
        req.user.sub,
        req.body
      );

      res.json({
        success: true,
        data: {
          profile: updatedProfile,
        },
        message: 'Customer profile updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update customer profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update customer profile',
        code: 'UPDATE_CUSTOMER_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update vendor profile
   */
  async updateVendorProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has VENDOR role
      const hasVendorRole = await this.profileService.verifyUserRole(
        req.prisma,
        req.user.sub,
        'VENDOR'
      );

      if (!hasVendorRole) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Vendor role required.',
          code: 'INSUFFICIENT_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      const updatedProfile = await this.profileService.updateVendorProfile(
        req.prisma,
        req.user.sub,
        req.body
      );

      res.json({
        success: true,
        data: {
          profile: updatedProfile,
        },
        message: 'Vendor profile updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update vendor profile error:', error);

      if (error instanceof ProfileValidationError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: 'PROFILE_VALIDATION_ERROR',
          field: error.field,
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update vendor profile',
        code: 'UPDATE_VENDOR_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update driver profile
   */
  async updateDriverProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has DRIVER role
      const hasDriverRole = await this.profileService.verifyUserRole(
        req.prisma,
        req.user.sub,
        'DRIVER'
      );

      if (!hasDriverRole) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Driver role required.',
          code: 'INSUFFICIENT_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      const updatedProfile = await this.profileService.updateDriverProfile(
        req.prisma,
        req.user.sub,
        req.body
      );

      res.json({
        success: true,
        data: {
          profile: updatedProfile,
        },
        message: 'Driver profile updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update driver profile error:', error);

      if (error instanceof ProfileValidationError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: 'PROFILE_VALIDATION_ERROR',
          field: error.field,
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update driver profile',
        code: 'UPDATE_DRIVER_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update host profile
   */
  async updateHostProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has HOST role
      const hasHostRole = await this.profileService.verifyUserRole(
        req.prisma,
        req.user.sub,
        'HOST'
      );

      if (!hasHostRole) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Host role required.',
          code: 'INSUFFICIENT_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      const updatedProfile = await this.profileService.updateHostProfile(
        req.prisma,
        req.user.sub,
        req.body
      );

      res.json({
        success: true,
        data: {
          profile: updatedProfile,
        },
        message: 'Host profile updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update host profile error:', error);

      if (error instanceof ProfileValidationError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: 'PROFILE_VALIDATION_ERROR',
          field: error.field,
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update host profile',
        code: 'UPDATE_HOST_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update advertiser profile
   */
  async updateAdvertiserProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has ADVERTISER role
      const hasAdvertiserRole = await this.profileService.verifyUserRole(
        req.prisma,
        req.user.sub,
        'ADVERTISER'
      );

      if (!hasAdvertiserRole) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Advertiser role required.',
          code: 'INSUFFICIENT_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      const updatedProfile = await this.profileService.updateAdvertiserProfile(
        req.prisma,
        req.user.sub,
        req.body
      );

      res.json({
        success: true,
        data: {
          profile: updatedProfile,
        },
        message: 'Advertiser profile updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update advertiser profile error:', error);

      if (error instanceof ProfileValidationError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: 'PROFILE_VALIDATION_ERROR',
          field: error.field,
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update advertiser profile',
        code: 'UPDATE_ADVERTISER_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Add customer address
   */
  async addCustomerAddress(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has CUSTOMER role
      const user = await req.prisma.user.findUnique({
        where: { id: req.user.sub },
        include: {
          roles: {
            include: { role: true },
          },
        },
      });

      const hasCustomerRole = user?.roles.some(
        (ur: any) => ur.role.name === 'CUSTOMER'
      );
      if (!hasCustomerRole) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Customer role required.',
          code: 'INSUFFICIENT_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      const address = await this.profileService.addCustomerAddress(
        req.prisma,
        req.user.sub,
        req.body
      );

      res.status(201).json({
        success: true,
        data: {
          address,
        },
        message: 'Address added successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Add customer address error:', error);

      if (
        error instanceof Error &&
        error.message === 'Customer profile not found'
      ) {
        return res.status(404).json({
          success: false,
          error: 'Customer profile not found',
          code: 'CUSTOMER_PROFILE_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to add address',
        code: 'ADD_ADDRESS_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update customer address
   */
  async updateCustomerAddress(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { addressId } = req.params;

      const address = await this.profileService.updateCustomerAddress(
        req.prisma,
        req.user.sub,
        addressId,
        req.body
      );

      res.json({
        success: true,
        data: {
          address,
        },
        message: 'Address updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update customer address error:', error);

      if (
        error instanceof Error &&
        error.message === 'Address not found or access denied'
      ) {
        return res.status(404).json({
          success: false,
          error: 'Address not found or access denied',
          code: 'ADDRESS_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update address',
        code: 'UPDATE_ADDRESS_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Delete customer address
   */
  async deleteCustomerAddress(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { addressId } = req.params;

      await this.profileService.deleteCustomerAddress(
        req.prisma,
        req.user.sub,
        addressId
      );

      res.json({
        success: true,
        message: 'Address deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Delete customer address error:', error);

      if (
        error instanceof Error &&
        error.message === 'Address not found or access denied'
      ) {
        return res.status(404).json({
          success: false,
          error: 'Address not found or access denied',
          code: 'ADDRESS_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to delete address',
        code: 'DELETE_ADDRESS_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get profile statistics for current user's role
   */
  async getProfileStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { role } = req.params;
      const validRoles = ['vendor', 'driver', 'host', 'advertiser'];

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role specified',
          code: 'INVALID_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      // Verify user has the requested role
      const hasRole = await this.profileService.verifyUserRole(
        req.prisma,
        req.user.sub,
        role.toUpperCase() as any
      );

      if (!hasRole) {
        return res.status(403).json({
          success: false,
          error: `Access denied. ${role} role required.`,
          code: 'INSUFFICIENT_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      let stats;
      switch (role) {
        case 'vendor':
          stats = await this.profileService.getVendorStats(
            req.prisma,
            req.user.sub
          );
          break;
        case 'driver':
          stats = await this.profileService.getDriverStats(
            req.prisma,
            req.user.sub
          );
          break;
        case 'host':
          stats = await this.profileService.getHostStats(
            req.prisma,
            req.user.sub
          );
          break;
        case 'advertiser':
          stats = await this.profileService.getAdvertiserStats(
            req.prisma,
            req.user.sub
          );
          break;
      }

      res.json({
        success: true,
        data: {
          role,
          stats,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get profile stats error:', error);

      if (error instanceof ProfileValidationError) {
        return res.status(404).json({
          success: false,
          error: error.message,
          code: 'PROFILE_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to get profile statistics',
        code: 'GET_PROFILE_STATS_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update profile verification status (admin only)
   */
  async updateProfileVerification(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has ADMIN role
      const hasAdminRole = await this.profileService.verifyUserRole(
        req.prisma,
        req.user.sub,
        'ADMIN'
      );

      if (!hasAdminRole) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Admin role required.',
          code: 'INSUFFICIENT_ROLE',
          timestamp: new Date().toISOString(),
        });
      }

      const { userId, role, isVerified } = req.body;

      const updatedProfile =
        await this.profileService.updateProfileVerification(
          req.prisma,
          userId,
          role,
          isVerified,
          req.user.sub
        );

      res.json({
        success: true,
        data: {
          profile: updatedProfile,
        },
        message: `${role} profile verification updated successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update profile verification error:', error);

      if (error instanceof ProfileValidationError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: 'PROFILE_VALIDATION_ERROR',
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update profile verification',
        code: 'UPDATE_VERIFICATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update profile rating (for external rating systems)
   */
  async updateProfileRating(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // This would typically be called by an internal service or admin
      // For now, we'll allow users to update their own ratings (could be restricted)
      const { userId, role, rating } = req.body;

      // If userId is not provided, use current user
      const targetUserId = userId || req.user.sub;

      const updatedProfile = await this.profileService.updateProfileRating(
        req.prisma,
        targetUserId,
        role,
        rating
      );

      res.json({
        success: true,
        data: {
          profile: updatedProfile,
        },
        message: `${role} profile rating updated successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update profile rating error:', error);

      if (error instanceof ProfileValidationError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: 'PROFILE_VALIDATION_ERROR',
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update profile rating',
        code: 'UPDATE_RATING_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
