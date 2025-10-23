import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import {
  FraudAction,
  FraudCondition,
  FraudRule,
  FraudRuleEvaluation,
  FraudRuleType,
} from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface FraudRulesEngineConfig {
  enableRuleCache: boolean;
  cacheExpirationMinutes: number;
  maxRulesPerType: number;
  enableRuleMetrics: boolean;
}

export class FraudRulesEngineService {
  private prisma: PrismaClient;
  private config: FraudRulesEngineConfig;
  private ruleCache: Map<string, FraudRule[]> = new Map();
  private lastCacheUpdate: Date = new Date(0);

  constructor(prisma: PrismaClient, config: FraudRulesEngineConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Create a new fraud rule
   */
  async createRule(
    rule: Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<FraudRule> {
    try {
      logger.info('Creating new fraud rule', {
        ruleName: rule.name,
        type: rule.type,
      });

      const createdRule = await this.prisma.fraudRule.create({
        data: {
          name: rule.name,
          type: rule.type,
          isActive: rule.isActive,
          priority: rule.priority,
          conditions: rule.conditions as any,
          action: rule.action,
          riskScore: rule.riskScore,
          description: rule.description,
          metadata: rule.metadata || {},
        },
      });

      // Clear cache to force reload
      this.clearRuleCache();

      logger.info('Fraud rule created successfully', {
        ruleId: createdRule.id,
      });

      return this.mapPrismaRuleToFraudRule(createdRule);
    } catch (error) {
      logger.error('Error creating fraud rule', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ruleName: rule.name,
      });
      throw error;
    }
  }

  /**
   * Update an existing fraud rule
   */
  async updateRule(
    ruleId: string,
    updates: Partial<Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FraudRule> {
    try {
      logger.info('Updating fraud rule', { ruleId });

      const updatedRule = await this.prisma.fraudRule.update({
        where: { id: ruleId },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.type && { type: updates.type }),
          ...(updates.isActive !== undefined && { isActive: updates.isActive }),
          ...(updates.priority !== undefined && { priority: updates.priority }),
          ...(updates.conditions && { conditions: updates.conditions as any }),
          ...(updates.action && { action: updates.action }),
          ...(updates.riskScore !== undefined && {
            riskScore: updates.riskScore,
          }),
          ...(updates.description && { description: updates.description }),
          ...(updates.metadata && { metadata: updates.metadata }),
        },
      });

      // Clear cache to force reload
      this.clearRuleCache();

      logger.info('Fraud rule updated successfully', { ruleId });

      return this.mapPrismaRuleToFraudRule(updatedRule);
    } catch (error) {
      logger.error('Error updating fraud rule', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ruleId,
      });
      throw error;
    }
  }

  /**
   * Delete a fraud rule
   */
  async deleteRule(ruleId: string): Promise<void> {
    try {
      logger.info('Deleting fraud rule', { ruleId });

      await this.prisma.fraudRule.delete({
        where: { id: ruleId },
      });

      // Clear cache to force reload
      this.clearRuleCache();

      logger.info('Fraud rule deleted successfully', { ruleId });
    } catch (error) {
      logger.error('Error deleting fraud rule', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ruleId,
      });
      throw error;
    }
  }

  /**
   * Get all active fraud rules
   */
  async getActiveRules(): Promise<FraudRule[]> {
    if (this.config.enableRuleCache && this.isCacheValid()) {
      const cachedRules = this.ruleCache.get('active');
      if (cachedRules) {
        return cachedRules;
      }
    }

    try {
      const rules = await this.prisma.fraudRule.findMany({
        where: { isActive: true },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      });

      const mappedRules = rules.map(rule =>
        this.mapPrismaRuleToFraudRule(rule)
      );

      if (this.config.enableRuleCache) {
        this.ruleCache.set('active', mappedRules);
        this.lastCacheUpdate = new Date();
      }

      return mappedRules;
    } catch (error) {
      logger.error('Error fetching active fraud rules', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get rules by type
   */
  async getRulesByType(type: FraudRuleType): Promise<FraudRule[]> {
    const cacheKey = `type_${type}`;

    if (this.config.enableRuleCache && this.isCacheValid()) {
      const cachedRules = this.ruleCache.get(cacheKey);
      if (cachedRules) {
        return cachedRules;
      }
    }

    try {
      const rules = await this.prisma.fraudRule.findMany({
        where: { type, isActive: true },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        take: this.config.maxRulesPerType,
      });

      const mappedRules = rules.map(rule =>
        this.mapPrismaRuleToFraudRule(rule)
      );

      if (this.config.enableRuleCache) {
        this.ruleCache.set(cacheKey, mappedRules);
      }

      return mappedRules;
    } catch (error) {
      logger.error('Error fetching fraud rules by type', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type,
      });
      throw error;
    }
  }

  /**
   * Evaluate all active rules against a transaction
   */
  async evaluateAllRules(
    transaction: Transaction
  ): Promise<FraudRuleEvaluation[]> {
    try {
      logger.info('Evaluating all fraud rules', {
        transactionId: transaction.id,
      });

      const activeRules = await this.getActiveRules();
      const evaluations: FraudRuleEvaluation[] = [];

      for (const rule of activeRules) {
        const evaluation = await this.evaluateRule(rule, transaction);
        evaluations.push(evaluation);

        // Log rule matches for monitoring
        if (evaluation.matched) {
          logger.info('Fraud rule matched', {
            transactionId: transaction.id,
            ruleId: rule.id,
            ruleName: rule.name,
            riskScore: evaluation.riskScore,
            action: evaluation.action,
          });
        }
      }

      logger.info('Fraud rule evaluation completed', {
        transactionId: transaction.id,
        totalRules: activeRules.length,
        matchedRules: evaluations.filter(e => e.matched).length,
      });

      return evaluations;
    } catch (error) {
      logger.error('Error evaluating fraud rules', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      throw error;
    }
  }

  /**
   * Evaluate a specific rule against a transaction
   */
  async evaluateRule(
    rule: FraudRule,
    transaction: Transaction
  ): Promise<FraudRuleEvaluation> {
    try {
      let matched = true;
      const details: Record<string, any> = {};
      let currentLogicalOperator: 'and' | 'or' = 'and';

      // Process conditions with logical operators
      for (let i = 0; i < rule.conditions.length; i++) {
        const condition = rule.conditions[i];
        const fieldValue = this.getFieldValue(transaction, condition.field);
        const conditionMet = this.evaluateCondition(fieldValue, condition);

        details[`condition_${i}`] = {
          field: condition.field,
          operator: condition.operator,
          expectedValue: condition.value,
          actualValue: fieldValue,
          met: conditionMet,
          logicalOperator: condition.logicalOperator,
        };

        // Handle logical operators
        if (i === 0) {
          matched = conditionMet;
          currentLogicalOperator = condition.logicalOperator || 'and';
        } else {
          if (currentLogicalOperator === 'or') {
            matched = matched || conditionMet;
          } else {
            matched = matched && conditionMet;
          }
          currentLogicalOperator = condition.logicalOperator || 'and';
        }

        // Short-circuit evaluation for OR conditions
        if (currentLogicalOperator === 'or' && matched) {
          break;
        }
      }

      return {
        ruleId: rule.id,
        ruleName: rule.name,
        matched,
        riskScore: matched ? rule.riskScore : 0,
        action: matched ? rule.action : 'allow',
        details,
      };
    } catch (error) {
      logger.error('Error evaluating individual fraud rule', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ruleId: rule.id,
        transactionId: transaction.id,
      });

      return {
        ruleId: rule.id,
        ruleName: rule.name,
        matched: false,
        riskScore: 0,
        action: 'allow',
        details: { error: 'Rule evaluation failed' },
      };
    }
  }

  /**
   * Get field value from transaction using dot notation
   */
  private getFieldValue(transaction: Transaction, field: string): any {
    const parts = field.split('.');
    let value: any = transaction;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(
    fieldValue: any,
    condition: FraudCondition
  ): boolean {
    try {
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;

        case 'not_equals':
          return fieldValue !== condition.value;

        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);

        case 'less_than':
          return Number(fieldValue) < Number(condition.value);

        case 'contains':
          return String(fieldValue)
            .toLowerCase()
            .includes(String(condition.value).toLowerCase());

        case 'in':
          return (
            Array.isArray(condition.value) &&
            condition.value.includes(fieldValue)
          );

        case 'not_in':
          return (
            Array.isArray(condition.value) &&
            !condition.value.includes(fieldValue)
          );

        default:
          logger.warn('Unknown condition operator', {
            operator: condition.operator,
          });
          return false;
      }
    } catch (error) {
      logger.error('Error evaluating condition', {
        error: error instanceof Error ? error.message : 'Unknown error',
        operator: condition.operator,
        fieldValue,
        conditionValue: condition.value,
      });
      return false;
    }
  }

  /**
   * Get rule statistics
   */
  async getRuleStatistics(
    ruleId: string,
    days: number = 30
  ): Promise<{
    totalEvaluations: number;
    matches: number;
    matchRate: number;
    avgRiskScore: number;
    actions: Record<FraudAction, number>;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // In a real implementation, you would query evaluation logs
      // For now, we'll return mock statistics
      return {
        totalEvaluations: 1000,
        matches: 50,
        matchRate: 0.05,
        avgRiskScore: 25,
        actions: {
          allow: 950,
          review: 30,
          decline: 15,
          challenge: 5,
          step_up_auth: 0,
        },
      };
    } catch (error) {
      logger.error('Error getting rule statistics', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ruleId,
      });
      throw error;
    }
  }

  /**
   * Bulk update rule priorities
   */
  async updateRulePriorities(
    rulePriorities: { ruleId: string; priority: number }[]
  ): Promise<void> {
    try {
      logger.info('Updating rule priorities', { count: rulePriorities.length });

      await this.prisma.$transaction(
        rulePriorities.map(({ ruleId, priority }) =>
          this.prisma.fraudRule.update({
            where: { id: ruleId },
            data: { priority },
          })
        )
      );

      // Clear cache to force reload
      this.clearRuleCache();

      logger.info('Rule priorities updated successfully');
    } catch (error) {
      logger.error('Error updating rule priorities', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Test a rule against sample data
   */
  async testRule(
    rule: FraudRule,
    sampleTransaction: Transaction
  ): Promise<FraudRuleEvaluation> {
    logger.info('Testing fraud rule', { ruleId: rule.id, ruleName: rule.name });
    return this.evaluateRule(rule, sampleTransaction);
  }

  /**
   * Cache management methods
   */
  private isCacheValid(): boolean {
    const cacheAge = Date.now() - this.lastCacheUpdate.getTime();
    const maxAge = this.config.cacheExpirationMinutes * 60 * 1000;
    return cacheAge < maxAge;
  }

  private clearRuleCache(): void {
    this.ruleCache.clear();
    this.lastCacheUpdate = new Date(0);
  }

  /**
   * Map Prisma rule to FraudRule type
   */
  private mapPrismaRuleToFraudRule(prismaRule: any): FraudRule {
    return {
      id: prismaRule.id,
      name: prismaRule.name,
      type: prismaRule.type as FraudRuleType,
      isActive: prismaRule.isActive,
      priority: prismaRule.priority,
      conditions: Array.isArray(prismaRule.conditions)
        ? (prismaRule.conditions as FraudCondition[])
        : [],
      action: prismaRule.action as FraudAction,
      riskScore: prismaRule.riskScore,
      description: prismaRule.description,
      metadata: prismaRule.metadata || {},
      createdAt: prismaRule.createdAt,
      updatedAt: prismaRule.updatedAt,
    };
  }
}
