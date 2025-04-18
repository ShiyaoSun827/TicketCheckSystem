// src/app/api/showtimes/id/seats/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const showId = url.searchParams.get('showId');

  if (!showId) {
    return NextResponse.json({ error: 'Missing showId' }, { status: 400 });
  }

  try {
    const seats = await prisma.seat.findMany({
      where: { showId },
      include: {
        ticket: {
          select: { status: true },
        },
      },
      orderBy: [{ row: 'asc' }, { col: 'asc' }],
    });

    const result = seats.map(seat => ({
      id: seat.id,
      row: seat.row,
      col: seat.col,
      reserved: seat.reserved,
      status: seat.ticket?.status ?? 'AVAILABLE',
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('Failed to fetch seats:', err);
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
  }
}
