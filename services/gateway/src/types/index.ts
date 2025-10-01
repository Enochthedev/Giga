export interface ServiceInstance {
  id: string;
  url: string;
  weight: number;
  currentConnections: number;
  responseTime: number;
  errorRate: number;
  isHealthy: boolean;
  lastHealthCheck: Date;
  metadata: Record<string, any>;
}

export interface ServiceConfig {
  id: string;
  name: string;
  version: string;
  upstream: string[];
  prefix: string;
  rewritePrefix?: string;
  pathRewriteRules?: PathRewriteRule[];
  timeout: number;
  retries: number;
  healthCheck: HealthCheckConfig;
  loadBalancing: LoadBalancingStrategy;
  failover: ServiceFailoverConfig;
  versioning: {
    enabled: boolean;
    strategy: 'header' | 'path' | 'query';
    headerName?: string;
    pathPrefix?: string;
    queryParam?: string;
  };
  metadata: Record<string, any>;
}

export interface HealthCheckConfig {
  enabled: boolean;
  path: string;
  interval: number;
  timeout: number;
  retries: number;
  expectedStatus: number[];
}

export interface LoadBalancingStrategy {
  algorithm: 'round-robin' | 'weighted' | 'least-connections' | 'response-time';
  stickySession?: boolean;
  sessionKey?: string;
}

export interface RoutingRule {
  id: string;
  pattern: string;
  method: string[];
  serviceId: string;
  priority: number;
  conditions: RoutingCondition[];
  transformations: RequestTransformation[];
  metadata: Record<string, any>;
}

export interface RoutingCondition {
  type: 'header' | 'query' | 'body' | 'user' | 'feature_flag';
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'exists';
  value: any;
}

export interface RequestTransformation {
  type: 'header' | 'query' | 'path' | 'body';
  action: 'add' | 'remove' | 'replace' | 'rewrite';
  field: string;
  value?: any;
  pattern?: string;
  replacement?: string;
}

export interface RouteMatch {
  serviceConfig: ServiceConfig;
  rule: RoutingRule;
  pathParams: Record<string, string>;
  transformedPath: string;
}

export interface ServiceEvent {
  type:
    | 'register'
    | 'deregister'
    | 'health_change'
    | 'config_update'
    | 'discovery_error'
    | 'endpoints_update'
    | 'version_register'
    | 'version_deprecate'
    | 'rewrite_rule_add'
    | 'rewrite_rule_remove';
  serviceId: string;
  timestamp: Date;
  data: any;
}

export interface InstanceMetrics {
  responseTime: number;
  errorCount: number;
  requestCount: number;
  timestamp: Date;
}

export interface ServiceDefinition {
  id: string;
  name: string;
  version: string;
  endpoints: ServiceEndpoint[];
  healthCheck: HealthCheckConfig;
  metadata: Record<string, any>;
}

export interface ServiceEndpoint {
  url: string;
  weight: number;
  metadata: Record<string, any>;
}

export interface ServiceVersionConfig {
  version: string;
  isDefault: boolean;
  isActive: boolean;
  endpoints: ServiceEndpoint[];
  routingRules?: RoutingRule[];
  deprecationDate?: Date;
  migrationGuide?: string;
}

export interface ServiceDiscoveryConfig {
  enabled: boolean;
  provider: 'consul' | 'etcd' | 'kubernetes' | 'dns' | 'static';
  endpoint?: string;
  interval: number;
  timeout: number;
  namespace?: string;
  tags?: string[];
}

export interface PathRewriteRule {
  pattern: string;
  replacement: string;
  flags?: string;
}

export interface ServiceFailoverConfig {
  enabled: boolean;
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  fallbackService?: string;
}
