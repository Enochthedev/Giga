import { Request, Response } from 'express';
import {
  ProfileService,
  ProfileValidationError,
} from '../services/profile.service';
import { InputSanitizer } from '../utils/input-sanitizer';
import { PhoneNumberValidator } from '../utils/phone-validator';

export class ProfileController {
  private profileService = ProfileService.getInstance();

  /**
   * Update basic user profile information
   */
  async updateBasicProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { firstName, lastName, phone, dateOfBirth, gender, avatar } =
        req.body;
      const updateData: any = {};

      // Sanitize and validate inputs
      if (firstName !== undefined) {
        updateData.firstName = InputSanitizer.sanitizeName(firstName);
        if (!updateData.firstName || updateData.firstName.length < 1) {
          return res.status(400).json({
            success: false,
            error: 'First name is required and must be valid',
            code: 'INVALID_FIRST_NAME',
            timestamp: new Date().toISOString(),
          });
        }
      }

      if (lastName !== undefined) {
        updateData.lastName = InputSanitizer.sanitizeName(lastName);
        if (!updateData.lastName || updateData.lastName.length < 1) {
          return res.status(400).json({
            success: false,
            error: 'Last name is required and must be valid',
            code: 'INVALID_LAST_NAME',
            timestamp: new Date().toISOString(),
          });
        }
      }

      if (phone !== undefined) {
        if (phone === null || phone === '') {
          // Allow clearing phone number
          updateData.phone = null;
          updateData.isPhoneVerified = false;
        } else {
          const sanitizedPhone = PhoneNumberValidator.sanitize(phone);
          const phoneValidation = PhoneNumberValidator.validate(sanitizedPhone);

          if (!phoneValidation.isValid) {
            return res.status(400).json({
              success: false,
              error: 'Invalid phone number',
              details: phoneValidation.errors,
              code: 'INVALID_PHONE',
              timestamp: new Date().toISOString(),
            });
          }

          // Check if phone is already taken by another user
          const existingUser = await req._prisma.user.findFirst({
            where: {
              phone: phoneValidation.formatted,
              id: { not: req.user.sub },
            },
          });

          if (existingUser) {
            return res.status(409).json({
              success: false,
              error: 'Phone number is already registered to another account',
              code: 'PHONE_ALREADY_EXISTS',
              timestamp: new Date().toISOString(),
            });
          }

          updateData.phone = phoneValidation.formatted;
          // Reset phone verification if phone number changed
          const currentUser = await req._prisma.user.findUnique({
            where: { id: req.user.sub },
            select: { phone: true },
          });

          if (currentUser?.phone !== phoneValidation.formatted) {
            updateData.isPhoneVerified = false;
          }
        }
      }

      if (dateOfBirth !== undefined) {
        if (dateOfBirth) {
          const birthDate = new Date(dateOfBirth);
          if (isNaN(birthDate.getTime())) {
            return res.status(400).json({
              success: false,
              error: 'Invalid date of birth format',
              code: 'INVALID_DATE_OF_BIRTH',
              timestamp: new Date().toISOString(),
            });
          }

          // Check if user is at least 13 years old
          const minAge = new Date();
          minAge.setFullYear(minAge.getFullYear() - 13);
          if (birthDate > minAge) {
            return res.status(400).json({
              success: false,
              error: 'User must be at least 13 years old',
              code: 'AGE_RESTRICTION',
              timestamp: new Date().toISOString(),
            });
          }

          updateData.dateOfBirth = birthDate;
        } else {
          updateData.dateOfBirth = null;
        }
      }

      if (gender !== undefined) {
        const validGenders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
        if (gender && !validGenders.includes(gender)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid gender value',
            code: 'INVALID_GENDER',
            timestamp: new Date().toISOString(),
          });
        }
        updateData.gender = gender;
      }

      if (avatar !== undefined) {
        // Basic URL validation for avatar
        if (avatar && typeof avatar === 'string') {
          try {
            new URL(avatar);
            updateData.avatar = avatar;
          } catch {
            return res.status(400).json({
              success: false,
              error: 'Invalid avatar URL format',
              code: 'INVALID_AVATAR_URL',
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          updateData.avatar = null;
        }
      }

      // Update user profile
      const updatedUser = await req._prisma.user.update({
        where: { id: req.user.sub },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          updatedAt: true,
        },
      });

      // Format phone for response
      const responseData = {
        ...updatedUser,
        phone: updatedUser.phone
          ? PhoneNumberValidator.formatForDisplay(updatedUser.phone)
          : null,
      };

      res.json({
        success: true,
        data: {
          user: responseData,
        },
        message: 'Profile updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update basic profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

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
        req._prisma,
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
          phone: userWithProfiles.phone
            ? PhoneNumberValidator.formatForDisplay(userWithProfiles.phone)
            : null,
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
          loyaltyPoints:
            (userWithProfiles.customerProfile as any)?.loyaltyPoints || 0,
          membershipTier:
            (userWithProfiles.customerProfile as any)?.membershipTier ||
            'BRONZE',
          totalOrders:
            (userWithProfiles.customerProfile as any)?.totalOrders || 0,
          totalSpent:
            (userWithProfiles.customerProfile as any)?.totalSpent || 0,
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
          hostType:
            (userWithProfiles.hostProfile as any)?.hostType || 'INDIVIDUAL',
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
          totalCampaigns:
            (userWithProfiles.advertiserProfile as any)?.totalCampaigns || 0,
          subscriptionTier:
            (userWithProfiles.advertiserProfile as any)?.subscriptionTier ||
            'BASIC',
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
      const user = await req._prisma.user.findUnique({
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
      const user = await req._prisma.user.findUnique({
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
        req._prisma,
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
            req._prisma,
            req.user.sub
          );
          break;
        case 'driver':
          stats = await this.profileService.getDriverStats(
            req._prisma,
            req.user.sub
          );
          break;
        case 'host':
          stats = await this.profileService.getHostStats(
            req._prisma,
            req.user.sub
          );
          break;
        case 'advertiser':
          stats = await this.profileService.getAdvertiserStats(
            req._prisma,
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
        req._prisma,
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
          req._prisma,
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
        req._prisma,
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
