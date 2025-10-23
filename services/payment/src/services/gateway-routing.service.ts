import {
  GatewaySelectionCriteria,
  IGatewayHealthMonitor,
  IGatewayMetricsCollector,
} from '../interfaces/gateway.interface';
import { logger } from '../lib/logger';
import { PaymentGateway } from '../types/gateway.types';
import { PaymentRequest } from '../types/payment.types';

interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  conditions: RoutingCondition[];
  action: RoutingAction;
  isActive: boolean;
  metadata?: Record<string, any>;
}

interface RoutingCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'not_in'
    | 'contains'
    | 'regex';
  value: any;
}

interface RoutingAction {
  type: 'route_to_gateway' | 'route_to_gateways' | 'apply_strategy' | 'reject';
  gatewayIds?: string[];
  strategy?: string;
  reason?: string;
}

interface RoutingResult {
  gatewayId?: string;
  gateways?: PaymentGateway[];
  strategy?: string;
  reason: string;
  ruleApplied?: string;
  metadata?: Record<string, any>;
}

/**
 * Gateway Routing Service
 * Implements intelligent routing logic with rule-based routing and dynamic strategies
 */
export class GatewayRoutingService {
  private routingRules: Map<string, RoutingRule> = new Map();
  private healthMonitor: IGatewayHealthMonitor;
  private metricsCollector: IGatewayMetricsCollector;
  private gatewayRegistry: Map<string, PaymentGateway> = new Map();

  constructor(
    healthMonitor: IGatewayHealthMonitor,
    metricsCollector: IGatewayMetricsCollector
  ) {
    this.healthMonitor = healthMonitor;
    this.metricsCollector = metricsCollector;
    this.initializeDefaultRules();
  }

  /**
   * Sets the gateway registry for routing decisions
   */
  setGatewayRegistry(gateways: Map<string, PaymentGateway>): void {
    this.gatewayRegistry = gateways;
  }

  /**
   * Routes a payment request to the most appropriate gateway(s)
   */
  async routePayment(request: PaymentRequest): Promise<RoutingResult> {
    try {
      logger.info('Routing payment request', {
        amount: request.amount,
        currency: request.currency,
        userId: request.userId,
      });

      // Convert payment request to routing criteria
      const criteria = this.convertRequestToCriteria(request);

      // Apply routing rules
      const ruleResult = await this.applyRoutingRules(request, criteria);
      if (ruleResult) {
        return ruleResult;
      }

      // Fallback to default routing strategy
      return this.applyDefaultRouting(criteria);
    } catch (error) {
      logger.error('Failed to route payment request', { error, request });
      throw error;
    }
  }

  /**
   * Routes based on geographic location
   */
  async routeByGeography(
    criteria: GatewaySelectionCriteria,
    country: string
  ): Promise<RoutingResult> {
    try {
      logger.info('Routing by geography', { country, criteria });

      // Get gateways that support the country
      const eligibleGateways = Array.from(this.gatewayRegistry.values()).filter(
        gateway => {
          const config = gateway.getConfig();
          return (
            gateway.isActive() &&
            config.settings.supportedCountries.includes(country) &&
            gateway.supportsCurrency(criteria.currency)
          );
        }
      );

      if (eligibleGateways.length === 0) {
        return {
          reason: `No gateways support country: ${country}`,
          metadata: { country, supportedGateways: [] },
        };
      }

      // Prioritize local/regional gateways
      const localGateways = this.getLocalGateways(eligibleGateways, country);
      const gatewaysToUse =
        localGateways.length > 0 ? localGateways : eligibleGateways;

      return {
        gateways: gatewaysToUse,
        reason: `Geographic routing for ${country}`,
        strategy: 'geographic',
        metadata: {
          country,
          localGatewaysFound: localGateways.length,
          totalEligible: eligibleGateways.length,
        },
      };
    } catch (error) {
      logger.error('Failed to route by geography', { error, country });
      throw error;
    }
  }

