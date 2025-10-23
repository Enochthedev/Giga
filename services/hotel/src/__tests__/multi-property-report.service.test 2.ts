/**
 * Multi-Property Report Service Unit Tests
 */

import { PrismaClient } from '@/generated/prisma-client';
import { MultiPropertyReportService } from '@/services/multi-property-report.service';
import { NotFoundError, ReportType, ValidationError } from '@/types';

// Mock Prisma Client
jest.mock('@/generated/prisma-client');
const mockPrisma = {
  multiPropertyReport: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  property: {
    findMany: jest.fn(),
  },
  booking: {
    findMany: jest.fn(),
  },
  inventoryRecord: {
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

describe('MultiPropertyReportService', () => {
  let reportService: MultiPropertyReportService;

  beforeEach(() => {
    reportService = new MultiPropertyReportService(mockPrisma);
    jest.clearAllMocks();
  });

  describe('generateReport', () => {
    const mockReport = {
      id: 'report-1',
      name: 'Test Report',
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

    const mockProperties = [
      {
        id: 'property-1',
        name: 'Property 1',
        roomTypes: [
          { id: 'room-1', totalRooms: 10 },
          { id: 'room-2', totalRooms: 15 },
        ],
        _count: { roomTypes: 2 },
      },
      {
        id: 'property-2',
        name: 'Property 2',
        roomTypes: [{ id: 'room-3', totalRooms: 20 }],
        _count: { roomTypes: 1 },
      },
    ];

    const mockBookings = [
      {
        id: 'booking-1',
        propertyId: 'property-1',
        totalAmount: 200,
        bookedRooms: [
          { quantity: 1, totalPrice: 100 },
          { quantity: 1, totalPrice: 100 },
        ],
      },
      {
        id: 'booking-2',
        propertyId: 'property-2',
        totalAmount: 150,
        bookedRooms: [{ quantity: 1, totalPrice: 150 }],
      },
    ];

    const mockInventory = [
      {
        propertyId: 'property-1',
        date: new Date('2024-01-01'),
        totalRooms: 25,
        availableRooms: 20,
      },
      {
        propertyId: 'property-2',
        date: new Date('2024-01-01'),
        totalRooms: 20,
        availableRooms: 15,
      },
    ];

    it('should generate report successfully', async () => {
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

      const result = await reportService.generateReport('report-1');

      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('propertyBreakdown');
      expect(result).toHaveProperty('trends');
      expect(result).toHaveProperty('comparisons');
      expect(result).toHaveProperty('generatedAt');

      expect(result.summary).toEqual({
        totalProperties: 2,
        totalRooms: 45,
        totalBookings: 2,
        totalRevenue: 350,
        averageOccupancy: 22.22,
        averageADR: 125,
        averageRevPAR: 7.78,
      });

      expect(mockPrisma.multiPropertyReport.update).toHaveBeenCalledWith({
        where: { id: 'report-1' },
        data: {
          reportData: expect.any(Object),
          lastGenerated: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundError for non-existent report', async () => {
      (
        mockPrisma.multiPropertyReport.findUnique as jest.Mock
      ).mockResolvedValue(null);

      await expect(
        reportService.generateReport('non-existent')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('createScheduledReport', () => {
    const validReportConfig = {
      name: 'Monthly Occupancy Report',
      description: 'Monthly occupancy analysis',
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
      isScheduled: true,
      schedule: {
        frequency: 'monthly',
        dayOfMonth: 1,
        time: '09:00',
        timezone: 'UTC',
        recipients: ['user@example.com'],
      },
      createdBy: 'user-1',
    };

    it('should create scheduled report successfully', async () => {
      const mockCreatedReport = {
        id: 'report-1',
        ...validReportConfig,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.multiPropertyReport.create as jest.Mock).mockResolvedValue(
        mockCreatedReport
      );

      const result =
        await reportService.createScheduledReport(validReportConfig);

      expect(result).toEqual(mockCreatedReport);
      expect(mockPrisma.multiPropertyReport.create).toHaveBeenCalledWith({
        data: {
          name: validReportConfig.name,
          description: validReportConfig.description,
          reportType: validReportConfig.reportType,
          properties: validReportConfig.properties,
          dateRange: validReportConfig.dateRange,
          metrics: validReportConfig.metrics,
          filters: undefined,
          isScheduled: validReportConfig.isScheduled,
          schedule: validReportConfig.schedule,
          createdBy: validReportConfig.createdBy,
          sharedWith: [],
          status: 'active',
        },
      });
    });

    it('should throw ValidationError for missing name', async () => {
      const invalidConfig = { ...validReportConfig, name: '' };

      await expect(
        reportService.createScheduledReport(invalidConfig)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for missing report type', async () => {
      const invalidConfig = { ...validReportConfig, reportType: undefined };

      await expect(
        reportService.createScheduledReport(invalidConfig)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for empty properties array', async () => {
      const invalidConfig = { ...validReportConfig, properties: [] };

      await expect(
        reportService.createScheduledReport(invalidConfig)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for missing date range', async () => {
      const invalidConfig = { ...validReportConfig, dateRange: undefined };

      await expect(
        reportService.createScheduledReport(invalidConfig)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for empty metrics array', async () => {
      const invalidConfig = { ...validReportConfig, metrics: [] };

      await expect(
        reportService.createScheduledReport(invalidConfig)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for missing createdBy', async () => {
      const invalidConfig = { ...validReportConfig, createdBy: undefined };

      await expect(
        reportService.createScheduledReport(invalidConfig)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getReportTemplates', () => {
    it('should return available report templates', async () => {
      const templates = await reportService.getReportTemplates();

      expect(templates).toHaveLength(3);
      expect(templates[0]).toEqual({
        id: 'occupancy-report',
        name: 'Occupancy Report',
        description: 'Room occupancy rates across properties',
        type: ReportType.OCCUPANCY,
        defaultMetrics: ['occupancyRate', 'totalRooms', 'occupiedRooms'],
      });
      expect(templates[1]).toEqual({
        id: 'revenue-report',
        name: 'Revenue Report',
        description: 'Revenue analysis across properties',
        type: ReportType.REVENUE,
        defaultMetrics: ['totalRevenue', 'adr', 'revpar'],
      });
      expect(templates[2]).toEqual({
        id: 'performance-report',
        name: 'Performance Report',
        description: 'Overall performance metrics',
        type: ReportType.PERFORMANCE,
        defaultMetrics: ['occupancyRate', 'adr', 'revpar', 'bookingCount'],
      });
    });
  });
});
