// src/app/api/checkin/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { qrCode } = await req.json();

        if (!qrCode) {
            return NextResponse.json({ success: false, message: '❌ Missing QR Code' }, { status: 400 });
        }

        // 查找票据
        const ticket = await prisma.ticket.findFirst({
            where: { qrCode },
        });

        if (!ticket) {
            return NextResponse.json({ success: false, message: '❌ Invalid QR Code' }, { status: 404 });
        }

        if (ticket.status === 'CHECKED') {
            return NextResponse.json({ success: false, message: '⚠️ Ticket already checked in' }, { status: 409 });
        }

        // 更新票据状态
        await prisma.ticket.update({
            where: { id: ticket.id },
            data: { status: 'CHECKED' },
        });

        // 写入扫码记录
        await prisma.qRScanRecord.create({
            data: {
                qrCode,
                scanTime: new Date(),
                status: 'SCANNED',
                scannedBy: 'MOBILE', // 或者根据需要传入身份
            },
        });

        return NextResponse.json({ success: true, message: '✅ Check-in successful!' });
    } catch (error) {
        console.error('❌ Check-in error:', error);
        return NextResponse.json({ success: false, message: '❌ Internal error' }, { status: 500 });
    }
}