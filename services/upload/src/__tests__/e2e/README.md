# End-to-End Tests

This directory contains comprehensive end-to-end tests for the Upload Service that test complete
workflows from start to finish.

## Test Categories

### Complete Upload Workflows

- **upload-workflows.e2e.test.ts**: Tests complete upload workflows for different file types and
  contexts
- **image-processing-workflows.e2e.test.ts**: Tests end-to-end image processing workflows
- **multi-file-workflows.e2e.test.ts**: Tests batch upload and multi-file operations

### Multi-Service Integration

- **service-integration.e2e.test.ts**: Tests integration with other platform services
- **auth-integration.e2e.test.ts**: Tests authentication and authorization workflows
- **notification-integration.e2e.test.ts**: Tests notification service integration

### Performance and Scalability

- **performance-scalability.e2e.test.ts**: Tests system performance under various loads
- **concurrent-operations.e2e.test.ts**: Tests concurrent upload operations
- **large-file-handling.e2e.test.ts**: Tests handling of large files

### Error Handling and Recovery

- **error-recovery.e2e.test.ts**: Tests error handling and recovery scenarios
- **failure-scenarios.e2e.test.ts**: Tests various failure scenarios and system resilience
- **data-consistency.e2e.test.ts**: Tests data consistency during failures

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test suite
npm run test -- services/upload/src/__tests__/e2e/upload-workflows.e2e.test.ts

# Run E2E tests with coverage
npm run test:coverage -- --testPathPattern=e2e
```

## Test Environment

E2E tests use a dedicated test environment that:

- Starts a real server instance
- Uses test databases and storage
- Mocks external services when needed
- Cleans up after each test suite