  /**
   * Routes based on payment amount (different gateways for different amount ranges)
   */
  async routeByAmount(
    criteria: GatewaySelectionCriteria
  ): Promise<RoutingResult> {
    try {
      logger.info('Routing by amount', { amount: criteria.amount });

      const eligibleGateways = Array.from(this.gatewayRegistry.values()).filter(
        gateway => {
          return (
            gateway.isActive() &&
            gateway.supportsAmount(criteria.amount) &&
            gateway.supportsCurrency(criteria.currency)
          );
        }
      );

      if (eligibleGateways.length === 0) {
        return {
          reason: `No gateways support amount: ${criteria.amount}`,
          metadata: { amount: criteria.amount },
        };
      }

      // Apply amount-based routing logic
      let strategy = 'default';
      let selectedGateways = eligibleGateways;

      if (criteria.amount < 10) {
        // Small amounts - prioritize low-cost gateways
        strategy = 'low_cost';
        selectedGateways = this.sortByCost(eligibleGateways, criteria.amount);
      } else if (criteria.amount > 10000) {
        // Large amounts - prioritize high-reliability gateways
        strategy = 'high_reliability';
        selectedGateways = await this.sortByReliability(eligibleGateways);
      } else {
        // Medium amounts - balanced approach
        strategy = 'balanced';
        selectedGateways = await this.sortByBalance(
          eligibleGateways,
          criteria.amount
        );
      }

      return {
        gateways: selectedGateways,
        reason: `Amount-based routing for ${criteria.amount}`,
        strategy,
        metadata: {
          amount: criteria.amount,
          eligibleCount: eligibleGateways.length,
        },
      };
    } catch (error) {
      logger.error('Failed to route by amount', {
        error,
        amount: criteria.amount,
      });
      throw error;
    }
  }

  /**
   * Routes based on payment method type
   */
  async routeByPaymentMethod(
    criteria: GatewaySelectionCriteria
  ): Promise<RoutingResult> {
    try {
      logger.info('Routing by payment method', {
        paymentMethodType: criteria.paymentMethodType,
      });

      if (!criteria.paymentMethodType) {
        return {
          reason: 'No payment method type specified',
          strategy: 'default',
        };
      }

      const eligibleGateways = Array.from(this.gatewayRegistry.values()).filter(
        gateway => {
          const config = gateway.getConfig();
          return (
            gateway.isActive() &&
            config.settings.supportedPaymentMethods.includes(
              criteria.paymentMethodType!
            ) &&
            gateway.supportsCurrency(criteria.currency)
          );
        }
      );

      if (eligibleGateways.length === 0) {
        return {
          reason: `No gateways support payment method: ${criteria.paymentMethodType}`,
          metadata: { paymentMethodType: criteria.paymentMethodType },
        };
      }

      // Sort by payment method optimization
      const optimizedGateways = await this.sortByPaymentMethodOptimization(
        eligibleGateways,
        criteria.paymentMethodType
      );

      return {
        gateways: optimizedGateways,
        reason: `Payment method routing for ${criteria.paymentMethodType}`,
        strategy: 'payment_method_optimized',
        metadata: {
          paymentMethodType: criteria.paymentMethodType,
          eligibleCount: eligibleGateways.length,
        },
      };
    } catch (error) {
      logger.error('Failed to route by payment method', {
        error,
        paymentMethodType: criteria.paymentMethodType,
      });
      throw error;
    }
  }

