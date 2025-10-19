/*
  Warnings:

  - You are about to drop the column `address` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `street` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'DOMESTIC_PARTNERSHIP', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('UNDER_18', 'AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_54', 'AGE_55_64', 'AGE_65_PLUS', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "HostType" AS ENUM ('INDIVIDUAL', 'BUSINESS');

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "address",
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "buildingNumber" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT;

-- AlterTable
ALTER TABLE "advertiser_profiles" ADD COLUMN     "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "totalCampaigns" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "customer_profiles" ADD COLUMN     "company" TEXT,
ADD COLUMN     "emergencyContact" JSONB,
ADD COLUMN     "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "medicalInfo" JSONB,
ADD COLUMN     "membershipTier" TEXT NOT NULL DEFAULT 'BRONZE',
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "socialMedia" JSONB,
ADD COLUMN     "totalOrders" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "host_profiles" ADD COLUMN     "hostType" "HostType" NOT NULL DEFAULT 'INDIVIDUAL';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ageGroup" "AgeGroup",
ADD COLUMN     "areasOfInterest" TEXT[],
ADD COLUMN     "bodyWeight" DOUBLE PRECISION,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "maritalStatus" "MaritalStatus",
ADD COLUMN     "profilePicture" TEXT;
