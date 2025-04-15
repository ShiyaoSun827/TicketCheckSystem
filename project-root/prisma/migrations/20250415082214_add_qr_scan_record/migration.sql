-- CreateTable
CREATE TABLE "QRScanRecord" (
    "id" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "scanTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "scannedBy" TEXT NOT NULL,

    CONSTRAINT "QRScanRecord_pkey" PRIMARY KEY ("id")
);
