import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { qrCode } = await req.json();

    // Look up the ticket by QR code
    const ticket = await prisma.ticket.findUnique({
        where: { qrCode },
    });

    // Ticket not found
    if (!ticket) {
        return NextResponse.json({ message: "❌ Invalid QR Code" }, { status: 404 });
    }

    // Ticket has already been checked in
    if (ticket.status === "CHECKED") {
        return NextResponse.json({ message: "⚠️ Already Checked-in" }, { status: 409 });
    }

    // Update ticket status to CHECKED
    await prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: "CHECKED" },
    });

    // Log the scan record
    await prisma.qRScanRecord.create({
        data: {
            qrCode,
            scanTime: new Date(),
            status: "SCANNED",
            scannedBy: "STAFF",
        },
    });

    return NextResponse.json({ message: "✅ Check-in Successful!" });
}
