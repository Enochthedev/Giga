import prisma from '@/lib/prisma';
import {
  BedType,
  PropertyCategory,
  PropertyStatus,
  RoomCategory,
} from '@/types';
import logger from '@/utils/logger';

const seedData = async () => {
  try {
    logger.info('Starting database seeding...');

    // Create sample properties
    const property1 = await prisma.property.create({
      data: {
        name: 'Grand Plaza Hotel',
        description:
          'A luxurious hotel in the heart of the city with world-class amenities and exceptional service.',
        category: PropertyCategory.HOTEL,
        address: JSON.stringify({
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          country: 'US',
          postalCode: '10001',
        }),
        coordinates: JSON.stringify({
          latitude: 40.7128,
          longitude: -74.006,
        }),
        timezone: 'America/New_York',
        starRating: 5,
        amenities: JSON.stringify([
          'wifi',
          'parking',
          'pool',
          'gym',
          'spa',
          'restaurant',
          'bar',
          'room_service',
          'concierge',
          'business_center',
        ]),
        policies: JSON.stringify({
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cancellationPolicy: 'moderate',
          childPolicy: 'children_welcome',
          petPolicy: 'no_pets',
          smokingPolicy: 'non_smoking',
          minimumAge: 18,
        }),
        contactInfo: JSON.stringify({
          phone: '+1-555-0123',
          email: 'info@grandplaza.com',
          website: 'https://grandplaza.com',
        }),
        images: JSON.stringify([
          {
            id: '1',
            url: 'https://example.com/images/hotel-exterior.jpg',
            alt: 'Hotel exterior view',
            caption: 'Grand Plaza Hotel exterior',
            order: 1,
            type: 'exterior',
          },
          {
            id: '2',
            url: 'https://example.com/images/hotel-lobby.jpg',
            alt: 'Hotel lobby',
            caption: 'Elegant hotel lobby',
            order: 2,
            type: 'lobby',
          },
        ]),
        ownerId: 'owner-1',
        status: PropertyStatus.ACTIVE,
        settings: JSON.stringify({
          currency: 'USD',
          timezone: 'America/New_York',
          language: 'en',
          taxRate: 0.08,
          serviceChargeRate: 0.15,
          allowOnlineBooking: true,
          requireApproval: false,
          autoConfirmBookings: true,
        }),
      },
    });

    const property2 = await prisma.property.create({
      data: {
        name: 'Seaside Resort & Spa',
        description:
          'A beautiful beachfront resort offering relaxation and luxury by the ocean.',
        category: PropertyCategory.RESORT,
        address: JSON.stringify({
          street: '456 Ocean Drive',
          city: 'Miami Beach',
          state: 'FL',
          country: 'US',
          postalCode: '33139',
        }),
        coordinates: JSON.stringify({
          latitude: 25.7617,
          longitude: -80.1918,
        }),
        timezone: 'America/New_York',
        starRating: 4,
        amenities: JSON.stringify([
          'wifi',
          'parking',
          'pool',
          'gym',
          'spa',
          'restaurant',
          'bar',
          'room_service',
          'kids_club',
          'beach_access',
        ]),
        policies: JSON.stringify({
          checkInTime: '16:00',
          checkOutTime: '12:00',
          cancellationPolicy: 'moderate',
          childPolicy: 'children_welcome',
          petPolicy: 'pets_with_restrictions',
          smokingPolicy: 'designated_areas',
        }),
        contactInfo: JSON.stringify({
          phone: '+1-555-0456',
          email: 'reservations@seasideresort.com',
          website: 'https://seasideresort.com',
        }),
        images: JSON.stringify([]),
        ownerId: 'owner-2',
        status: PropertyStatus.ACTIVE,
        settings: JSON.stringify({
          currency: 'USD',
          timezone: 'America/New_York',
          language: 'en',
          taxRate: 0.07,
          serviceChargeRate: 0.18,
          allowOnlineBooking: true,
          requireApproval: false,
          autoConfirmBookings: true,
        }),
      },
    });

    // Create room types for Grand Plaza Hotel
    const standardRoom = await prisma.roomType.create({
      data: {
        propertyId: property1.id,
        name: 'Standard Room',
        description: 'Comfortable and well-appointed room with city views.',
        category: RoomCategory.STANDARD,
        maxOccupancy: 2,
        bedConfiguration: JSON.stringify([
          { bedType: BedType.QUEEN, quantity: 1 },
        ]),
        roomSize: 25,
        roomSizeUnit: 'sqm',
        amenities: JSON.stringify([
          'wifi',
          'tv',
          'air_conditioning',
          'private_bathroom',
          'minibar',
          'safe',
          'desk',
          'coffee_maker',
        ]),
        totalRooms: 50,
        baseRate: 199.99,
        currency: 'USD',
        images: JSON.stringify([]),
        isActive: true,
      },
    });

    const deluxeRoom = await prisma.roomType.create({
      data: {
        propertyId: property1.id,
        name: 'Deluxe Room',
        description:
          'Spacious room with premium amenities and stunning city views.',
        category: RoomCategory.DELUXE,
        maxOccupancy: 3,
        bedConfiguration: JSON.stringify([
          { bedType: BedType.KING, quantity: 1 },
          { bedType: BedType.SOFA_BED, quantity: 1 },
        ]),
        roomSize: 35,
        roomSizeUnit: 'sqm',
        amenities: JSON.stringify([
          'wifi',
          'smart_tv',
          'air_conditioning',
          'private_bathroom',
          'bathtub',
          'minibar',
          'safe',
          'desk',
          'coffee_maker',
          'balcony',
          'bathrobes',
        ]),
        view: 'city',
        totalRooms: 30,
        baseRate: 299.99,
        currency: 'USD',
        images: JSON.stringify([]),
        isActive: true,
      },
    });

    const suite = await prisma.roomType.create({
      data: {
        propertyId: property1.id,
        name: 'Executive Suite',
        description:
          'Luxurious suite with separate living area and premium amenities.',
        category: RoomCategory.SUITE,
        maxOccupancy: 4,
        bedConfiguration: JSON.stringify([
          { bedType: BedType.KING, quantity: 1 },
          { bedType: BedType.SOFA_BED, quantity: 1 },
        ]),
        roomSize: 60,
        roomSizeUnit: 'sqm',
        amenities: JSON.stringify([
          'wifi',
          'smart_tv',
          'air_conditioning',
          'private_bathroom',
          'bathtub',
          'minibar',
          'safe',
          'desk',
          'coffee_maker',
          'balcony',
          'bathrobes',
          'kitchenette',
          'sofa',
          'dining_area',
        ]),
        view: 'city',
        totalRooms: 10,
        baseRate: 599.99,
        currency: 'USD',
        images: JSON.stringify([]),
        isActive: true,
      },
    });

    // Create room types for Seaside Resort
    const oceanView = await prisma.roomType.create({
      data: {
        propertyId: property2.id,
        name: 'Ocean View Room',
        description: 'Beautiful room with direct ocean views and beach access.',
        category: RoomCategory.DELUXE,
        maxOccupancy: 2,
        bedConfiguration: JSON.stringify([
          { bedType: BedType.KING, quantity: 1 },
        ]),
        roomSize: 30,
        roomSizeUnit: 'sqm',
        amenities: JSON.stringify([
          'wifi',
          'tv',
          'air_conditioning',
          'private_bathroom',
          'minibar',
          'safe',
          'balcony',
          'ocean_view',
        ]),
        view: 'ocean',
        totalRooms: 40,
        baseRate: 349.99,
        currency: 'USD',
        images: JSON.stringify([]),
        isActive: true,
      },
    });

    // Create initial inventory records for the next 30 days
    const today = new Date();
    const inventoryPromises = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Grand Plaza Hotel inventory
      inventoryPromises.push(
        prisma.inventoryRecord.create({
          data: {
            propertyId: property1.id,
            roomTypeId: standardRoom.id,
            date,
            totalRooms: 50,
            availableRooms: 50,
            reservedRooms: 0,
            blockedRooms: 0,
            overbookingLimit: 5,
          },
        }),
        prisma.inventoryRecord.create({
          data: {
            propertyId: property1.id,
            roomTypeId: deluxeRoom.id,
            date,
            totalRooms: 30,
            availableRooms: 30,
            reservedRooms: 0,
            blockedRooms: 0,
            overbookingLimit: 3,
          },
        }),
        prisma.inventoryRecord.create({
          data: {
            propertyId: property1.id,
            roomTypeId: suite.id,
            date,
            totalRooms: 10,
            availableRooms: 10,
            reservedRooms: 0,
            blockedRooms: 0,
            overbookingLimit: 1,
          },
        }),
        // Seaside Resort inventory
        prisma.inventoryRecord.create({
          data: {
            propertyId: property2.id,
            roomTypeId: oceanView.id,
            date,
            totalRooms: 40,
            availableRooms: 40,
            reservedRooms: 0,
            blockedRooms: 0,
            overbookingLimit: 4,
          },
        })
      );
    }

    await Promise.all(inventoryPromises);

    // Create sample rate records
    const ratePromises = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      ratePromises.push(
        prisma.rateRecord.create({
          data: {
            propertyId: property1.id,
            roomTypeId: standardRoom.id,
            date,
            rate: 199.99,
            currency: 'USD',
            rateType: 'base',
          },
        }),
        prisma.rateRecord.create({
          data: {
            propertyId: property1.id,
            roomTypeId: deluxeRoom.id,
            date,
            rate: 299.99,
            currency: 'USD',
            rateType: 'base',
          },
        }),
        prisma.rateRecord.create({
          data: {
            propertyId: property1.id,
            roomTypeId: suite.id,
            date,
            rate: 599.99,
            currency: 'USD',
            rateType: 'base',
          },
        }),
        prisma.rateRecord.create({
          data: {
            propertyId: property2.id,
            roomTypeId: oceanView.id,
            date,
            rate: 349.99,
            currency: 'USD',
            rateType: 'base',
          },
        })
      );
    }

    await Promise.all(ratePromises);

    // Create a sample promotion
    await prisma.promotion.create({
      data: {
        propertyId: property1.id,
        code: 'WELCOME20',
        name: 'Welcome Discount',
        description: '20% off your first booking',
        type: 'public',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 100,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        conditions: JSON.stringify([
          {
            type: 'minimum_stay',
            value: 2,
            description: 'Minimum 2 nights stay required',
          },
        ]),
        usage: JSON.stringify({
          maxTotalUsage: 100,
          maxUsagePerGuest: 1,
          currentUsage: 0,
          usageHistory: [],
        }),
        isActive: true,
      },
    });

    logger.info('Database seeding completed successfully');
    logger.info(`Created ${await prisma.property.count()} properties`);
    logger.info(`Created ${await prisma.roomType.count()} room types`);
    logger.info(
      `Created ${await prisma.inventoryRecord.count()} inventory records`
    );
    logger.info(`Created ${await prisma.rateRecord.count()} rate records`);
    logger.info(`Created ${await prisma.promotion.count()} promotions`);
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedData;
