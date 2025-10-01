-- Multi-sided Platform Database Initialization
-- Creates all required databases for the platform

-- Auth Database
CREATE DATABASE auth_db;
\c auth_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ecommerce Database  
CREATE DATABASE ecommerce_db;
\c ecommerce_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Taxi Database
CREATE DATABASE taxi_db;
\c taxi_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial queries

-- Hotel Database
CREATE DATABASE hotel_db;
\c hotel_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For location-based search

-- Payment Database
CREATE DATABASE payment_db;
\c payment_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Notification Database
CREATE DATABASE notification_db;
\c notification_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Upload Database
CREATE DATABASE upload_db;
\c upload_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Upload Test Database
CREATE DATABASE upload_test_db;
\c upload_test_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- File Database
CREATE DATABASE file_db;
\c file_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Analytics Database
CREATE DATABASE analytics_db;
\c analytics_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Database
CREATE DATABASE admin_db;
\c admin_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Messaging Database
CREATE DATABASE messaging_db;
\c messaging_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ads Database
CREATE DATABASE ads_db;
\c ads_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions to platform user
GRANT ALL PRIVILEGES ON DATABASE auth_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE taxi_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE hotel_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE upload_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE upload_test_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE file_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE analytics_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE admin_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE messaging_db TO platform_user;
GRANT ALL PRIVILEGES ON DATABASE ads_db TO platform_user;