// src/app/api/checkin/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { qrCode } = await req.json();

    if (!qrCode) {
      return NextResponse.json({ message: "Missing qrCode" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: { qrCode },
    });

    if (!ticket) {
      return NextResponse.json({ message: "❌ Invalid QR Code" }, { status: 404 });
    }

    if (ticket.status === "CHECKED") {
      return NextResponse.json({ message: "⚠️ Already Checked-in" }, { status: 409 });
    }

    if (ticket.status !== "VALID") {
      return NextResponse.json({ message: `Cannot check-in. Status is ${ticket.status}` }, { status: 400 });
    }

    // ✅ Update ticket status
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: "CHECKED" },
    });

    // ✅ Record scan
    await prisma.qRScanRecord.create({
      data: {
        qrCode,
        scanTime: new Date(),
        status: "SCANNED",
        scannedBy: "STAFF", // 网页端的 staff 页面
      },
    });

    return NextResponse.json({ success: true, message: "✅ Check-in Successful!" });
  } catch (err) {
    console.error("❌ Check-in error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}