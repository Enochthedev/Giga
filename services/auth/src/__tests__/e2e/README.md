# End-to-End Tests for Authentication Service

This directory contains comprehensive end-to-end tests for the authentication service, covering all
major workflows and security features.

## Test Files

### 1. `user-registration-flow.e2e.test.ts`

Tests the complete user registration workflow including:

- Standard user registration with default CUSTOMER role
- Multi-role user registration
- Email verification process
- Phone verification process
- Input validation and sanitization
- Error handling and edge cases
- Performance under load

### 2. `multi-role-scenarios.e2e.test.ts`

Tests multi-role user functionality including:

- Role switching between assigned roles
- Role-specific profile management
- Role assignment and removal
- Role-based permissions and access control
- Profile data persistence across role switches
- Concurrent role operations

### 3. `password-management.e2e.test.ts`

Tests password-related workflows including:

- Password change with current password validation
- Password reset via email workflow
- Password strength validation
- Password history and reuse prevention
- Token invalidation after password changes
- Rate limiting for password operations

### 4. `admin-user-management.e2e.test.ts`

Tests administrative user management features including:

- User listing with pagination and filtering
- Individual user management (view, update status)
- Role assignment and removal by admins
- Bulk operations (status updates, role assignments)
- User activity tracking and audit trails
- Admin access control and permissions

### 5. `security-rate-limiting.e2e.test.ts`

Tests security features and rate limiting including:

- Authentication rate limiting (login, registration, password reset)
- Account lockout protection after failed attempts
- Input validation and XSS prevention
- SQL injection protection
- JWT token security and validation
- CORS and security headers
- Session security and hijacking prevention
- Performance under attack conditions

## Test Setup

### Prerequisites

- PostgreSQL test database
- Redis test instance
- Environment variables configured for testing

### Running Tests

```bash
# Run all E2E tests
npm run test -- src/__tests__/e2e/

# Run specific test file
npm run test -- src/__tests__/e2e/user-registration-flow.e2e.test.ts

# Run with coverage
npm run test -- --coverage src/__tests__/e2e/

# Run in watch mode
npm run test -- --watch src/__tests__/e2e/
```

### Test Configuration

Tests use the following configuration:

- **Test timeout**: 15 seconds per test
- **Setup timeout**: 15 seconds for beforeAll/afterAll hooks
- **Database**: Separate test database with automatic cleanup
- **Redis**: Test Redis instance with automatic cleanup
- **Mocks**: External services (email, SMS) are mocked

## Test Data Management

### Test Data Factory

The `TestDataFactory` class provides utilities for creating test data:

- `createTestUser()` - Creates a user with default CUSTOMER role
- `createMultiRoleUser()` - Creates a user with multiple roles
- `createAdminUser()` - Creates a user with ADMIN role
- `createRefreshToken()` - Creates refresh tokens for testing
- `generateJWT()` - Generates valid JWT tokens
- `generateExpiredJWT()` - Generates expired JWT tokens

### Data Cleanup

Each test automatically cleans up data:

- **Before each test**: Removes all test data from database and Redis
- **After all tests**: Disconnects from database and Redis
- **Isolation**: Each test runs with a clean slate

## Mocking Strategy

### External Services

- **Email Service**: Mocked to prevent actual email sending
- **SMS Service**: Mocked to prevent actual SMS sending
- **Redis**: Uses test Redis instance with automatic cleanup

### Time-based Operations

- Uses `vi.useFakeTimers()` for testing time-dependent features
- Advances time with `vi.advanceTimersByTime()` for rate limiting tests

## Coverage Requirements

E2E tests should cover:

- ✅ All user registration flows
- ✅ Complete authentication workflows
- ✅ Multi-role user scenarios
- ✅ Password management operations
- ✅ Admin user management features
- ✅ Security and rate limiting features
- ✅ Error handling and edge cases
- ✅ Performance under load

## Best Practices

### Test Structure

1. **Arrange**: Set up test data and conditions
2. **Act**: Execute the operation being tested
3. **Assert**: Verify the expected outcomes

### Assertions

- Use specific assertions for better error messages
- Test both success and failure scenarios
- Verify database state changes
- Check response structure and content

### Performance

- Tests should complete within reasonable time limits
- Use concurrent operations where appropriate
- Clean up resources properly to prevent memory leaks

### Security

- Test with malicious inputs (XSS, SQL injection)
- Verify rate limiting and account lockout
- Test token security and validation
- Check CORS and security headers

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database is running
   - Check DATABASE_URL environment variable
   - Verify database permissions

2. **Redis Connection Errors**
   - Ensure Redis test instance is running
   - Check REDIS_URL environment variable
   - Verify Redis configuration

3. **Test Timeouts**
   - Increase test timeout in vitest.config.ts
   - Check for hanging promises or connections
   - Ensure proper cleanup in afterEach/afterAll

4. **Rate Limiting Issues**
   - Tests may interfere with each other if not properly isolated
   - Ensure Redis cleanup between tests
   - Use different test data for each test

### Debugging

```bash
# Run tests with debug output
DEBUG=* npm run test -- src/__tests__/e2e/

# Run single test with verbose output
npm run test -- --reporter=verbose src/__tests__/e2e/user-registration-flow.e2e.test.ts

# Run tests with coverage and open report
npm run test -- --coverage --coverage.reporter=html src/__tests__/e2e/
```

## Contributing

When adding new E2E tests:

1. Follow the existing test structure and naming conventions
2. Use the TestDataFactory for creating test data
3. Ensure proper cleanup in beforeEach/afterEach hooks
4. Add comprehensive assertions for all scenarios
5. Test both success and failure cases
6. Update this README if adding new test categories
7. Ensure tests are deterministic and don't depend on external state
