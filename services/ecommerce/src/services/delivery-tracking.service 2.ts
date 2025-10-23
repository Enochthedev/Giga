import {
  DeliveryStatus,
  PrismaClient,
} from '../generated/prisma-client/index.js';

export interface CreateTrackingData {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: Date;
  trackingUrl?: string;
  notes?: string;
}

export interface TrackingEventData {
  status: DeliveryStatus;
  location?: string;
  description: string;
  timestamp: Date;
}

export interface TrackingInfo {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: DeliveryStatus;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingUrl?: string;
  notes?: string;
  events: Array<{
    status: DeliveryStatus;
    location?: string;
    description: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export class DeliveryTrackingService {
  constructor(private prisma: PrismaClient) {}

  async createTracking(data: CreateTrackingData): Promise<TrackingInfo> {
    const tracking = await this.prisma.deliveryTracking.create({
      data: {
        orderId: data.orderId,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        status: DeliveryStatus.PENDING,
        estimatedDelivery: data.estimatedDelivery,
        trackingUrl: data.trackingUrl,
        notes: data.notes,
      },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    // Create initial tracking event
    await this.addTrackingEvent(tracking.id, {
      status: DeliveryStatus.PENDING,
      description: 'Package prepared for shipment',
      timestamp: new Date(),
    });

    return this.formatTrackingInfo(tracking);
  }

  async updateTrackingStatus(
    trackingId: string,
    status: DeliveryStatus,
    eventData?: Omit<TrackingEventData, 'status'>
  ): Promise<TrackingInfo> {
    // Update tracking status
    const tracking = await this.prisma.deliveryTracking.update({
      where: { id: trackingId },
      data: {
        status,
        ...(status === DeliveryStatus.DELIVERED && {
          actualDelivery: new Date(),
        }),
      },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    // Add tracking event
    await this.addTrackingEvent(trackingId, {
      status,
      location: eventData?.location,
      description:
        eventData?.description || this.getDefaultStatusDescription(status),
      timestamp: eventData?.timestamp || new Date(),
    });

    // Update order status if delivered
    if (status === DeliveryStatus.DELIVERED) {
      await this.prisma.order.update({
        where: { id: tracking.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    return this.getTrackingInfo(trackingId);
  }

  async addTrackingEvent(
    trackingId: string,
    eventData: TrackingEventData
  ): Promise<void> {
    await this.prisma.trackingEvent.create({
      data: {
        trackingId,
        status: eventData.status,
        location: eventData.location,
        description: eventData.description,
        timestamp: eventData.timestamp,
      },
    });
  }

  async getTrackingInfo(trackingId: string): Promise<TrackingInfo> {
    const tracking = await this.prisma.deliveryTracking.findUnique({
      where: { id: trackingId },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!tracking) {
      throw new Error('Tracking information not found');
    }

    return this.formatTrackingInfo(tracking);
  }

  async getTrackingByNumber(trackingNumber: string): Promise<TrackingInfo> {
    const tracking = await this.prisma.deliveryTracking.findUnique({
      where: { trackingNumber },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!tracking) {
      throw new Error('Tracking information not found');
    }

    return this.formatTrackingInfo(tracking);
  }

  async getOrderTracking(orderId: string): Promise<TrackingInfo | null> {
    const tracking = await this.prisma.deliveryTracking.findUnique({
      where: { orderId },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    return tracking ? this.formatTrackingInfo(tracking) : null;
  }

  async getTrackingByOrderId(orderId: string): Promise<TrackingInfo | null> {
    const tracking = await this.prisma.deliveryTracking.findUnique({
      where: { orderId },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    return tracking ? this.formatTrackingInfo(tracking) : null;
  }

  async bulkUpdateTracking(
    updates: Array<{
      trackingNumber: string;
      status: DeliveryStatus;
      location?: string;
      description?: string;
      timestamp?: Date;
    }>
  ): Promise<void> {
    for (const update of updates) {
      try {
        const tracking = await this.prisma.deliveryTracking.findUnique({
          where: { trackingNumber: update.trackingNumber },
        });

        if (tracking) {
          await this.updateTrackingStatus(tracking.id, update.status, {
            location: update.location,
            description: update.description || '',
            timestamp: update.timestamp || new Date(),
          });
        }
      } catch (error) {
        console.error(
          `Failed to update tracking ${update.trackingNumber}:`,
          error
        );
      }
    }
  }

  async getDeliveryAnalytics(startDate: Date, endDate: Date) {
    const deliveries = await this.prisma.deliveryTracking.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        events: true,
      },
    });

    const analytics = {
      totalDeliveries: deliveries.length,
      deliveredCount: deliveries.filter(
        d => d.status === DeliveryStatus.DELIVERED
      ).length,
      inTransitCount: deliveries.filter(
        d => d.status === DeliveryStatus.IN_TRANSIT
      ).length,
      failedDeliveryCount: deliveries.filter(
        d => d.status === DeliveryStatus.FAILED_DELIVERY
      ).length,
      averageDeliveryTime: 0,
      carrierPerformance: {} as Record<string, number>,
    };

    // Calculate average delivery time
    const deliveredOrders = deliveries.filter(d => d.actualDelivery);
    if (deliveredOrders.length > 0) {
      const totalDeliveryTime = deliveredOrders.reduce((sum, delivery) => {
        const deliveryTime =
          delivery.actualDelivery!.getTime() - delivery.createdAt.getTime();
        return sum + deliveryTime;
      }, 0);
      analytics.averageDeliveryTime =
        totalDeliveryTime / deliveredOrders.length / (1000 * 60 * 60 * 24); // Convert to days
    }

    // Calculate carrier performance
    const carrierStats = deliveries.reduce(
      (stats, delivery) => {
        if (!stats[delivery.carrier]) {
          stats[delivery.carrier] = { total: 0, delivered: 0 };
        }
        stats[delivery.carrier].total++;
        if (delivery.status === DeliveryStatus.DELIVERED) {
          stats[delivery.carrier].delivered++;
        }
        return stats;
      },
      {} as Record<string, { total: number; delivered: number }>
    );

    analytics.carrierPerformance = Object.entries(carrierStats).reduce(
      (performance, [carrier, stats]) => {
        performance[carrier] = (stats.delivered / stats.total) * 100;
        return performance;
      },
      {} as Record<string, number>
    );

    return analytics;
  }

  private formatTrackingInfo(tracking: any): TrackingInfo {
    return {
      id: tracking.id,
      orderId: tracking.orderId,
      trackingNumber: tracking.trackingNumber,
      carrier: tracking.carrier,
      status: tracking.status,
      estimatedDelivery: tracking.estimatedDelivery,
      actualDelivery: tracking.actualDelivery,
      trackingUrl: tracking.trackingUrl,
      notes: tracking.notes,
      events: tracking.events.map((event: any) => ({
        status: event.status,
        location: event.location,
        description: event.description,
        timestamp: event.timestamp,
      })),
      createdAt: tracking.createdAt,
      updatedAt: tracking.updatedAt,
    };
  }

  private getDefaultStatusDescription(status: DeliveryStatus): string {
    const descriptions = {
      [DeliveryStatus.PENDING]: 'Package prepared for shipment',
      [DeliveryStatus.PICKED_UP]: 'Package picked up by carrier',
      [DeliveryStatus.IN_TRANSIT]: 'Package in transit',
      [DeliveryStatus.OUT_FOR_DELIVERY]: 'Package out for delivery',
      [DeliveryStatus.DELIVERED]: 'Package delivered successfully',
      [DeliveryStatus.FAILED_DELIVERY]: 'Delivery attempt failed',
      [DeliveryStatus.RETURNED]: 'Package returned to sender',
    };

    return descriptions[status] || 'Status updated';
  }

  async integrateWithCarrier(
    carrier: string,
    trackingNumber: string
  ): Promise<void> {
    // This would integrate with actual carrier APIs (FedEx, UPS, DHL, etc.)
    // For now, we'll simulate the integration
    console.log(
      `Integrating with ${carrier} for tracking number ${trackingNumber}`
    );

    // In a real implementation, you would:
    // 1. Call the carrier's API to get tracking updates
    // 2. Parse the response and update tracking status
    // 3. Set up webhooks for real-time updates
    // 4. Handle rate limiting and error handling
  }
}

export const deliveryTrackingService = new DeliveryTrackingService(
  new PrismaClient()
);
