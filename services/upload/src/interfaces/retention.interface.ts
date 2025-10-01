import { EntityType } from '../types/upload.types';

export interface RetentionPolicy {
  id: string;
  name: string;
  entityType: EntityType;
  retentionPeriodDays: number;
  jurisdiction: string;
  isActive: boolean;
  description?: string;
  legalBasis?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RetentionPolicyRule {
  id: string;
  policyId: string;
  condition: RetentionCondition;
  action: RetentionAction;
  priority: number;
  isActive: boolean;
}

export interface RetentionCondition {
  field: string;
  operator:
    | 'equals'
    | 'contains'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'not_in';
  value: any;
}

export interface RetentionAction {
  type: 'delete' | 'archive' | 'anonymize' | 'hold';
  parameters?: Record<string, any>;
}

export interface LegalHold {
  id: string;
  name: string;
  description: string;
  entityType?: EntityType;
  entityIds?: string[];
  fileIds?: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface DataDeletionRequest {
  id: string;
  requestType:
    | 'user_request'
    | 'gdpr_request'
    | 'policy_expiration'
    | 'legal_hold_release';
  entityType: EntityType;
  entityId: string;
  requestedBy: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduledAt: Date;
  processedAt?: Date;
  filesDeleted: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface RetentionService {
  // Policy management
  createRetentionPolicy(
    policy: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RetentionPolicy>;
  updateRetentionPolicy(
    id: string,
    updates: Partial<RetentionPolicy>
  ): Promise<RetentionPolicy>;
  deleteRetentionPolicy(id: string): Promise<boolean>;
  getRetentionPolicy(id: string): Promise<RetentionPolicy | null>;
  listRetentionPolicies(entityType?: EntityType): Promise<RetentionPolicy[]>;

  // Legal holds
  createLegalHold(
    hold: Omit<LegalHold, 'id' | 'createdAt'>
  ): Promise<LegalHold>;
  releaseLegalHold(id: string): Promise<boolean>;
  getLegalHold(id: string): Promise<LegalHold | null>;
  listActiveLegalHolds(): Promise<LegalHold[]>;

  // Data deletion requests
  requestDataDeletion(
    request: Omit<DataDeletionRequest, 'id' | 'status' | 'filesDeleted'>
  ): Promise<DataDeletionRequest>;
  processDataDeletionRequest(id: string): Promise<DataDeletionRequest>;
  getDataDeletionRequest(id: string): Promise<DataDeletionRequest | null>;
  listDataDeletionRequests(status?: string): Promise<DataDeletionRequest[]>;

  // Cleanup operations
  identifyExpiredFiles(): Promise<string[]>;
  cleanupExpiredFiles(): Promise<{ deleted: number; errors: string[] }>;
  anonymizeUserData(
    userId: string
  ): Promise<{ anonymized: number; errors: string[] }>;

  // Compliance reporting
  generateRetentionReport(
    startDate: Date,
    endDate: Date
  ): Promise<RetentionReport>;
  auditFileRetention(fileId: string): Promise<FileRetentionAudit>;
}

export interface RetentionReport {
  period: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalFiles: number;
    expiredFiles: number;
    deletedFiles: number;
    heldFiles: number;
    anonymizedFiles: number;
  };
  byEntityType: Record<
    EntityType,
    {
      totalFiles: number;
      expiredFiles: number;
      deletedFiles: number;
    }
  >;
  legalHolds: {
    active: number;
    released: number;
  };
  deletionRequests: {
    pending: number;
    processed: number;
    failed: number;
  };
}

export interface FileRetentionAudit {
  fileId: string;
  currentStatus: string;
  retentionPolicy?: RetentionPolicy;
  expirationDate?: Date;
  legalHolds: LegalHold[];
  deletionRequests: DataDeletionRequest[];
  complianceStatus: 'compliant' | 'expired' | 'held' | 'pending_deletion';
  recommendations: string[];
}
