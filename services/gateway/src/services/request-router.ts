import { FastifyRequest } from 'fastify';
import {
  PathRewriteRule,
  RequestTransformation,
  RouteMatch,
  RoutingCondition,
  RoutingRule,
  ServiceConfig,
} from '../types/index.js';
import { ServiceRegistry } from './service-registry.js';

export class RequestRouter {
  private serviceRegistry: ServiceRegistry;
  private routingRules: Map<string, RoutingRule[]> = new Map();
  private pathPatternCache: Map<string, RegExp> = new Map();

  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
    this.initializeDefaultRoutes();
  }

  /**
   * Initialize default routing rules based on service prefixes
   */
  private initializeDefaultRoutes(): void {
    // Default routing rules for each service
    const defaultRules: RoutingRule[] = [
      {
        id: 'auth-routes',
        pattern: '/api/v1/auth/*',
        method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        serviceId: 'auth',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Authentication service routes' },
      },
      {
        id: 'ecommerce-products',
        pattern: '/api/v1/products/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'ecommerce',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Ecommerce product routes' },
      },
      {
        id: 'ecommerce-vendor',
        pattern: '/api/v1/vendor/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'ecommerce',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Ecommerce vendor routes' },
      },
      {
        id: 'ecommerce-cart',
        pattern: '/api/v1/cart/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'ecommerce',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Ecommerce cart routes' },
      },
      {
        id: 'ecommerce-orders',
        pattern: '/api/v1/orders/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'ecommerce',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Ecommerce order routes' },
      },
      {
        id: 'payment-routes',
        pattern: '/api/v1/payments/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'payment',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Payment service routes' },
      },
      {
        id: 'taxi-rides',
        pattern: '/api/v1/rides/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'taxi',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Taxi ride routes' },
      },
      {
        id: 'taxi-drivers',
        pattern: '/api/v1/drivers/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'taxi',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Taxi driver routes' },
      },
      {
        id: 'hotel-properties',
        pattern: '/api/v1/properties/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'hotel',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Hotel property routes' },
      },
      {
        id: 'hotel-host',
        pattern: '/api/v1/host/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'hotel',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Hotel host routes' },
      },
      {
        id: 'hotel-bookings',
        pattern: '/api/v1/bookings/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'hotel',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Hotel booking routes' },
      },
      {
        id: 'ads-campaigns',
        pattern: '/api/v1/campaigns/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'ads',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Ads campaign routes' },
      },
      {
        id: 'ads-advertiser',
        pattern: '/api/v1/advertiser/*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        serviceId: 'ads',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: { description: 'Ads advertiser routes' },
      },
    ];

    // Group rules by service ID for efficient lookup
    for (const rule of defaultRules) {
      const serviceRules = this.routingRules.get(rule.serviceId) || [];
      serviceRules.push(rule);
      this.routingRules.set(rule.serviceId, serviceRules);
    }

    console.log(`Initialized ${defaultRules.length} default routing rules`);
  }

  /**
   * Add a custom routing rule
   */
  addRoutingRule(rule: RoutingRule): void {
    const serviceRules = this.routingRules.get(rule.serviceId) || [];

    // Remove existing rule with same ID if it exists
    const existingIndex = serviceRules.findIndex(r => r.id === rule.id);
    if (existingIndex >= 0) {
      serviceRules.splice(existingIndex, 1);
    }

    // Add the new rule
    serviceRules.push(rule);

    // Sort rules by priority (higher priority first)
    serviceRules.sort((a, b) => b.priority - a.priority);

    this.routingRules.set(rule.serviceId, serviceRules);

    // Clear pattern cache for this rule
    this.pathPatternCache.delete(rule.pattern);

    console.log(`Added routing rule: ${rule.id} for service ${rule.serviceId}`);
  }

  /**
   * Remove a routing rule
   */
  removeRoutingRule(ruleId: string): void {
    for (const [serviceId, rules] of this.routingRules.entries()) {
      const ruleIndex = rules.findIndex(r => r.id === ruleId);
      if (ruleIndex >= 0) {
        const removedRule = rules.splice(ruleIndex, 1)[0];
        this.pathPatternCache.delete(removedRule.pattern);
        console.log(
          `Removed routing rule: ${ruleId} from service ${serviceId}`
        );
        return;
      }
    }
  }

  /**
   * Resolve service and routing rule for a request
   */
  resolveRoute(request: FastifyRequest): RouteMatch | null {
    const path = request.url;
    const method = request.method;

    // Get all rules and sort by priority (higher priority first)
    const allRules: Array<{ rule: RoutingRule; serviceId: string }> = [];
    for (const [serviceId, rules] of this.routingRules.entries()) {
      for (const rule of rules) {
        allRules.push({ rule, serviceId });
      }
    }

    // Sort by priority (higher priority first)
    allRules.sort((a, b) => b.rule.priority - a.rule.priority);

    // Try to match against all routing rules in priority order
    for (const { rule, serviceId } of allRules) {
      // Check if rule is enabled
      if (rule.metadata.enabled === false) {
        continue;
      }

      // Check if method matches
      if (!rule.method.includes(method)) {
        continue;
      }

      // Check if path matches pattern
      const pathMatch = this.matchPath(path, rule.pattern);
      if (!pathMatch.matches) {
        continue;
      }

      // Check additional conditions
      if (!this.evaluateConditions(request, rule.conditions)) {
        continue;
      }

      // Get service configuration
      const serviceConfig = this.serviceRegistry.getService(serviceId);
      if (!serviceConfig) {
        console.warn(`Service not found in registry: ${serviceId}`);
        continue;
      }

      // Handle service versioning
      const versionedServiceConfig = this.resolveServiceVersion(
        request,
        serviceConfig
      );

      // Apply transformations to get final path
      let transformedPath = this.applyTransformations(
        path,
        rule.transformations,
        pathMatch.params
      );

      // Apply path rewrite rules
      transformedPath = this.applyPathRewriteRules(
        transformedPath,
        versionedServiceConfig.pathRewriteRules || []
      );

      return {
        serviceConfig: versionedServiceConfig,
        rule,
        pathParams: pathMatch.params,
        transformedPath,
      };
    }

    return null;
  }

  /**
   * Match path against pattern with parameter extraction
   */
  private matchPath(
    path: string,
    pattern: string
  ): {
    matches: boolean;
    params: Record<string, string>;
  } {
    // Simple wildcard matching for patterns ending with /*
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2); // Remove /*
      if (path.startsWith(prefix)) {
        return { matches: true, params: {} };
      }
    }

    // Check if pattern has parameters
    const hasParams = pattern.includes(':');
    if (!hasParams) {
      // Simple string matching for patterns without parameters
      return { matches: path === pattern, params: {} };
    }

    // Get or create regex for pattern
    let regex = this.pathPatternCache.get(pattern);
    if (!regex) {
      regex = this.createPathRegex(pattern);
      this.pathPatternCache.set(pattern, regex);
    }

    const match = path.match(regex);
    if (!match) {
      return { matches: false, params: {} };
    }

    // Extract named parameters
    const params: Record<string, string> = {};
    const paramNames = this.extractParamNames(pattern);

    for (let i = 0; i < paramNames.length; i++) {
      const paramValue = match[i + 1];
      if (paramValue !== undefined) {
        params[paramNames[i]] = decodeURIComponent(paramValue);
      }
    }

    return { matches: true, params };
  }

  /**
   * Create regex from path pattern
   */
  private createPathRegex(pattern: string): RegExp {
    // Convert pattern to regex
    // /api/v1/users/:id/* -> /^\/api\/v1\/users\/([^\/]+)\/.*$/

    // First, replace parameters with placeholders to avoid escaping them
    const paramPlaceholder = '__PARAM__';
    let regexPattern = pattern.replace(/:(\w+)/g, paramPlaceholder);

    // Escape special regex characters
    regexPattern = regexPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Replace placeholders with capture groups
    // eslint-disable-next-line security/detect-unsafe-regex
    regexPattern = regexPattern.replace(
      new RegExp(paramPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      '([^/]+)'
    );

    // Replace escaped asterisks with .*
    regexPattern = regexPattern.replace(/\\\*/g, '.*');

    // Ensure pattern matches from start
    if (!regexPattern.startsWith('^')) {
      regexPattern = '^' + regexPattern;
    }

    // Handle trailing wildcards
    if (regexPattern.endsWith('.*')) {
      regexPattern = regexPattern.slice(0, -2) + '(?:/.*)?$';
    } else if (!regexPattern.endsWith('$')) {
      regexPattern += '$';
    }

    // eslint-disable-next-line security/detect-unsafe-regex
    return new RegExp(regexPattern);
  }

  /**
   * Extract parameter names from pattern
   */
  private extractParamNames(pattern: string): string[] {
    const paramRegex = /:(\w+)/g;
    const params: string[] = [];
    let match;

    while ((match = paramRegex.exec(pattern)) !== null) {
      params.push(match[1]);
    }

    return params;
  }

  /**
   * Evaluate routing conditions
   */
  private evaluateConditions(
    request: FastifyRequest,
    conditions: RoutingCondition[]
  ): boolean {
    for (const condition of conditions) {
      if (!this.evaluateCondition(request, condition)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluate a single routing condition
   */
  private evaluateCondition(
    request: FastifyRequest,
    condition: RoutingCondition
  ): boolean {
    let actualValue: any;

    switch (condition.type) {
      case 'header':
        actualValue = request.headers[condition.field.toLowerCase()];
        break;
      case 'query':
        actualValue = (request.query as any)?.[condition.field];
        break;
      case 'body':
        actualValue = (request.body as any)?.[condition.field];
        break;
      case 'user':
        actualValue = (request as any).user?.[condition.field];
        break;
      case 'feature_flag':
        // TODO: Implement feature flag evaluation
        actualValue = false;
        break;
      default:
        return false;
    }

    switch (condition.operator) {
      case 'equals':
        return actualValue === condition.value;
      case 'contains':
        return (
          typeof actualValue === 'string' &&
          actualValue.includes(condition.value)
        );
      case 'regex':
        // eslint-disable-next-line security/detect-unsafe-regex
        return (
          typeof actualValue === 'string' &&
          new RegExp(condition.value).test(actualValue)
        );
      case 'exists':
        return actualValue !== undefined && actualValue !== null;
      default:
        return false;
    }
  }

  /**
   * Apply request transformations
   */
  private applyTransformations(
    originalPath: string,
    transformations: RequestTransformation[],
    pathParams: Record<string, string>
  ): string {
    let transformedPath = originalPath;

    for (const transformation of transformations) {
      if (transformation.type === 'path') {
        switch (transformation.action) {
          case 'rewrite':
            if (transformation.pattern && transformation.replacement) {
              // eslint-disable-next-line security/detect-unsafe-regex
              const regex = new RegExp(transformation.pattern);
              transformedPath = transformedPath.replace(
                regex,
                transformation.replacement
              );
            }
            break;
          case 'replace':
            if (transformation.field && transformation.value) {
              transformedPath = transformedPath.replace(
                transformation.field,
                transformation.value
              );
            }
            break;
        }
      }
    }

    // Replace path parameters in transformed path
    for (const [paramName, paramValue] of Object.entries(pathParams)) {
      transformedPath = transformedPath.replace(`:${paramName}`, paramValue);
    }

    return transformedPath;
  }

  /**
   * Apply path rewrite rules
   */
  private applyPathRewriteRules(
    path: string,
    rules: PathRewriteRule[]
  ): string {
    let rewrittenPath = path;

    for (const rule of rules) {
      try {
        // eslint-disable-next-line security/detect-unsafe-regex
        const regex = new RegExp(rule.pattern, rule.flags || 'g');
        rewrittenPath = rewrittenPath.replace(regex, rule.replacement);
      } catch (error) {
        console.warn(
          `Invalid path rewrite rule pattern: ${rule.pattern}`,
          error
        );
      }
    }

    return rewrittenPath;
  }

  /**
   * Resolve service version based on request
   */
  private resolveServiceVersion(
    request: FastifyRequest,
    serviceConfig: ServiceConfig
  ): ServiceConfig {
    if (!serviceConfig.versioning.enabled) {
      return serviceConfig;
    }

    let requestedVersion: string | null = null;

    // Extract version from request based on strategy
    switch (serviceConfig.versioning.strategy) {
      case 'header':
        requestedVersion = request.headers[
          serviceConfig.versioning.headerName?.toLowerCase() || 'x-api-version'
        ] as string;
        break;
      case 'path': {
        // Extract version from path prefix (e.g., /v1/users -> v1)
        const pathMatch = request.url.match(/^\/api\/(v\d+)\//);
        requestedVersion = pathMatch ? pathMatch[1] : null;
        break;
      }
      case 'query':
        requestedVersion = (request.query as any)?.[
          serviceConfig.versioning.queryParam || 'version'
        ];
        break;
    }

    if (requestedVersion) {
      const versionConfig = this.serviceRegistry.getServiceVersion(
        serviceConfig.id,
        requestedVersion
      );
      if (versionConfig && versionConfig.isActive) {
        // Create a modified service config for this version
        return {
          ...serviceConfig,
          version: versionConfig.version,
          upstream: versionConfig.endpoints.map((ep: any) => ep.url),
          metadata: {
            ...serviceConfig.metadata,
            resolvedVersion: versionConfig.version,
            isVersioned: true,
          },
        };
      }
    }

    // Fall back to default version
    const defaultVersion = this.serviceRegistry.getDefaultServiceVersion(
      serviceConfig.id
    );
    if (defaultVersion && defaultVersion.isActive) {
      return {
        ...serviceConfig,
        version: defaultVersion.version,
        upstream: defaultVersion.endpoints.map((ep: any) => ep.url),
        metadata: {
          ...serviceConfig.metadata,
          resolvedVersion: defaultVersion.version,
          isVersioned: true,
          usedDefault: true,
        },
      };
    }

    return serviceConfig;
  }

  /**
   * Add dynamic routing rule with pattern matching
   */
  addDynamicRoutingRule(rule: RoutingRule): void {
    // Validate rule pattern
    if (!this.validateRoutingPattern(rule.pattern)) {
      throw new Error(`Invalid routing pattern: ${rule.pattern}`);
    }

    // Add the rule
    this.addRoutingRule(rule);

    console.log(`Added dynamic routing rule: ${rule.id}`);
  }

  /**
   * Validate routing pattern
   */
  private validateRoutingPattern(pattern: string): boolean {
    try {
      // Test if pattern can be converted to regex
      this.createPathRegex(pattern);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update routing rules with hot reload support
   */
  hotReloadRoutingRules(serviceId: string, rules: RoutingRule[]): void {
    // Validate all rules before applying
    for (const rule of rules) {
      if (!this.validateRoutingPattern(rule.pattern)) {
        throw new Error(
          `Invalid routing pattern in rule ${rule.id}: ${rule.pattern}`
        );
      }
    }

    // Apply the rules
    this.updateServiceRoutingRules(serviceId, rules);

    console.log(
      `Hot reloaded ${rules.length} routing rules for service: ${serviceId}`
    );
  }

  /**
   * Get routing rule by ID
   */
  getRoutingRule(ruleId: string): RoutingRule | null {
    for (const rules of this.routingRules.values()) {
      const rule = rules.find(r => r.id === ruleId);
      if (rule) return rule;
    }
    return null;
  }

  /**
   * Enable/disable routing rule
   */
  toggleRoutingRule(ruleId: string, enabled: boolean): void {
    const rule = this.getRoutingRule(ruleId);
    if (!rule) {
      throw new Error(`Routing rule not found: ${ruleId}`);
    }

    rule.metadata.enabled = enabled;
    console.log(`${enabled ? 'Enabled' : 'Disabled'} routing rule: ${ruleId}`);
  }

  /**
   * Get all routing rules
   */
  getAllRoutingRules(): RoutingRule[] {
    const allRules: RoutingRule[] = [];
    for (const rules of this.routingRules.values()) {
      allRules.push(...rules);
    }
    return allRules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get routing rules for a specific service
   */
  getServiceRoutingRules(serviceId: string): RoutingRule[] {
    return this.routingRules.get(serviceId) || [];
  }

  /**
   * Update routing rules for a service
   */
  updateServiceRoutingRules(serviceId: string, rules: RoutingRule[]): void {
    // Clear existing rules for service
    this.routingRules.delete(serviceId);

    // Clear pattern cache for old rules
    for (const rule of rules) {
      this.pathPatternCache.delete(rule.pattern);
    }

    // Add new rules
    for (const rule of rules) {
      this.addRoutingRule(rule);
    }

    console.log(`Updated routing rules for service: ${serviceId}`);
  }

  /**
   * Clear pattern cache
   */
  clearPatternCache(): void {
    this.pathPatternCache.clear();
    console.log('Pattern cache cleared');
  }

  /**
   * Get routing statistics
   */
  getStats(): {
    totalRules: number;
    rulesByService: Record<string, number>;
    cachedPatterns: number;
  } {
    const rulesByService: Record<string, number> = {};
    let totalRules = 0;

    for (const [serviceId, rules] of this.routingRules.entries()) {
      rulesByService[serviceId] = rules.length;
      totalRules += rules.length;
    }

    return {
      totalRules,
      rulesByService,
      cachedPatterns: this.pathPatternCache.size,
    };
  }
}
