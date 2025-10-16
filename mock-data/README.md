# Mock Data for Multi-Sided Platform

This directory contains sample data for testing and development purposes. Each service has its own
mock data files with realistic examples.

## 📁 Structure

```
mock-data/
├── auth/           # Authentication & user data
├── ecommerce/      # Products, orders, vendors
├── taxi/           # Rides, drivers, locations
├── hotel/          # Properties, bookings, hosts
├── payment/        # Payments, payouts, methods
├── ads/            # Campaigns, creatives
└── shared/         # Common data (addresses, etc.)
```

## 🎯 Usage

### For Development

```bash
# Import mock data into your service
import { mockUsers } from '../../../mock-data/auth/users.json';
import { mockProducts } from '../../../mock-data/ecommerce/products.json';
```

### For Testing

```bash
# Use in your test files
const testUser = require('../../../mock-data/auth/test-users.json')[0];
```

### For API Documentation

All mock data examples are used in Swagger documentation to show expected request/response formats.

## 🔧 Guidelines

1. **Realistic Data**: Use realistic names, addresses, prices
2. **Consistent IDs**: Use consistent ID formats across services
3. **Privacy**: No real personal information
4. **Relationships**: Maintain proper foreign key relationships
5. **Variety**: Include edge cases and different scenarios

## 📝 File Naming Convention

- `{entity}.json` - Main entity data (e.g., `users.json`, `products.json`)
- `test-{entity}.json` - Specific test cases
- `{scenario}-{entity}.json` - Specific scenarios (e.g., `new-vendor.json`)
