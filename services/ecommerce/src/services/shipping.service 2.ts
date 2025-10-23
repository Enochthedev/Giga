import {
  PrismaClient,
  ShippingType,
} from '../generated/prisma-client/index.js';

export interface ShippingCalculationRequest {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }>;
  destination: {
    country: string;
    state?: string;
    zipCode?: string;
  };
  orderValue: number;
}

export interface ShippingOption {
  methodId: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays?: number;
  isFree: boolean;
}

export interface ShippingCalculationResult {
  success: boolean;
  options: ShippingOption[];
  error?: string;
}

export class ShippingService {
  constructor(private prisma: PrismaClient) {}

  async calculateShipping(
    request: ShippingCalculationRequest
  ): Promise<ShippingCalculationResult> {
    try {
      // Find applicable shipping zones
      const zones = await this.prisma.shippingZone.findMany({
        where: {
          isActive: true,
          OR: [
            { countries: { has: request.destination.country } },
            { states: { has: request.destination.state || '' } },
          ],
        },
        include: {
          methods: {
            where: { isActive: true },
            include: { rates: true },
          },
        },
      });

      if (zones.length === 0) {
        return {
          success: false,
          options: [],
          error: 'No shipping available to this destination',
        };
      }

      const totalWeight = this.calculateTotalWeight(request.items);
      const options: ShippingOption[] = [];

      for (const zone of zones) {
        for (const method of zone.methods) {
          const cost = await this.calculateMethodCost(method, {
            weight: totalWeight,
            value: request.orderValue,
            items: request.items,
          });

          if (cost !== null) {
            const isFree =
              method.freeThreshold &&
              request.orderValue >= method.freeThreshold;

            options.push({
              methodId: method.id,
              name: method.name,
              description: method.description || undefined,
              cost: isFree ? 0 : cost,
              estimatedDays: method.estimatedDays || undefined,
              isFree: Boolean(isFree),
            });
          }
        }
      }

      // Sort by cost (free shipping first, then by price)
      options.sort((a, b) => {
        if (a.isFree && !b.isFree) return -1;
        if (!a.isFree && b.isFree) return 1;
        return a.cost - b.cost;
      });

      return {
        success: true,
        options,
      };
    } catch (error) {
      console.error('Shipping calculation error:', error);
      return {
        success: false,
        options: [],
        error: 'Failed to calculate shipping',
      };
    }
  }

  private calculateTotalWeight(
    items: ShippingCalculationRequest['items']
  ): number {
    return items.reduce((total, item) => {
      const itemWeight = item.weight || 0.5; // Default 0.5kg if not specified
      return total + itemWeight * item.quantity;
    }, 0);
  }

  private async calculateMethodCost(
    method: any,
    params: { weight: number; value: number; items: any[] }
  ): Promise<number | null> {
    const { weight, value } = params;

    // Check weight limits
    if (method.maxWeight && weight > method.maxWeight) {
      return null; // Method not applicable
    }

    switch (method.type) {
      case ShippingType.FLAT_RATE:
        return method.baseRate;

      case ShippingType.WEIGHT_BASED:
        return this.calculateWeightBasedRate(method, weight);

      case ShippingType.VALUE_BASED:
        return this.calculateValueBasedRate(method, value);

      case ShippingType.FREE:
        return 0;

      default:
        return method.baseRate;
    }
  }

  private calculateWeightBasedRate(method: any, weight: number): number {
    // Find applicable rate based on weight
    const applicableRate = method.rates.find((rate: any) => {
      const minWeight = rate.minWeight || 0;
      const maxWeight = rate.maxWeight || Infinity;
      return weight >= minWeight && weight <= maxWeight;
    });

    return applicableRate ? applicableRate.rate : method.baseRate;
  }

  private calculateValueBasedRate(method: any, value: number): number {
    // Find applicable rate based on order value
    const applicableRate = method.rates.find((rate: any) => {
      const minValue = rate.minValue || 0;
      const maxValue = rate.maxValue || Infinity;
      return value >= minValue && value <= maxValue;
    });

    return applicableRate ? applicableRate.rate : method.baseRate;
  }

  async createShippingZone(data: {
    name: string;
    description?: string;
    countries: string[];
    states?: string[];
  }) {
    return this.prisma.shippingZone.create({
      data: {
        name: data.name,
        description: data.description,
        countries: data.countries,
        states: data.states || [],
        isActive: true,
      },
    });
  }

  async createShippingMethod(data: {
    zoneId: string;
    name: string;
    description?: string;
    type: ShippingType;
    baseRate: number;
    freeThreshold?: number;
    estimatedDays?: number;
    maxWeight?: number;
  }) {
    return this.prisma.shippingMethod.create({
      data: {
        zoneId: data.zoneId,
        name: data.name,
        description: data.description,
        type: data.type,
        baseRate: data.baseRate,
        freeThreshold: data.freeThreshold,
        estimatedDays: data.estimatedDays,
        maxWeight: data.maxWeight,
        isActive: true,
      },
    });
  }

  async addShippingRate(data: {
    methodId: string;
    minWeight?: number;
    maxWeight?: number;
    minValue?: number;
    maxValue?: number;
    rate: number;
  }) {
    return this.prisma.shippingRate.create({
      data,
    });
  }

  async getShippingMethods(zoneId?: string) {
    return this.prisma.shippingMethod.findMany({
      where: {
        isActive: true,
        ...(zoneId && { zoneId }),
      },
      include: {
        zone: true,
        rates: true,
      },
    });
  }

  async getShippingZones() {
    return this.prisma.shippingZone.findMany({
      where: { isActive: true },
      include: {
        methods: {
          where: { isActive: true },
        },
      },
    });
  }
}

export const shippingService = new ShippingService(new PrismaClient());
