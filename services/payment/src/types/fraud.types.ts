export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type FraudRuleType =
  | 'velocity'
  | 'amount'
  | 'geolocation'
  | 'device'
  | 'behavioral'
  | 'blacklist'
  | 'whitelist'
  | 'machine_learning';

export type FraudAction =
  | 'allow'
  | 'review'
  | 'decline'
  | 'challenge'
  | 'step_up_auth';

export interface FraudRule {
  id: string;
  name: string;
  type: FraudRuleType;
  isActive: boolean;
  priority: number;

  // Conditions
  conditions: FraudCondition[];

  // Actions
  action: FraudAction;
  riskScore: number;

  // Metadata
  description?: string;
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface FraudCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'contains'
    | 'in'
    | 'not_in';
  value: any;
  logicalOperator?: 'and' | 'or';
}

export interface FraudAssessment {
  id: string;
  transactionId: string;

  // Overall assessment
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: FraudAction;

  // Rule evaluations
  ruleEvaluations: FraudRuleEvaluation[];

  // Signals
  signals: FraudSignal[];

  // Device and context
  deviceFingerprint?: string;
  ipAddress?: string;
  geolocation?: Geolocation;

  // Behavioral analysis
  behavioralScore?: number;
  velocityFlags?: string[];

  // External scores
  externalScores?: ExternalFraudScore[];

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  assessedAt: Date;
}

export interface FraudRuleEvaluation {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  riskScore: number;
  action: FraudAction;
  details?: Record<string, any>;
}

export interface FraudSignal {
  type: string;
  value: any;
  riskContribution: number;
  description?: string;
}

export interface Geolocation {
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  isVpn?: boolean;
  isTor?: boolean;
}

export interface ExternalFraudScore {
  provider: string;
  score: number;
  details?: Record<string, any>;
}

export interface VelocityCheck {
<<<<<<< HEAD
  userId?: string | undefined;
  ipAddress?: string | undefined;
  deviceFingerprint?: string | undefined;
  paymentMethodId?: string | undefined;
=======
  userId?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
  paymentMethodId?: string;
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

  // Time windows (in minutes)
  timeWindows: number[];

  // Limits
  transactionCountLimit: number;
  amountLimit: number;

  // Current counts
  transactionCounts: Record<number, number>;
  amounts: Record<number, number>;

  // Flags
  isViolation: boolean;
  violatedWindows: number[];
}

export interface BlacklistEntry {
  id: string;
  type: 'user' | 'email' | 'ip' | 'device' | 'card' | 'phone';
  value: string;
  reason: string;
  isActive: boolean;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhitelistEntry {
  id: string;
  type: 'user' | 'email' | 'ip' | 'device' | 'merchant';
  value: string;
  reason: string;
  isActive: boolean;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  assessmentId: string;

  // Alert details
  type: string;
  severity: RiskLevel;
  message: string;

  // Status
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;

  // Resolution
  resolution?: string;
  resolvedAt?: Date;
  resolvedBy?: string;

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface FraudReview {
  id: string;
  transactionId: string;
  assessmentId: string;

  // Review details
  reviewerId: string;
  decision: 'approve' | 'decline' | 'needs_more_info';
  reason: string;
  notes?: string;

  // Evidence
  evidence?: FraudEvidence[];

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  reviewedAt: Date;
}

export interface FraudEvidence {
  type: string;
  description: string;
  value: any;
  source: string;
  confidence: number;
}