  /**
   * Routes based on user/merchant preferences and history
   */
  async routeByUserPreferences(
    criteria: GatewaySelectionCriteria,
    userId?: string,
    merchantId?: string
  ): Promise<RoutingResult> {
    try {
      logger.info('Routing by user preferences', { userId, merchantId });

      // Get user/merchant preferences (this would typically come from a database)
      const preferences = await this.getUserPreferences(userId, merchantId);

      let eligibleGateways = Array.from(this.gatewayRegistry.values()).filter(
        gateway =>
          gateway.isActive() && gateway.supportsCurrency(criteria.currency)
      );

      // Apply preferences
      if (
        preferences.preferredGateways &&
        preferences.preferredGateways.length > 0
      ) {
        const preferredGateways = eligibleGateways.filter(gateway =>
          preferences.preferredGateways!.includes(gateway.getId())
        );

        if (preferredGateways.length > 0) {
          eligibleGateways = preferredGateways;
        }
      }

      // Exclude blacklisted gateways
      if (
        preferences.excludedGateways &&
        preferences.excludedGateways.length > 0
      ) {
        eligibleGateways = eligibleGateways.filter(
          gateway => !preferences.excludedGateways!.includes(gateway.getId())
        );
      }

      if (eligibleGateways.length === 0) {
        return {
          reason: 'No gateways match user preferences',
          metadata: { userId, merchantId, preferences },
        };
      }

      return {
        gateways: eligibleGateways,
        reason: 'User preference-based routing',
        strategy: 'user_preferences',
        metadata: {
          userId,
          merchantId,
          preferences,
          eligibleCount: eligibleGateways.length,
        },
      };
    } catch (error) {
      logger.error('Failed to route by user preferences', {
        error,
        userId,
        merchantId,
      });
      throw error;
    }
  }

  /**
   * Adds a custom routing rule
   */
  addRoutingRule(rule: RoutingRule): void {
    logger.info('Adding routing rule', { ruleId: rule.id, name: rule.name });
    this.routingRules.set(rule.id, rule);
  }

  /**
   * Removes a routing rule
   */
  removeRoutingRule(ruleId: string): void {
    logger.info('Removing routing rule', { ruleId });
    this.routingRules.delete(ruleId);
  }

  /**
   * Gets all routing rules
   */
  getRoutingRules(): RoutingRule[] {
    return Array.from(this.routingRules.values()).sort(
      (a, b) => b.priority - a.priority
    );
  }

  /**
   * Updates a routing rule
   */
  updateRoutingRule(ruleId: string, updates: Partial<RoutingRule>): void {
    const existingRule = this.routingRules.get(ruleId);
    if (!existingRule) {
      throw new Error(`Routing rule not found: ${ruleId}`);
    }

    const updatedRule = { ...existingRule, ...updates };
    this.routingRules.set(ruleId, updatedRule);

    logger.info('Updated routing rule', { ruleId, updates });
  }

  private convertRequestToCriteria(
    request: PaymentRequest
  ): GatewaySelectionCriteria {
    return {
      amount: request.amount,
      currency: request.currency,
      paymentMethodType: request.paymentMethodData?.type,
      // Add more criteria based on request data
    };
  }

  private async applyRoutingRules(
    request: PaymentRequest,
    criteria: GatewaySelectionCriteria
  ): Promise<RoutingResult | null> {
    const activeRules = Array.from(this.routingRules.values())
      .filter(rule => rule.isActive)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of activeRules) {
      if (await this.evaluateRule(rule, request, criteria)) {
        logger.info('Routing rule matched', {
          ruleId: rule.id,
          name: rule.name,
        });
        return this.executeRuleAction(rule, criteria);
      }
    }

