-- CreateEnum
CREATE TYPE "ShowStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "status" "ShowStatus" NOT NULL DEFAULT 'DRAFT';
