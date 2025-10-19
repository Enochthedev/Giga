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
        slug: 'grand-plaza-hotel',
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

    // Create room types for Grand Plaza Hotel
    const standardRoom = await prisma.roomType.create({
      data: {
        propertyId: property1.id,
        name: 'Standard Room',
        description: 'Comfortable and well-appointed room with city views.',
        category: RoomCategory.STANDARD,
        maxOccupancy: 2,
        maxAdults: 2,
        maxChildren: 1,
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

    // Create initial inventory records for the next 7 days
    const today = new Date();
    const inventoryPromises = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

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
        })
      );
    }

    await Promise.all(inventoryPromises);

    // Create sample rate records
    const ratePromises = [];
    for (let i = 0; i < 7; i++) {
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
        })
      );
    }

    await Promise.all(ratePromises);

    logger.info('Database seeding completed successfully');
    logger.info(`Created ${await prisma.property.count()} properties`);
    logger.info(`Created ${await prisma.roomType.count()} room types`);
    logger.info(
      `Created ${await prisma.inventoryRecord.count()} inventory records`
    );
    logger.info(`Created ${await prisma.rateRecord.count()} rate records`);
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
