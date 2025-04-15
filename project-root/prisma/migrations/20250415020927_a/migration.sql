/*
  Warnings:

  - You are about to drop the column `type` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `length` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "type",
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL;
