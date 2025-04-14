-- CreateEnum
CREATE TYPE "WaitStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "WaitList" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "showID" TEXT NOT NULL,
    "status" "WaitStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WaitList" ADD CONSTRAINT "WaitList_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitList" ADD CONSTRAINT "WaitList_showID_fkey" FOREIGN KEY ("showID") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
