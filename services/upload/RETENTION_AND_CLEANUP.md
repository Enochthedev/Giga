# Data Retention and Cleanup System

This document describes the comprehensive data retention and cleanup system implemented for the
Upload Service, including GDPR compliance features.

## Overview

The retention and cleanup system provides:

- **Retention Policy Management**: Define and manage data retention policies by entity type and
  jurisdiction
- **Legal Hold Management**: Create and manage legal holds to prevent data deletion during
  investigations
- **Automated Cleanup**: Scheduled cleanup of expired files, orphaned data, and temporary files
- **GDPR Compliance**: Full support for GDPR rights including access, rectification, erasure,
  portability, and restriction
- **Audit Trail**: Complete audit logging of all retention and compliance activities
- **Compliance Reporting**: Generate comprehensive reports for compliance audits

## Features

### 1. Retention Policy Management

#### Create Retention Policy

```typescript
POST /api/v1/retention/policies
{
  "name": "User Profile Policy",
  "entityType": "USER_PROFILE",
  "retentionPeriodDays": 365,
  "jurisdiction": "EU",
  "description": "GDPR compliant user profile retention",
  "legalBasis": "GDPR Article 6(1)(b)"
}
```

#### List Retention Policies

```typescript
GET /api/v1/retention/policies?entityType=USER_PROFILE
```

#### Update Retention Policy

```typescript
PUT /api/v1/retention/policies/{id}
{
  "retentionPeriodDays": 730,
  "description": "Updated retention period"
}
```

### 2. Legal Hold Management

#### Create Legal Hold

```typescript
POST /api/v1/retention/legal-holds
{
  "name": "Investigation Hold",
  "description": "Legal investigation in progress",
  "entityType": "USER_PROFILE",
  "entityIds": ["user-123"],
  "fileIds": ["file-456"],
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

#### Release Legal Hold

```typescript
POST / api / v1 / retention / legal - holds / { id } / release;
```

### 3. Data Deletion Requests

#### Request Data Deletion

```typescript
POST /api/v1/retention/deletion-requests
{
  "requestType": "user_request",
  "entityType": "USER_PROFILE",
  "entityId": "user-123",
  "scheduledAt": "2024-01-01T00:00:00Z"
}
```

#### Process Deletion Request

```typescript
POST / api / v1 / retention / deletion - requests / { id } / process;
```

### 4. Cleanup Operations

#### Identify Expired Files

```typescript
GET / api / v1 / retention / expired - files;
```

#### Cleanup Expired Files

```typescript
POST / api / v1 / retention / cleanup / expired - files;
```

#### Anonymize User Data

```typescript
POST / api / v1 / retention / cleanup / anonymize / { userId };
```

### 5. GDPR Compliance

#### Right to Access (Article 15)

```typescript
POST /api/v1/retention/gdpr/access
{
  "userId": "user-123",
  "userEmail": "user@example.com"
}
```

#### Right to Erasure (Article 17)

```typescript
POST /api/v1/retention/gdpr/erasure
{
  "userId": "user-123",
  "userEmail": "user@example.com",
  "reason": "User requested account deletion"
}
```

#### Right to Data Portability (Article 20)

```typescript
POST /api/v1/retention/gdpr/portability
{
  "userId": "user-123",
  "userEmail": "user@example.com"
}
```

#### Right to Restriction (Article 18)

```typescript
POST /api/v1/retention/gdpr/restriction
{
  "userId": "user-123",
  "userEmail": "user@example.com",
  "reason": "Disputing data accuracy"
}
```

### 6. Compliance Reporting

#### Generate Retention Report

```typescript
GET /api/v1/retention/reports/retention?startDate=2024-01-01&endDate=2024-12-31
```

#### Audit File Retention

```typescript
GET / api / v1 / retention / audit / files / { fileId };
```

#### Generate Privacy Report

```typescript
GET / api / v1 / retention / gdpr / privacy - report / { userId };
```

## Database Schema

### Retention Policies

```sql
CREATE TABLE retention_policies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  entity_type entity_type NOT NULL,
  retention_period_days INTEGER NOT NULL,
  jurisdiction TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  legal_basis TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Legal Holds

```sql
CREATE TABLE legal_holds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  entity_type entity_type,
  entity_ids TEXT[],
  file_ids TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP
);
```

### Data Deletion Requests

