/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaperToAuthor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PaperToAuthor" DROP CONSTRAINT "_PaperToAuthor_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaperToAuthor" DROP CONSTRAINT "_PaperToAuthor_B_fkey";

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "Paper";

-- DropTable
DROP TABLE "_PaperToAuthor";

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "showID" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "seat" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Show" (
    "id" TEXT NOT NULL,
    "beginTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "movieID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_showID_fkey" FOREIGN KEY ("showID") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
