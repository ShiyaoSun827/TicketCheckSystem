import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { qrCode } = await req.json();

    const ticket = await prisma.ticket.findUnique({
        where: { qrCode },
    });

    if (!ticket) {
        return NextResponse.json({ message: "❌ Invalid QR Code" }, { status: 404 });
    }

    const alreadyScanned = await prisma.qRScanRecord.findFirst({
        where: { qrCode },
    });

    if (alreadyScanned) {
        return NextResponse.json({ message: "⚠️ Already Checked-in" }, { status: 409 });
    }

    await prisma.qRScanRecord.create({
        data: {
            qrCode,
            scanTime: new Date(),
            status: "SCANNED",
            scannedBy: "STAFF", // 可替换为真实 userId
        },
    });

    return NextResponse.json({ message: "✅ Check-in Successful!" });
}
