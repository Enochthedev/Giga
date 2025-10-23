/**
 * Multi-Property Report Service - Handles consolidated reporting across properties
 */

import { PrismaClient } from '@/generated/prisma-client';
import {
  ComparisonData,
  MultiPropertyReport,
  PropertyReportData,
  ReportData,
  ReportSummary,
  ReportType,
  TrendData,
} from '@/types';
import logger from '@/utils/logger';

// Error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

export class MultiPropertyReportService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Generate consolidated report across multiple properties
   */
  async generateReport(reportId: string): Promise<ReportData> {
    try {
      logger.info('Generating multi-property report', { reportId });

      // Get report configuration
      const report = await this.prisma.multiPropertyReport.findUnique({
        where: { id: reportId },
      });

      if (!report) {
        throw new NotFoundError('Report', reportId);
      }

      const reportConfig = report as unknown as MultiPropertyReport;

      // Generate report data based on type
      const reportData = await this.generateReportData(reportConfig);

      // Update report with generated data
      await this.prisma.multiPropertyReport.update({
        where: { id: reportId },
        data: {
          reportData: reportData as any,
          lastGenerated: new Date(),
        },
      });

      logger.info('Multi-property report generated successfully', { reportId });

      return reportData;
    } catch (error) {
      logger.error('Error generating multi-property report', {
        error,
        reportId,
      });
      throw error;
    }
  }

  /**
   * Generate report data based on report configuration
   */
  private async generateReportData(
    report: MultiPropertyReport
  ): Promise<ReportData> {
    const { properties, dateRange, reportType, metrics } = report;

    // Get property data
    const propertyData = await this.getPropertyData(properties, dateRange);

    // Generate summary
    const summary = await this.generateSummary(propertyData, reportType);

    // Generate property breakdown
    const propertyBreakdown = await this.generatePropertyBreakdown(
      propertyData,
      metrics
    );

    // Generate trends
    const trends = await this.generateTrends(propertyData, dateRange, metrics);

    // Generate comparisons
    const comparisons = await this.generateComparisons(propertyData, dateRange);

    return {
      summary,
      propertyBreakdown,
      trends,
      comparisons,
      generatedAt: new Date(),
    };
  }

  /**
   * Get aggregated data for properties
   */
  private async getPropertyData(
    propertyIds: string[],
    dateRange: { start: Date; end: Date }
  ) {
    // Get properties
    const properties = await this.prisma.property.findMany({
      where: {
        id: { in: propertyIds },
        status: 'active',
      },
      include: {
        roomTypes: true,
        _count: {
          select: {
            roomTypes: true,
          },
        },
      },
    });

    // Get bookings for the date range
    const bookings = await this.prisma.booking.findMany({
      where: {
        propertyId: { in: propertyIds },
        checkInDate: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
        status: { not: 'cancelled' },
      },
      include: {
        bookedRooms: true,
      },
    });

    // Get inventory data
    const inventory = await this.prisma.inventoryRecord.findMany({
      where: {
        propertyId: { in: propertyIds },
        date: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
    });

    return {
      properties,
      bookings,
      inventory,
    };
  }
  /**
   * Generate report summary
   */
  private async generateSummary(
    data: any,
    reportType: ReportType
  ): Promise<ReportSummary> {
    const { properties, bookings, inventory } = data;

    // Calculate total rooms
    const totalRooms = properties.reduce((sum: number, property: any) => {
      return (
        sum +
        property.roomTypes.reduce((roomSum: number, roomType: any) => {
          return roomSum + roomType.totalRooms;
        }, 0)
      );
    }, 0);

    // Calculate total bookings and revenue
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum: number, booking: any) => {
      return sum + booking.totalAmount;
    }, 0);

    // Calculate occupancy
    const totalRoomNights = inventory.reduce((sum: number, inv: any) => {
      return sum + inv.totalRooms;
    }, 0);

    const occupiedRoomNights = inventory.reduce((sum: number, inv: any) => {
      return sum + (inv.totalRooms - inv.availableRooms);
    }, 0);

    const averageOccupancy =
      totalRoomNights > 0 ? (occupiedRoomNights / totalRoomNights) * 100 : 0;

    // Calculate ADR (Average Daily Rate)
    const totalRoomRevenue = bookings.reduce((sum: number, booking: any) => {
      return (
        sum +
        booking.bookedRooms.reduce((roomSum: number, room: any) => {
          return roomSum + room.totalPrice;
        }, 0)
      );
    }, 0);

    const totalRoomsSold = bookings.reduce((sum: number, booking: any) => {
      return (
        sum +
        booking.bookedRooms.reduce((roomSum: number, room: any) => {
          return roomSum + room.quantity;
        }, 0)
      );
    }, 0);

    const averageADR =
      totalRoomsSold > 0 ? totalRoomRevenue / totalRoomsSold : 0;

    // Calculate RevPAR (Revenue Per Available Room)
    const averageRevPAR =
      totalRoomNights > 0 ? totalRoomRevenue / totalRoomNights : 0;

    return {
      totalProperties: properties.length,
      totalRooms,
      totalBookings,
      totalRevenue,
      averageOccupancy: Math.round(averageOccupancy * 100) / 100,
      averageADR: Math.round(averageADR * 100) / 100,
      averageRevPAR: Math.round(averageRevPAR * 100) / 100,
    };
  }

  /**
   * Generate property breakdown
   */
  private async generatePropertyBreakdown(
    data: any,
    metrics: any[]
  ): Promise<PropertyReportData[]> {
    const { properties, bookings, inventory } = data;

    return properties.map((property: any) => {
      const propertyBookings = bookings.filter(
        (b: any) => b.propertyId === property.id
      );
      const propertyInventory = inventory.filter(
        (i: any) => i.propertyId === property.id
      );

      // Calculate metrics for this property
      const propertyMetrics: Record<string, number> = {};

      // Occupancy rate
      const totalRoomNights = propertyInventory.reduce(
        (sum: number, inv: any) => {
          return sum + inv.totalRooms;
        },
        0
      );

      const occupiedRoomNights = propertyInventory.reduce(
        (sum: number, inv: any) => {
          return sum + (inv.totalRooms - inv.availableRooms);
        },
        0
      );

      propertyMetrics.occupancyRate =
        totalRoomNights > 0 ? (occupiedRoomNights / totalRoomNights) * 100 : 0;

      // Revenue
      propertyMetrics.totalRevenue = propertyBookings.reduce(
        (sum: number, booking: any) => {
          return sum + booking.totalAmount;
        },
        0
      );

      // Booking count
      propertyMetrics.bookingCount = propertyBookings.length;

      // ADR
      const totalRoomRevenue = propertyBookings.reduce(
        (sum: number, booking: any) => {
          return (
            sum +
            booking.bookedRooms.reduce((roomSum: number, room: any) => {
              return roomSum + room.totalPrice;
            }, 0)
          );
        },
        0
      );

      const totalRoomsSold = propertyBookings.reduce(
        (sum: number, booking: any) => {
          return (
            sum +
            booking.bookedRooms.reduce((roomSum: number, room: any) => {
              return roomSum + room.quantity;
            }, 0)
          );
        },
        0
      );

      propertyMetrics.adr =
        totalRoomsSold > 0 ? totalRoomRevenue / totalRoomsSold : 0;

      // RevPAR
      propertyMetrics.revpar =
        totalRoomNights > 0 ? totalRoomRevenue / totalRoomNights : 0;

      return {
        propertyId: property.id,
        propertyName: property.name,
        metrics: propertyMetrics,
        trends: {}, // TODO: Implement trend calculation
      };
    });
  }

  /**
   * Generate trend data
   */
  private async generateTrends(
    data: any,
    dateRange: { start: Date; end: Date },
    metrics: any[]
  ): Promise<TrendData[]> {
    // TODO: Implement trend analysis
    // This would analyze data over time periods (daily, weekly, monthly)
    return [];
  }

  /**
   * Generate comparison data
   */
  private async generateComparisons(
    data: any,
    dateRange: { start: Date; end: Date }
  ): Promise<ComparisonData[]> {
    // TODO: Implement period-over-period comparisons
    // This would compare current period with previous period
    return [];
  }

  /**
   * Get available report templates
   */
  async getReportTemplates(): Promise<any[]> {
    return [
      {
        id: 'occupancy-report',
        name: 'Occupancy Report',
        description: 'Room occupancy rates across properties',
        type: ReportType.OCCUPANCY,
        defaultMetrics: ['occupancyRate', 'totalRooms', 'occupiedRooms'],
      },
      {
        id: 'revenue-report',
        name: 'Revenue Report',
        description: 'Revenue analysis across properties',
        type: ReportType.REVENUE,
        defaultMetrics: ['totalRevenue', 'adr', 'revpar'],
      },
      {
        id: 'performance-report',
        name: 'Performance Report',
        description: 'Overall performance metrics',
        type: ReportType.PERFORMANCE,
        defaultMetrics: ['occupancyRate', 'adr', 'revpar', 'bookingCount'],
      },
    ];
  }

  /**
   * Create scheduled report
   */
  async createScheduledReport(reportConfig: any): Promise<MultiPropertyReport> {
    try {
      logger.info('Creating scheduled report', { name: reportConfig.name });

      // Validate report configuration
      this.validateReportConfig(reportConfig);

      const report = await this.prisma.multiPropertyReport.create({
        data: {
          name: reportConfig.name,
          description: reportConfig.description,
          reportType: reportConfig.reportType,
          properties: reportConfig.properties,
          dateRange: reportConfig.dateRange,
          metrics: reportConfig.metrics,
          filters: reportConfig.filters,
          isScheduled: reportConfig.isScheduled || false,
          schedule: reportConfig.schedule,
          createdBy: reportConfig.createdBy,
          sharedWith: reportConfig.sharedWith || [],
          status: 'active',
        },
      });

      logger.info('Scheduled report created successfully', {
        reportId: report.id,
      });

      return report as unknown as MultiPropertyReport;
    } catch (error) {
      logger.error('Error creating scheduled report', { error, reportConfig });
      throw error;
    }
  }

  /**
   * Validate report configuration
   */
  private validateReportConfig(config: any): void {
    if (!config.name || config.name.trim().length === 0) {
      throw new ValidationError('Report name is required');
    }

    if (!config.reportType) {
      throw new ValidationError('Report type is required');
    }

    if (!config.properties || config.properties.length === 0) {
      throw new ValidationError('At least one property must be selected');
    }

    if (!config.dateRange || !config.dateRange.start || !config.dateRange.end) {
      throw new ValidationError('Date range is required');
    }

    if (!config.metrics || config.metrics.length === 0) {
      throw new ValidationError('At least one metric must be selected');
    }

    if (!config.createdBy) {
      throw new ValidationError('Created by user ID is required');
    }
  }
}