```sql
CREATE TABLE data_deletion_requests (
  id TEXT PRIMARY KEY,
  request_type data_deletion_request_type NOT NULL,
  entity_type entity_type NOT NULL,
  entity_id TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  status deletion_request_status DEFAULT 'PENDING',
  scheduled_at TIMESTAMP NOT NULL,
  processed_at TIMESTAMP,
  files_deleted INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Retention Audit Log

```sql
CREATE TABLE retention_audit_logs (
  id TEXT PRIMARY KEY,
  file_id TEXT,
  entity_type entity_type,
  entity_id TEXT,
  action retention_audit_action NOT NULL,
  details JSONB NOT NULL,
  performed_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

## Automated Cleanup Jobs

The system includes automated cleanup workers that run on scheduled intervals:

### Cleanup Job Types

1. **Expired Files Cleanup**
   - Schedule: Daily at 2 AM
   - Identifies and deletes files that have exceeded their retention period
   - Respects legal holds and active restrictions

2. **Orphaned Files Cleanup**
   - Schedule: Weekly on Sunday at 3 AM
   - Removes database records for files that no longer exist in storage
   - Removes storage files that have no database records

3. **Temporary Files Cleanup**
   - Schedule: Daily at 1 AM
   - Removes old upload sessions and associated temporary files
   - Default age threshold: 1 day

4. **Failed Uploads Cleanup**
   - Schedule: Weekly on Sunday at 4 AM
   - Removes old failed upload records and associated files
   - Default age threshold: 7 days

### Running Cleanup Jobs Manually

```typescript
import { CleanupWorker } from './workers/cleanup.worker';

const cleanupWorker = new CleanupWorker(prisma, logger, storageManager, metadataService);

// Run expired files cleanup
const result = await cleanupWorker.processCleanupJob({
  type: 'expired_files',
  options: { dryRun: false, batchSize: 100 },
});

// Run in dry-run mode to see what would be deleted
const dryRunResult = await cleanupWorker.processCleanupJob({
  type: 'expired_files',
  options: { dryRun: true },
});
```

## GDPR Compliance Features

### Data Subject Rights

The system implements all GDPR data subject rights:

1. **Right to Access (Article 15)**
   - Provides complete data export for a user
   - Includes files, access logs, and upload sessions
   - Returns structured JSON response

2. **Right to Rectification (Article 16)**
   - Allows correction of file metadata
   - Maintains audit trail of changes
   - Supports bulk corrections

3. **Right to Erasure (Article 17)**
   - Deletes all user data and associated files
   - Respects legal holds and legitimate interests
   - Provides deletion confirmation

4. **Right to Data Portability (Article 20)**
   - Exports user data in structured format
   - Includes download URLs for files
   - Provides metadata and statistics

5. **Right to Restriction (Article 18)**
   - Creates legal hold to restrict processing
   - Prevents deletion and modification
   - Maintains processing logs

### Consent Management

```typescript
// Record consent
await gdprService.recordConsent({
  userId: 'user-123',
  purpose: 'Profile photo processing',
  legalBasis: 'consent',
  consentGiven: true,
  processingActivities: ['image_processing', 'storage'],
  dataCategories: ['profile_images'],
});

// Withdraw consent
await gdprService.withdrawConsent('user-123', 'Profile photo processing');
```

### Privacy Impact Assessment

```typescript
// Generate privacy report for user
const report = await gdprService.generatePrivacyReport('user-123');

console.log(report);
// {
//   userId: 'user-123',
//   generatedAt: '2024-01-01T00:00:00Z',
//   dataProcessing: {
//     totalFiles: 10,
//     activeFiles: 8,
//     deletedFiles: 2,
//     totalStorageUsed: 1048576
//   },
//   accessActivity: {
//     totalAccesses: 25,
//     recentAccesses: [...],
//     lastAccess: '2024-01-01T12:00:00Z'
//   },
//   compliance: {
//     retentionStatus: 'compliant',
//     legalHolds: 0,
//     recommendations: []
//   }
// }
```

## Configuration

### Environment Variables

```bash
# Retention settings
RETENTION_DEFAULT_PERIOD_DAYS=365
RETENTION_CLEANUP_BATCH_SIZE=100
RETENTION_AUDIT_RETENTION_DAYS=2555  # 7 years

# GDPR settings
GDPR_RESPONSE_TIMEOUT_DAYS=30
GDPR_DELETION_GRACE_PERIOD_DAYS=7

# Cleanup job settings
CLEANUP_EXPIRED_FILES_CRON="0 2 * * *"
CLEANUP_ORPHANED_FILES_CRON="0 3 * * 0"
CLEANUP_TEMP_FILES_CRON="0 1 * * *"
CLEANUP_FAILED_UPLOADS_CRON="0 4 * * 0"
```

### Default Retention Policies

The system comes with default retention policies for different entity types:

```typescript
const defaultPolicies = [
  {
    name: 'User Profile Files',
    entityType: 'USER_PROFILE',
    retentionPeriodDays: 365,
    jurisdiction: 'EU',
    legalBasis: 'GDPR Article 6(1)(b)',
  },
  {
    name: 'Product Images',
    entityType: 'PRODUCT',
    retentionPeriodDays: 2555, // 7 years
    jurisdiction: 'US',
    legalBasis: 'Business records retention',
  },
  {
    name: 'Property Photos',
    entityType: 'PROPERTY',
    retentionPeriodDays: 1825, // 5 years
    jurisdiction: 'EU',
    legalBasis: 'Contract performance',
  },
];
```

## Monitoring and Alerting

### Metrics

The system exposes the following metrics:

- `retention_policies_total`: Total number of retention policies
- `legal_holds_active`: Number of active legal holds
- `deletion_requests_pending`: Number of pending deletion requests
- `files_expired_total`: Total number of expired files
- `cleanup_jobs_completed`: Number of completed cleanup jobs
- `gdpr_requests_processed`: Number of processed GDPR requests

### Health Checks

```typescript
GET /health
{
  "status": "healthy",
  "services": {
    "retention": {
      "status": "healthy",
      "expiredFiles": 0,
      "pendingDeletions": 2,
      "activeLegalHolds": 1
    }
  }
}
```

### Alerts

Configure alerts for:

- High number of expired files
- Failed cleanup jobs
- Pending GDPR requests exceeding SLA
- Legal holds approaching expiration
- Storage quota violations

## Security Considerations

1. **Access Control**: All retention endpoints require authentication and appropriate permissions
2. **Audit Logging**: All operations are logged with user context and timestamps
3. **Data Encryption**: Sensitive data in audit logs is encrypted at rest
4. **Legal Hold Protection**: Files under legal hold cannot be deleted or modified
5. **Secure Deletion**: Files are securely deleted from storage and cannot be recovered

## Testing

### Unit Tests

```bash
npm test -- --run src/__tests__/services/retention.service.test.ts
npm test -- --run src/__tests__/services/gdpr-compliance.service.test.ts
npm test -- --run src/__tests__/workers/cleanup.worker.test.ts
```

### Integration Tests

```bash
npm test -- --run src/__tests__/integration/retention.integration.test.ts
```

### Performance Tests

```bash
npm test -- --run src/__tests__/performance/retention.performance.test.ts
```

## Troubleshooting

### Common Issues

1. **Files not being deleted**
   - Check for active legal holds
   - Verify retention policy configuration
   - Check cleanup job logs

2. **GDPR requests timing out**
   - Check database performance
   - Verify storage connectivity
   - Review batch size configuration

3. **High storage usage**
   - Run expired files cleanup
   - Check for orphaned files
   - Review retention policies

### Debug Commands

```bash
# Check expired files
curl -X GET "http://localhost:3000/api/v1/retention/expired-files"

# Generate retention report
curl -X GET "http://localhost:3000/api/v1/retention/reports/retention?startDate=2024-01-01&endDate=2024-12-31"

# Check legal holds
curl -X GET "http://localhost:3000/api/v1/retention/legal-holds"
```

## Compliance Checklist

- [ ] Retention policies defined for all entity types
- [ ] Legal hold procedures documented and tested
- [ ] GDPR request handling procedures in place
- [ ] Automated cleanup jobs scheduled and monitored
- [ ] Audit logging enabled and retained appropriately
- [ ] Data breach response procedures include retention system
- [ ] Staff trained on retention and compliance procedures
- [ ] Regular compliance audits scheduled
- [ ] Data protection impact assessments completed
- [ ] Cross-border data transfer agreements in place

## Support

For issues or questions regarding the retention and cleanup system:

1. Check the troubleshooting section above
2. Review the audit logs for error details
3. Contact the development team with specific error messages
4. For compliance questions, consult with the legal team

## Changelog

### Version 1.0.0

- Initial implementation of retention policy management
- Legal hold functionality
- GDPR compliance features
- Automated cleanup workers
- Comprehensive audit logging
- Integration with existing upload service
