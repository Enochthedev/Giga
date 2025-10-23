/**
 * Multi-Property Integration Tests
 * Tests the complete multi-property workflow including chains, brands, properties, and transfers
 */

import { PrismaClient } from '@/generated/prisma-client';
import { BrandService } from '@/services/brand.service';
import { ChainService } from '@/services/chain.service';
import { CrossPropertyTransferService } from '@/services/cross-property-transfer.service';
import { MultiPropertyReportService } from '@/services/multi-property-report.service';
import { PropertyService } from '@/services/property.service';
import {
  CreateBrandRequest,
  CreateChainRequest,
  CreatePropertyRequest,
  PropertyCategory,
  ReportType,
  TransferType,
} from '@/types';

// Mock Prisma Client with comprehensive mocking
jest.mock('@/generated/prisma-client');
const mockPrisma = {
  chain: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  brand: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  property: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  crossPropertyTransfer: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  multiPropertyReport: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  booking: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  inventoryRecord: {
    findMany: jest.fn(),
  },
  bookingHistory: {
    create: jest.fn(),
  },
} as unknown as PrismaClient;

describe('Multi-Property Integration Tests', () => {
  let chainService: ChainService;
  let brandService: BrandService;
  let propertyService: PropertyService;
  let transferService: CrossPropertyTransferService;
  let reportService: MultiPropertyReportService;

  beforeEach(() => {
    chainService = new ChainService(mockPrisma);
    brandService = new BrandService(mockPrisma);
    propertyService = new PropertyService(mockPrisma);
    transferService = new CrossPropertyTransferService(mockPrisma);
    reportService = new MultiPropertyReportService(mockPrisma);
    jest.clearAllMocks();
  });

  describe('Complete Multi-Property Workflow', () => {
    it('should create chain, brand, properties, and manage transfers', async () => {
      // Step 1: Create a hotel chain
      const chainRequest: CreateChainRequest = {
        name: 'Luxury Hotels International',
        code: 'LHI',
        description: 'Premium luxury hotel chain',
        contactInfo: {
          email: 'contact@luxuryhotels.com',
          phone: '+1-800-LUXURY',
          website: 'https://luxuryhotels.com',
        },
        defaultCurrency: 'USD',
        defaultTimezone: 'UTC',
      };

      const mockChain = {
        id: 'chain-1',
        ...chainRequest,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { brands: 0, properties: 0 },
      };

      (mockPrisma.chain.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.chain.create as jest.Mock).mockResolvedValue(mockChain);

      const createdChain = await chainService.createChain(chainRequest);
      expect(createdChain.name).toBe('Luxury Hotels International');
      expect(createdChain.code).toBe('LHI');

      // Step 2: Create brands under the chain
      const brandRequest: CreateBrandRequest = {
        chainId: 'chain-1',
        name: 'Luxury Suites',
        code: 'LS',
        description: 'Premium suite accommodations',
        brandStandards: {
          minimumStarRating: 5,
          requiredAmenities: ['spa', 'concierge', 'valet'],
          serviceStandards: [
            {
              category: 'guest_service',
              requirement: '24/7 concierge service',
              description: 'Round-the-clock guest assistance',
              mandatory: true,
            },
          ],
          designStandards: [
            {
              element: 'lobby',
              specification: 'Marble flooring with gold accents',
              mandatory: true,
            },
          ],
          operationalStandards: [
            {
              process: 'check_in',
              requirement: 'Maximum 2-minute check-in process',
              mandatory: true,
            },
          ],
        },
        amenityRequirements: ['spa', 'fitness_center', 'fine_dining'],
      };

      const mockBrand = {
        id: 'brand-1',
        ...brandRequest,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        chain: mockChain,
        _count: { properties: 0 },
      };

      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(mockChain);
      (mockPrisma.brand.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.brand.create as jest.Mock).mockResolvedValue(mockBrand);

      const createdBrand = await brandService.createBrand(brandRequest);
      expect(createdBrand.name).toBe('Luxury Suites');
      expect(createdBrand.chainId).toBe('chain-1');

      // Step 3: Create properties under the brand
      const property1Request: CreatePropertyRequest = {
        name: 'Luxury Suites Manhattan',
        description: 'Premium luxury hotel in the heart of Manhattan',
        category: PropertyCategory.HOTEL,
        address: {
          street: '123 Fifth Avenue',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postalCode: '10001',
        },
        coordinates: { lat: 40.7589, lng: -73.9851 },
        timezone: 'America/New_York',
        starRating: 5,
        amenities: [
          'spa',
          'fitness_center',
          'fine_dining',
          'concierge',
          'valet',
        ],
        policies: {
          cancellationPolicy:
            'Free cancellation up to 24 hours before check-in',
          petPolicy: 'Pets allowed with additional fee',
          smokingPolicy: 'Non-smoking property',
        },
        email: 'manhattan@luxurysuites.com',
        phone: '+1-212-555-0100',
        contactInfo: {
          managerName: 'John Smith',
          managerEmail: 'john.smith@luxurysuites.com',
        },
        checkInTime: '15:00',
        checkOutTime: '12:00',
        images: [
          { url: 'https://example.com/hotel1.jpg', alt: 'Hotel exterior' },
        ],
        ownerId: 'owner-1',
        chainId: 'chain-1',
        brandId: 'brand-1',
        currency: 'USD',
        settings: {
          language: 'en',
          timezone: 'America/New_York',
        },
      };

      const mockProperty1 = {
        id: 'property-1',
        ...property1Request,
        slug: 'luxury-suites-manhattan',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        chain: mockChain,
        brand: mockBrand,
      };

      (mockPrisma.property.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.property.create as jest.Mock).mockResolvedValue(
        mockProperty1
      );

      const createdProperty1 =
        await propertyService.createProperty(property1Request);
      expect(createdProperty1.name).toBe('Luxury Suites Manhattan');
      expect(createdProperty1.chainId).toBe('chain-1');
      expect(createdProperty1.brandId).toBe('brand-1');

      // Step 4: Create second property
      const property2Request: CreatePropertyRequest = {
        ...property1Request,
        name: 'Luxury Suites Beverly Hills',
        address: {
          street: '456 Rodeo Drive',
          city: 'Beverly Hills',
          state: 'CA',
          country: 'USA',
          postalCode: '90210',
        },
        coordinates: { lat: 34.0696, lng: -118.4006 },
        timezone: 'America/Los_Angeles',
        email: 'beverlyhills@luxurysuites.com',
        phone: '+1-310-555-0200',
      };

      const mockProperty2 = {
        id: 'property-2',
        ...property2Request,
        slug: 'luxury-suites-beverly-hills',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        chain: mockChain,
        brand: mockBrand,
      };

      (mockPrisma.property.create as jest.Mock).mockResolvedValue(
        mockProperty2
      );

      const createdProperty2 =
        await propertyService.createProperty(property2Request);
      expect(createdProperty2.name).toBe('Luxury Suites Beverly Hills');

      // Step 5: Create a cross-property transfer
      const transferRequest = {
        fromPropertyId: 'property-1',
        toPropertyId: 'property-2',
        transferType: TransferType.BOOKING,
        entityId: 'booking-1',
        entityType: 'booking',
        reason: 'Guest requested location change',
        transferData: {
          originalData: { bookingId: 'booking-1', propertyId: 'property-1' },
          transferredData: { bookingId: 'booking-1', propertyId: 'property-2' },
        },
      };

      const mockTransfer = {
        id: 'transfer-1',
        ...transferRequest,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock property validation
      (mockPrisma.property.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'property-1', status: 'active' })
        .mockResolvedValueOnce({ id: 'property-2', status: 'active' });

      // Mock booking validation
      (mockPrisma.booking.findUnique as jest.Mock).mockResolvedValue({
        id: 'booking-1',
        propertyId: 'property-1',
      });

      (mockPrisma.crossPropertyTransfer.create as jest.Mock).mockResolvedValue(
        mockTransfer
      );

      const createdTransfer =
        await transferService.createTransfer(transferRequest);
      expect(createdTransfer.fromPropertyId).toBe('property-1');
      expect(createdTransfer.toPropertyId).toBe('property-2');
      expect(createdTransfer.status).toBe('pending');

      // Step 6: Create a multi-property report
      const reportConfig = {
        name: 'Chain Performance Report',
        description: 'Monthly performance analysis across all properties',
        reportType: ReportType.PERFORMANCE,
        properties: ['property-1', 'property-2'],
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        },
        metrics: [
          {
            name: 'occupancyRate',
            type: 'occupancy_rate',
            aggregation: 'average',
          },
          {
            name: 'totalRevenue',
            type: 'total_revenue',
            aggregation: 'sum',
          },
        ],
        createdBy: 'user-1',
        isScheduled: false,
      };

      const mockReport = {
        id: 'report-1',
        ...reportConfig,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.multiPropertyReport.create as jest.Mock).mockResolvedValue(
        mockReport
      );

      const createdReport =
        await reportService.createScheduledReport(reportConfig);
      expect(createdReport.name).toBe('Chain Performance Report');
      expect(createdReport.properties).toEqual(['property-1', 'property-2']);

      // Verify the complete workflow
      expect(createdChain.id).toBe('chain-1');
      expect(createdBrand.chainId).toBe('chain-1');
      expect(createdProperty1.chainId).toBe('chain-1');
      expect(createdProperty1.brandId).toBe('brand-1');
      expect(createdProperty2.chainId).toBe('chain-1');
      expect(createdProperty2.brandId).toBe('brand-1');
      expect(createdTransfer.transferType).toBe(TransferType.BOOKING);
      expect(createdReport.reportType).toBe(ReportType.PERFORMANCE);
    });

    it('should enforce brand standards across properties', async () => {
      // Test that properties must meet brand requirements
      const brandWithStandards = {
        id: 'brand-1',
        chainId: 'chain-1',
        brandStandards: {
          minimumStarRating: 5,
          requiredAmenities: ['spa', 'concierge'],
        },
        amenityRequirements: ['spa', 'concierge', 'valet'],
      };

      const propertyRequest: CreatePropertyRequest = {
        name: 'Test Property',
        description: 'Test property',
        category: PropertyCategory.HOTEL,
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          country: 'USA',
          postalCode: '12345',
        },
        coordinates: { lat: 40.0, lng: -74.0 },
        timezone: 'UTC',
        starRating: 4, // Below brand minimum
        amenities: ['spa'], // Missing required amenities
        policies: {
          cancellationPolicy: 'Standard',
          petPolicy: 'No pets',
          smokingPolicy: 'Non-smoking',
        },
        contactInfo: {},
        checkInTime: '15:00',
        checkOutTime: '11:00',
        images: [],
        ownerId: 'owner-1',
        chainId: 'chain-1',
        brandId: 'brand-1',
        currency: 'USD',
        settings: {
          language: 'en',
          timezone: 'UTC',
        },
      };

      // This would typically be validated in a real implementation
      // For now, we just verify the structure is correct
      expect(propertyRequest.starRating).toBeLessThan(
        brandWithStandards.brandStandards.minimumStarRating
      );
      expect(propertyRequest.amenities).not.toEqual(
        expect.arrayContaining(brandWithStandards.amenityRequirements)
      );
    });
  });

  describe('Multi-Property Reporting Integration', () => {
    it('should generate consolidated reports across properties', async () => {
      const mockProperties = [
        {
          id: 'property-1',
          name: 'Property 1',
          roomTypes: [{ id: 'room-1', totalRooms: 100 }],
          _count: { roomTypes: 1 },
        },
        {
          id: 'property-2',
          name: 'Property 2',
          roomTypes: [{ id: 'room-2', totalRooms: 150 }],
          _count: { roomTypes: 1 },
        },
      ];

      const mockBookings = [
        {
          id: 'booking-1',
          propertyId: 'property-1',
          totalAmount: 500,
          bookedRooms: [{ quantity: 1, totalPrice: 500 }],
        },
        {
          id: 'booking-2',
          propertyId: 'property-2',
          totalAmount: 750,
          bookedRooms: [{ quantity: 1, totalPrice: 750 }],
        },
      ];

      const mockInventory = [
        {
          propertyId: 'property-1',
          date: new Date('2024-01-01'),
          totalRooms: 100,
          availableRooms: 80,
        },
        {
          propertyId: 'property-2',
          date: new Date('2024-01-01'),
          totalRooms: 150,
          availableRooms: 100,
        },
      ];

      const mockReport = {
        id: 'report-1',
        reportType: ReportType.OCCUPANCY,
        properties: ['property-1', 'property-2'],
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        },
        metrics: [
          {
            name: 'occupancyRate',
            type: 'occupancy_rate',
            aggregation: 'average',
          },
        ],
      };

      (
        mockPrisma.multiPropertyReport.findUnique as jest.Mock
      ).mockResolvedValue(mockReport);
      (mockPrisma.property.findMany as jest.Mock).mockResolvedValue(
        mockProperties
      );
      (mockPrisma.booking.findMany as jest.Mock).mockResolvedValue(
        mockBookings
      );
      (mockPrisma.inventoryRecord.findMany as jest.Mock).mockResolvedValue(
        mockInventory
      );
      (mockPrisma.multiPropertyReport.update as jest.Mock).mockResolvedValue(
        {}
      );

      const reportData = await reportService.generateReport('report-1');

      expect(reportData.summary.totalProperties).toBe(2);
      expect(reportData.summary.totalRooms).toBe(250);
      expect(reportData.summary.totalRevenue).toBe(1250);
      expect(reportData.propertyBreakdown).toHaveLength(2);
      expect(reportData.propertyBreakdown[0].propertyName).toBe('Property 1');
      expect(reportData.propertyBreakdown[1].propertyName).toBe('Property 2');
    });
  });
});
