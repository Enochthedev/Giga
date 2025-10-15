# Ecommerce Service Quick Start

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd services/ecommerce
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database configuration
# DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed database with sample data
pnpm db:seed
```

### 4. Start the Service

```bash
# Development mode
pnpm dev

# Production mode
pnpm build && pnpm start
```

## 📚 API Documentation

Once running, access the Swagger UI at: **http://localhost:3005/docs**

## 🛠️ Troubleshooting

### Foreign Key Constraint Error

If you get a `products_vendorId_fkey` error when seeding:

1. **Make sure vendors are created first** - The seed script now handles this automatically
2. **Use the simple seed script**: `pnpm db:seed` (uses `seed-simple.ts`)
3. **Alternative seed options**:
   - `pnpm db:seed-original` - Uses original seed with mock data
   - `pnpm db:seed-comprehensive` - Uses comprehensive seed data

### Database Issues

```bash
# Reset database if needed
pnpm db:push --force-reset

# Then re-seed
pnpm db:seed
```

## ✅ Verification

Test that everything is working:

```bash
# Health check
curl http://localhost:3005/health

# Get products
curl http://localhost:3005/api/v1/products

# Swagger UI
open http://localhost:3005/docs
```

## 🎯 Key Features

- **Product Management**: Full CRUD with variants and inventory
- **Promotions**: Discount codes and promotional campaigns
- **Shipping**: Shipping rates and delivery tracking
- **Inventory**: Stock management and reservations
- **Swagger Documentation**: Complete API documentation

The service is now ready for development! 🚀
