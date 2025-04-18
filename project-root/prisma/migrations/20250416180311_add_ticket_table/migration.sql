/*
  Warnings:

  - You are about to drop the column `price` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `seat` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `showID` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `seatCol` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatRow` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_showID_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "price",
DROP COLUMN "seat",
DROP COLUMN "showID",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "seatCol" INTEGER NOT NULL,
ADD COLUMN     "seatRow" TEXT NOT NULL,
ADD COLUMN     "showId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'VALID',
ALTER COLUMN "qrCode" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
