// src/app/api/checkin/route.ts
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

    // 已检票则拒绝
    if (ticket.status === "CHECKED") {
        return NextResponse.json({ message: "⚠️ Already Checked-in" }, { status: 409 });
    }

    // 更新票据状态为 CHECKED
    await prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: "CHECKED" },
    });

    // 写入扫码记录
    await prisma.qRScanRecord.create({
        data: {
            qrCode,
            scanTime: new Date(),
            status: "SCANNED",
            scannedBy: "STAFF",
        },
    });

    return NextResponse.json({ message: "✅ Check-in Successful!" });

    return NextResponse.json({ message: "✅ Check-in Successful!" });
}
