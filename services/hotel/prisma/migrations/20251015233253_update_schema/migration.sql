/*
  Warnings:

  - You are about to drop the column `rate` on the `booked_rooms` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationPolicy` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `pricing` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `primaryGuest` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `rooms` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `bookingHistory` on the `guest_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `communicationPreferences` on the `guest_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `contactInfo` on the `guest_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginDate` on the `guest_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `loyaltyStatus` on the `guest_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `personalInfo` on the `guest_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `guest_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `vipStatus` on the `guest_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `usage` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the `inventory_locks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_reservations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `properties` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nights` to the `booked_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratePerNight` to the `booked_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `booked_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `booked_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `booked_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestEmail` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestName` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestPhone` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricingDetails` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amenityPreferences` to the `guest_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `guest_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `guest_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `guest_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomPreferences` to the `guest_profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `loyaltyPoints` on table `guest_profiles` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `checkInTime` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutTime` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAdults` to the `room_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxChildren` to the `room_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bookings_propertyId_idx";

-- DropIndex
DROP INDEX "guest_activity_logs_guestId_idx";

-- DropIndex
DROP INDEX "guest_activity_logs_timestamp_idx";

-- DropIndex
DROP INDEX "inventory_records_propertyId_roomTypeId_idx";

-- DropIndex
DROP INDEX "properties_status_idx";

-- DropIndex
DROP INDEX "rate_records_propertyId_roomTypeId_idx";

-- DropIndex
DROP INDEX "room_types_isActive_idx";

-- AlterTable
ALTER TABLE "booked_rooms" DROP COLUMN "rate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nights" INTEGER NOT NULL,
ADD COLUMN     "ratePerNight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "taxAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "cancellationPolicy",
DROP COLUMN "pricing",
DROP COLUMN "primaryGuest",
DROP COLUMN "rooms",
ADD COLUMN     "actualCheckInTime" TIMESTAMP(3),
ADD COLUMN     "actualCheckOutTime" TIMESTAMP(3),
ADD COLUMN     "cancellationDeadline" TIMESTAMP(3),
ADD COLUMN     "cancellationPolicyId" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "guestEmail" TEXT NOT NULL,
ADD COLUMN     "guestName" TEXT NOT NULL,
ADD COLUMN     "guestPhone" TEXT NOT NULL,
ADD COLUMN     "guestProfileId" TEXT,
ADD COLUMN     "pricingDetails" JSONB NOT NULL,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "taxAmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "guest_activity_logs" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "guest_profiles" DROP COLUMN "bookingHistory",
DROP COLUMN "communicationPreferences",
DROP COLUMN "contactInfo",
DROP COLUMN "lastLoginDate",
DROP COLUMN "loyaltyStatus",
DROP COLUMN "personalInfo",
DROP COLUMN "preferences",
DROP COLUMN "vipStatus",
ADD COLUMN     "address" JSONB,
ADD COLUMN     "allergies" JSONB,
ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "amenityPreferences" JSONB NOT NULL,
ADD COLUMN     "bookingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isVip" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languagePreference" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "loyaltyTier" TEXT,
ADD COLUMN     "marketingEmails" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "passportNumber" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "roomPreferences" JSONB NOT NULL,
ADD COLUMN     "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vipNotes" TEXT,
ALTER COLUMN "loyaltyPoints" SET NOT NULL;

-- AlterTable
ALTER TABLE "inventory_records" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "promotions" DROP COLUMN "usage",
ADD COLUMN     "perUserLimit" INTEGER,
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageLimit" INTEGER;

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "checkInTime" TEXT NOT NULL,
ADD COLUMN     "checkOutTime" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "rate_records" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "room_types" ADD COLUMN     "maxAdults" INTEGER NOT NULL,
ADD COLUMN     "maxChildren" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "seasonal_rates" ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET DATA TYPE DATE;

-- DropTable
DROP TABLE "inventory_locks";

-- DropTable
DROP TABLE "inventory_reservations";

-- CreateTable
CREATE TABLE "booking_history" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "description" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cancellation_policies" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "refundPercentage" DOUBLE PRECISION NOT NULL,
    "hoursBeforeCheckIn" INTEGER NOT NULL,
    "penaltyType" TEXT NOT NULL,
    "penaltyValue" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cancellation_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_hours" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "hours" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "cleanlinessRating" INTEGER,
    "locationRating" INTEGER,
    "serviceRating" INTEGER,
    "valueRating" INTEGER,
    "amenitiesRating" INTEGER,
    "title" TEXT,
    "comment" TEXT,
    "pros" JSONB,
    "cons" JSONB,
    "propertyResponse" TEXT,
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_history_bookingId_timestamp_idx" ON "booking_history"("bookingId", "timestamp");

-- CreateIndex
CREATE INDEX "cancellation_policies_propertyId_isActive_idx" ON "cancellation_policies"("propertyId", "isActive");

-- CreateIndex
CREATE INDEX "property_hours_propertyId_idx" ON "property_hours"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");

-- CreateIndex
CREATE INDEX "reviews_propertyId_isPublished_idx" ON "reviews"("propertyId", "isPublished");

-- CreateIndex
CREATE INDEX "reviews_guestId_idx" ON "reviews"("guestId");

-- CreateIndex
CREATE INDEX "reviews_overallRating_idx" ON "reviews"("overallRating");

-- CreateIndex
CREATE INDEX "booked_rooms_bookingId_idx" ON "booked_rooms"("bookingId");

-- CreateIndex
CREATE INDEX "booked_rooms_roomTypeId_idx" ON "booked_rooms"("roomTypeId");

-- CreateIndex
CREATE INDEX "bookings_propertyId_checkInDate_status_idx" ON "bookings"("propertyId", "checkInDate", "status");

-- CreateIndex
CREATE INDEX "bookings_propertyId_status_idx" ON "bookings"("propertyId", "status");

-- CreateIndex
CREATE INDEX "bookings_guestProfileId_idx" ON "bookings"("guestProfileId");

-- CreateIndex
CREATE INDEX "dynamic_pricing_rules_propertyId_isActive_idx" ON "dynamic_pricing_rules"("propertyId", "isActive");

-- CreateIndex
CREATE INDEX "group_discounts_propertyId_isActive_idx" ON "group_discounts"("propertyId", "isActive");

-- CreateIndex
CREATE INDEX "guest_activity_logs_guestId_timestamp_idx" ON "guest_activity_logs"("guestId", "timestamp");

-- CreateIndex
CREATE INDEX "guest_activity_logs_activityType_idx" ON "guest_activity_logs"("activityType");

-- CreateIndex
CREATE INDEX "guest_profiles_email_idx" ON "guest_profiles"("email");

-- CreateIndex
CREATE INDEX "inventory_records_propertyId_roomTypeId_date_idx" ON "inventory_records"("propertyId", "roomTypeId", "date");

-- CreateIndex
CREATE INDEX "promotions_propertyId_isActive_idx" ON "promotions"("propertyId", "isActive");

-- CreateIndex
CREATE INDEX "promotions_code_idx" ON "promotions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_status_ownerId_idx" ON "properties"("status", "ownerId");

-- CreateIndex
CREATE INDEX "properties_slug_idx" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "rate_records_propertyId_roomTypeId_date_idx" ON "rate_records"("propertyId", "roomTypeId", "date");

-- CreateIndex
CREATE INDEX "room_types_propertyId_isActive_idx" ON "room_types"("propertyId", "isActive");

-- CreateIndex
CREATE INDEX "seasonal_rates_propertyId_isActive_idx" ON "seasonal_rates"("propertyId", "isActive");

-- CreateIndex
CREATE INDEX "tax_configurations_propertyId_isActive_idx" ON "tax_configurations"("propertyId", "isActive");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guestProfileId_fkey" FOREIGN KEY ("guestProfileId") REFERENCES "guest_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_history" ADD CONSTRAINT "booking_history_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancellation_policies" ADD CONSTRAINT "cancellation_policies_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_configurations" ADD CONSTRAINT "tax_configurations_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_hours" ADD CONSTRAINT "property_hours_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_activity_logs" ADD CONSTRAINT "guest_activity_logs_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guest_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guest_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