    return null;
  }

  private async evaluateRule(
    rule: RoutingRule,
    request: PaymentRequest,
    criteria: GatewaySelectionCriteria
  ): Promise<boolean> {
    try {
      for (const condition of rule.conditions) {
        if (!(await this.evaluateCondition(condition, request, criteria))) {
          return false;
        }
      }
      return true;
    } catch (error) {
      logger.warn('Error evaluating routing rule', {
        ruleId: rule.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  private async evaluateCondition(
    condition: RoutingCondition,
    request: PaymentRequest,
    criteria: GatewaySelectionCriteria
  ): Promise<boolean> {
    const value = this.getFieldValue(condition.field, request, criteria);

    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'greater_than':
        return Number(value) > Number(condition.value);
      case 'less_than':
        return Number(value) < Number(condition.value);
      case 'in':
        return (
          Array.isArray(condition.value) && condition.value.includes(value)
        );
      case 'not_in':
        return (
          Array.isArray(condition.value) && !condition.value.includes(value)
        );
      case 'contains':
        return String(value).includes(String(condition.value));
      case 'regex':
        return new RegExp(condition.value).test(String(value));
      default:
        return false;
    }
  }

  private getFieldValue(
    field: string,
    request: PaymentRequest,
    criteria: GatewaySelectionCriteria
  ): any {
    const fieldMap: Record<string, any> = {
      amount: request.amount,
      currency: request.currency,
      userId: request.userId,
      merchantId: request.merchantId,
      paymentMethodType: request.paymentMethodData?.type,
      country: criteria.country,
      // Add more field mappings as needed
    };

    return fieldMap[field];
  }

  private async executeRuleAction(
    rule: RoutingRule,
    criteria: GatewaySelectionCriteria
  ): Promise<RoutingResult> {
    const action = rule.action;

    switch (action.type) {
      case 'route_to_gateway':
        if (action.gatewayIds && action.gatewayIds.length > 0) {
          const gateway = this.gatewayRegistry.get(action.gatewayIds[0]);
          if (gateway) {
            return {
              gatewayId: gateway.getId(),
              reason: action.reason || `Routed by rule: ${rule.name}`,
              ruleApplied: rule.id,
            };
          }
        }
        break;

      case 'route_to_gateways':
        if (action.gatewayIds && action.gatewayIds.length > 0) {
          const gateways = action.gatewayIds
            .map(id => this.gatewayRegistry.get(id))
            .filter(gateway => gateway !== undefined) as PaymentGateway[];

          return {
            gateways,
            reason: action.reason || `Routed by rule: ${rule.name}`,
            ruleApplied: rule.id,
          };
        }
        break;

      case 'apply_strategy':
        return {
          strategy: action.strategy || 'default',
          reason: action.reason || `Strategy applied by rule: ${rule.name}`,
          ruleApplied: rule.id,
        };

      case 'reject':
        throw new Error(
          action.reason || `Payment rejected by rule: ${rule.name}`
        );
    }

    throw new Error(`Invalid rule action: ${action.type}`);
  }

  private async applyDefaultRouting(
    criteria: GatewaySelectionCriteria
  ): Promise<RoutingResult> {
    const eligibleGateways = Array.from(this.gatewayRegistry.values()).filter(
      gateway => {
        return (
          gateway.isActive() &&
          gateway.supportsCurrency(criteria.currency) &&
          gateway.supportsAmount(criteria.amount)
        );
      }
    );

    return {
      gateways: eligibleGateways,
      reason: 'Default routing - all eligible gateways',
      strategy: 'default',
      metadata: {
        eligibleCount: eligibleGateways.length,
      },
    };
  }

  private getLocalGateways(
    gateways: PaymentGateway[],
    country: string
  ): PaymentGateway[] {
    // Define regional gateway preferences
    const regionalPreferences: Record<string, string[]> = {
      NG: ['paystack', 'flutterwave'], // Nigeria
      KE: ['flutterwave', 'paystack'], // Kenya
      ZA: ['paystack', 'flutterwave'], // South Africa
      US: ['stripe', 'square'], // United States
      GB: ['stripe', 'adyen'], // United Kingdom
      DE: ['adyen', 'stripe'], // Germany
      // Add more regional preferences
    };

    const preferredTypes = regionalPreferences[country] || [];

    return gateways.filter(gateway => {
      const gatewayType = gateway.getType().toLowerCase();
      return preferredTypes.includes(gatewayType);
    });
  }

  private sortByCost(
    gateways: PaymentGateway[],
    amount: number
  ): PaymentGateway[] {
    return gateways.sort((a, b) => {
      const costA = this.calculateCost(a, amount);
      const costB = this.calculateCost(b, amount);
      return costA - costB;
    });
  }

  private async sortByReliability(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway[]> {
    const gatewaysWithReliability = await Promise.all(
      gateways.map(async gateway => {
        const metrics = await this.metricsCollector.getLatestMetrics(
          gateway.getId()
        );
        const reliability = metrics?.successRate || 0;
        return { gateway, reliability };
      })
    );

    return gatewaysWithReliability
      .sort((a, b) => b.reliability - a.reliability)
      .map(item => item.gateway);
  }

  private async sortByBalance(
    gateways: PaymentGateway[],
    amount: number
  ): Promise<PaymentGateway[]> {
    const gatewaysWithScore = await Promise.all(
      gateways.map(async gateway => {
        const metrics = await this.metricsCollector.getLatestMetrics(
          gateway.getId()
        );
        const cost = this.calculateCost(gateway, amount);
        const reliability = metrics?.successRate || 0;

        // Balanced score: 60% reliability, 40% cost efficiency
        const costScore = Math.max(0, 1 - cost / (amount * 0.05)); // Normalize cost
        const balanceScore = reliability * 0.6 + costScore * 0.4;

        return { gateway, score: balanceScore };
      })
    );

    return gatewaysWithScore
      .sort((a, b) => b.score - a.score)
      .map(item => item.gateway);
  }

  private async sortByPaymentMethodOptimization(
    gateways: PaymentGateway[],
    paymentMethodType: string
  ): Promise<PaymentGateway[]> {
    // Define payment method preferences for different gateways
    const methodPreferences: Record<string, Record<string, number>> = {
      CARD: { stripe: 0.9, square: 0.8, paypal: 0.7 },
      DIGITAL_WALLET: { paypal: 0.9, stripe: 0.8, square: 0.6 },
      BANK_ACCOUNT: { stripe: 0.8, adyen: 0.9, paypal: 0.7 },
      CRYPTO: {
        /* specialized crypto gateways would go here */
      },
    };

    const preferences = methodPreferences[paymentMethodType] || {};

    return gateways.sort((a, b) => {
      const scoreA = preferences[a.getType().toLowerCase()] || 0.5;
      const scoreB = preferences[b.getType().toLowerCase()] || 0.5;
      return scoreB - scoreA;
    });
  }

  private calculateCost(gateway: PaymentGateway, amount: number): number {
    const config = gateway.getConfig();
    const processingFee = config.settings.processingFee;

    if (!processingFee) {
      return 0;
    }

    if (processingFee.type === 'fixed') {
      return processingFee.value;
    } else if (processingFee.type === 'percentage') {
      return amount * (processingFee.value / 100);
    }

    return 0;
  }

  private async getUserPreferences(
    userId?: string,
    merchantId?: string
  ): Promise<{
    preferredGateways?: string[];
    excludedGateways?: string[];
    preferredStrategies?: string[];
  }> {
    // This would typically fetch from a database
    // For now, return empty preferences
    return {};
  }

  private initializeDefaultRules(): void {
    // High-value transaction rule
    this.addRoutingRule({
      id: 'high_value_transactions',
      name: 'High Value Transactions',
      priority: 100,
      conditions: [{ field: 'amount', operator: 'greater_than', value: 10000 }],
      action: {
        type: 'apply_strategy',
        strategy: 'high_reliability',
        reason: 'High-value transaction requires reliable gateway',
      },
      isActive: true,
    });

    // Low-value transaction rule
    this.addRoutingRule({
      id: 'low_value_transactions',
      name: 'Low Value Transactions',
      priority: 90,
      conditions: [{ field: 'amount', operator: 'less_than', value: 10 }],
      action: {
        type: 'apply_strategy',
        strategy: 'low_cost',
        reason: 'Low-value transaction prioritizes cost efficiency',
      },
      isActive: true,
    });

    logger.info('Initialized default routing rules');
  }
}
