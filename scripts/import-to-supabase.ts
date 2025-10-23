#!/usr/bin/env tsx

/**
 * Import script to migrate user data from auth service to Supabase
 * Run this script after exporting data to complete the migration
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface ImportStats {
  totalUsers: number;
  successfulImports: number;
  failedImports: number;
  errors: Array<{ email: string; error: string }>;
}

async function importToSupabase() {
  try {
    console.log('🚀 Starting Supabase import...');

    // Read exported data
    const exportPath = path.join(
      process.cwd(),
      'migration-data',
      'auth-export.json'
    );
    if (!fs.existsSync(exportPath)) {
      throw new Error(
        'Export file not found. Please run export-auth-data.ts first.'
      );
    }

    const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    console.log(`📊 Found ${exportData.length} users to import`);

    const stats: ImportStats = {
      totalUsers: exportData.length,
      successfulImports: 0,
      failedImports: 0,
      errors: [],
    };

    // Process users in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < exportData.length; i += batchSize) {
      const batch = exportData.slice(i, i + batchSize);
      console.log(
        `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(exportData.length / batchSize)}`
      );

      await Promise.all(
        batch.map(async (user: any) => {
          try {
            await importUser(user);
            stats.successfulImports++;
            console.log(`✅ Imported: ${user.email}`);
          } catch (error) {
            stats.failedImports++;
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            stats.errors.push({ email: user.email, error: errorMessage });
            console.error(`❌ Failed to import ${user.email}:`, errorMessage);
          }
        })
      );

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Save import results
    const resultsPath = path.join(
      process.cwd(),
      'migration-data',
      'import-results.json'
    );
    fs.writeFileSync(resultsPath, JSON.stringify(stats, null, 2));

    console.log('\n🎉 Import completed!');
    console.log(`✅ Successful imports: ${stats.successfulImports}`);
    console.log(`❌ Failed imports: ${stats.failedImports}`);
    console.log(`📁 Detailed results saved to: ${resultsPath}`);

    if (stats.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      stats.errors.forEach(({ email, error }) => {
        console.log(`   ${email}: ${error}`);
      });
    }
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

async function importUser(user: any) {
  // 1. Create user in Supabase Auth
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email: user.email,
      phone: user.phone,
      password: generateTemporaryPassword(), // Users will need to reset
      email_confirm: user.isEmailVerified,
      phone_confirm: user.isPhoneVerified,
      user_metadata: {
        first_name: user.firstName,
        last_name: user.lastName,
        avatar_url: user.avatar || user.profilePicture,
        migrated_from_auth_service: true,
        original_user_id: user.id,
      },
    });

  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`);
  }

  const userId = authUser.user.id;

  // 2. Create user profile
  const { error: profileError } = await supabase.from('user_profiles').insert({
    id: userId,
    email: user.email,
    phone: user.phone,
    first_name: user.firstName,
    last_name: user.lastName,
    avatar_url: user.avatar || user.profilePicture,
    date_of_birth: user.dateOfBirth,
    gender: user.gender,
    marital_status: user.maritalStatus,
    body_weight: user.bodyWeight,
    height: user.height,
    age_group: user.ageGroup,
    areas_of_interest: user.areasOfInterest,
    is_email_verified: user.isEmailVerified,
    is_phone_verified: user.isPhoneVerified,
    is_active: user.isActive,
    last_login_at: user.lastLoginAt,
    active_role: user.activeRole,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  });

  if (profileError) {
    throw new Error(`Failed to create user profile: ${profileError.message}`);
  }

  // 3. Assign roles
  for (const roleName of user.roles) {
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: userId,
      role_name: roleName,
    });

    if (roleError && !roleError.message.includes('duplicate')) {
      console.warn(
        `Warning: Failed to assign role ${roleName} to ${user.email}: ${roleError.message}`
      );
    }
  }

  // 4. Create business profiles
  if (user.customerProfile) {
    const { error: customerError } = await supabase
      .from('customer_profiles')
      .insert({
        user_id: userId,
        preferences: user.customerProfile.preferences,
        loyalty_points: user.customerProfile.loyaltyPoints,
        membership_tier: user.customerProfile.membershipTier,
        total_orders: user.customerProfile.totalOrders,
        total_spent: user.customerProfile.totalSpent,
        occupation: user.customerProfile.occupation,
        company: user.customerProfile.company,
        emergency_contact: user.customerProfile.emergencyContact,
        medical_info: user.customerProfile.medicalInfo,
        social_media: user.customerProfile.socialMedia,
        created_at: user.customerProfile.createdAt,
        updated_at: user.customerProfile.updatedAt,
      });

    if (customerError) {
      console.warn(
        `Warning: Failed to create customer profile for ${user.email}: ${customerError.message}`
      );
    }
  }

  if (user.vendorProfile) {
    const { error: vendorError } = await supabase
      .from('vendor_profiles')
      .insert({
        user_id: userId,
        business_name: user.vendorProfile.businessName,
        business_type: user.vendorProfile.businessType,
        description: user.vendorProfile.description,
        logo_url: user.vendorProfile.logo,
        website: user.vendorProfile.website,
        subscription_tier: user.vendorProfile.subscriptionTier,
        commission_rate: user.vendorProfile.commissionRate,
        is_verified: user.vendorProfile.isVerified,
        rating: user.vendorProfile.rating,
        total_sales: user.vendorProfile.totalSales,
        created_at: user.vendorProfile.createdAt,
        updated_at: user.vendorProfile.updatedAt,
      });

    if (vendorError) {
      console.warn(
        `Warning: Failed to create vendor profile for ${user.email}: ${vendorError.message}`
      );
    }
  }

  if (user.driverProfile) {
    const { error: driverError } = await supabase
      .from('driver_profiles')
      .insert({
        user_id: userId,
        license_number: user.driverProfile.licenseNumber,
        vehicle_info: user.driverProfile.vehicleInfo,
        is_online: user.driverProfile.isOnline,
        current_location: user.driverProfile.currentLocation,
        rating: user.driverProfile.rating,
        total_rides: user.driverProfile.totalRides,
        is_verified: user.driverProfile.isVerified,
        subscription_tier: user.driverProfile.subscriptionTier,
        created_at: user.driverProfile.createdAt,
        updated_at: user.driverProfile.updatedAt,
      });

    if (driverError) {
      console.warn(
        `Warning: Failed to create driver profile for ${user.email}: ${driverError.message}`
      );
    }
  }

  if (user.hostProfile) {
    const { error: hostError } = await supabase.from('host_profiles').insert({
      user_id: userId,
      business_name: user.hostProfile.businessName,
      host_type: user.hostProfile.hostType,
      description: user.hostProfile.description,
      rating: user.hostProfile.rating,
      total_bookings: user.hostProfile.totalBookings,
      is_verified: user.hostProfile.isVerified,
      subscription_tier: user.hostProfile.subscriptionTier,
      response_rate: user.hostProfile.responseRate,
      response_time: user.hostProfile.responseTime,
      created_at: user.hostProfile.createdAt,
      updated_at: user.hostProfile.updatedAt,
    });

    if (hostError) {
      console.warn(
        `Warning: Failed to create host profile for ${user.email}: ${hostError.message}`
      );
    }
  }

  if (user.advertiserProfile) {
    const { error: advertiserError } = await supabase
      .from('advertiser_profiles')
      .insert({
        user_id: userId,
        company_name: user.advertiserProfile.companyName,
        industry: user.advertiserProfile.industry,
        website: user.advertiserProfile.website,
        total_spend: user.advertiserProfile.totalSpend,
        total_campaigns: user.advertiserProfile.totalCampaigns,
        is_verified: user.advertiserProfile.isVerified,
        subscription_tier: user.advertiserProfile.subscriptionTier,
        created_at: user.advertiserProfile.createdAt,
        updated_at: user.advertiserProfile.updatedAt,
      });

    if (advertiserError) {
      console.warn(
        `Warning: Failed to create advertiser profile for ${user.email}: ${advertiserError.message}`
      );
    }
  }

  // 5. Import addresses
  for (const address of user.addresses) {
    const { error: addressError } = await supabase.from('addresses').insert({
      user_id: userId,
      label: address.label,
      name: address.name,
      building_number: address.buildingNumber,
      street: address.street,
      address2: address.address2,
      city: address.city,
      state: address.state,
      zip_code: address.zipCode,
      country: address.country,
      phone: address.phone,
      is_default: address.isDefault,
      latitude: address.latitude,
      longitude: address.longitude,
      created_at: address.createdAt,
      updated_at: address.updatedAt,
    });

    if (addressError) {
      console.warn(
        `Warning: Failed to create address for ${user.email}: ${addressError.message}`
      );
    }
  }
}

function generateTemporaryPassword(): string {
  // Generate a secure temporary password
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Run the import
if (require.main === module) {
  importToSupabase();
}

export { importToSupabase };
