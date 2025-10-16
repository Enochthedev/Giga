# Advanced Admin User Management Features

This document describes the advanced user administration features implemented in the auth service.

## Features Overview

### 1. Bulk User Operations

- **Endpoint**: `POST /api/v1/users/bulk-update`
- **Description**: Perform bulk operations on multiple users simultaneously
- **Supported Actions**:
  - `activate`: Activate multiple users
  - `deactivate`: Deactivate multiple users
  - `verify_email`: Mark emails as verified
  - `verify_phone`: Mark phone numbers as verified
  - `update_fields`: Update custom fields with provided data

**Example Request**:

```json
{
  "userIds": ["user1", "user2", "user3"],
  "action": "activate"
}
```

**Example Custom Fields Update**:

```json
{
  "userIds": ["user1", "user2"],
  "action": "update_fields",
  "data": {
    "isEmailVerified": true,
    "isPhoneVerified": true
  }
}
```

### 2. Advanced User Filtering and Search

- **Endpoint**: `GET /api/v1/users`
- **Description**: Enhanced user listing with comprehensive filtering options

**Available Filters**:

- `search`: Search by name, email, or phone
- `role`: Filter by user role
- `status`: Filter by active/inactive status
- `emailVerified`: Filter by email verification status
- `phoneVerified`: Filter by phone verification status
- `sortBy`: Sort by field (createdAt, updatedAt, email, firstName, lastName)
- `sortOrder`: Sort direction (asc/desc)
- `createdAfter`/`createdBefore`: Date range filtering
- `lastLoginAfter`/`lastLoginBefore`: Login date filtering

**Example Request**:

```
GET /api/v1/users?search=john&role=VENDOR&emailVerified=true&sortBy=createdAt&sortOrder=desc
```

### 3. User Activity Logging and Audit Trails

- **Endpoint**: `GET /api/v1/users/{id}/activity`
- **Description**: View detailed activity logs for a specific user
- **Features**:
  - Complete audit trail of admin actions
  - IP address and user agent tracking
  - Filterable by action type
  - Paginated results

**Example Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "lastLoginAt": "2024-01-15T10:30:00Z"
    },
    "activity": {
      "auditLogs": [
        {
          "id": "log123",
          "action": "UPDATE_USER_STATUS",
          "details": {
            "previousStatus": false,
            "newStatus": true
          },
          "performedBy": {
            "id": "admin123",
            "email": "admin@example.com",
            "name": "Admin User"
          },
          "ipAddress": "192.168.1.1",
          "createdAt": "2024-01-15T09:00:00Z"
        }
      ]
    }
  }
}
```

### 4. System Audit Logs

- **Endpoint**: `GET /api/v1/users/audit-logs`
- **Description**: View system-wide audit logs with comprehensive filtering

**Available Filters**:

- `action`: Filter by action type
- `adminUserId`: Filter by admin who performed the action
- `targetUserId`: Filter by target user
- `startDate`/`endDate`: Date range filtering
- `ipAddress`: Filter by IP address

### 5. Role Assignment and Management

- **Assign Role**: `POST /api/v1/users/{id}/roles`
- **Remove Role**: `DELETE /api/v1/users/{id}/roles`
- **Features**:
  - Automatic profile creation for new roles
  - Prevents removal of CUSTOMER role (default)
  - Prevents duplicate role assignments
  - Full audit logging

**Example Role Assignment**:

```json
{
  "role": "VENDOR"
}
```

### 6. Data Export and Reporting

#### User Export

- **Endpoint**: `GET /api/v1/users/export`
- **Formats**: JSON, CSV
- **Features**:
  - Filterable exports
  - Up to 10,000 users per export
  - Comprehensive user data

**Example CSV Export**:

```
GET /api/v1/users/export?format=csv&filters={"status":"active"}
```

#### Audit Reports

- **Endpoint**: `GET /api/v1/users/audit-report`
- **Formats**: JSON, CSV
- **Features**:
  - Date range reports
  - Action breakdown statistics
  - Admin activity analysis
  - Daily activity trends

**Example Report Request**:

```
GET /api/v1/users/audit-report?startDate=2024-01-01&endDate=2024-01-31&format=json
```

#### User Statistics

- **Endpoint**: `GET /api/v1/users/stats`
- **Features**:
  - Total user counts
  - Verification rates
  - Role distribution
  - Registration trends

**Example Statistics Response**:

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalUsers": 1250,
      "activeUsers": 1100,
      "verifiedEmailUsers": 950,
      "verificationRates": {
        "email": "76.00",
        "phone": "45.60"
      }
    },
    "roleDistribution": [
      { "role": "CUSTOMER", "count": 800 },
      { "role": "VENDOR", "count": 300 },
      { "role": "DRIVER", "count": 100 }
    ],
    "registrationTrends": {
      "last30Days": [
        { "date": "2024-01-01", "registrations": 25 },
        { "date": "2024-01-02", "registrations": 30 }
      ]
    }
  }
}
```

## Security Features

### Audit Logging

All admin actions are automatically logged with:

- Action type and details
- Admin user information
- Target user (if applicable)
- IP address and user agent
- Timestamp
- Request details

### Access Control

- All endpoints require ADMIN role
- JWT token authentication
- Rate limiting protection
- Input validation and sanitization

### Data Protection

- Sensitive data filtering in exports
- Audit log retention policies
- Secure data transmission
- Input validation against injection attacks

## Database Schema

### AuditLog Model

```prisma
model AuditLog {
  id           String   @id @default(cuid())
  action       String   // Action performed
  adminUserId  String   // Admin who performed action
  targetUserId String?  // Target user (if applicable)
  details      Json     // Action details
  ipAddress    String?  // IP address
  userAgent    String?  // User agent
  createdAt    DateTime @default(now())

  adminUser    User     @relation("AdminAuditLogs", fields: [adminUserId], references: [id])
  targetUser   User?    @relation("TargetAuditLogs", fields: [targetUserId], references: [id])
}
```

## Usage Examples

### Bulk User Management

```bash
# Activate multiple users
curl -X POST /api/v1/users/bulk-update \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user1", "user2", "user3"],
    "action": "activate"
  }'

# Bulk verify emails
curl -X POST /api/v1/users/bulk-update \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user1", "user2"],
    "action": "verify_email"
  }'
```

### Advanced Search

```bash
# Search for vendors with verified emails
curl -G /api/v1/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "role=VENDOR" \
  -d "emailVerified=true" \
  -d "sortBy=createdAt" \
  -d "sortOrder=desc"
```

### Export Data

```bash
# Export active users as CSV
curl -G /api/v1/users/export \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "format=csv" \
  -d 'filters={"status":"active"}' \
  -o users_export.csv
```

### Generate Reports

```bash
# Generate monthly audit report
curl -G /api/v1/users/audit-report \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "startDate=2024-01-01T00:00:00Z" \
  -d "endDate=2024-01-31T23:59:59Z" \
  -d "format=json"
```

## Performance Considerations

- Bulk operations are limited to 100 users per request
- Exports are capped at 10,000 users
- Pagination is enforced (max 100 per page)
- Database indexes on audit log fields for fast queries
- Efficient filtering with proper WHERE clauses

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Common error codes:

- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Missing or invalid token
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `REQUEST_TOO_LARGE`: Bulk operation too large
