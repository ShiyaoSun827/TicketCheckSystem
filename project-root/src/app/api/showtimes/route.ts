import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const shows = await prisma.show.findMany({
      where: {
        
        status: 'PUBLISHED',
      },
      orderBy: {
        beginTime: 'asc',
      },
      include: {
        movie: {
          select: {
            name: true,
            image: true,
            length: true,
          },
        },
      },
    });

    // 👇 Concatenate to form the complete image address
    const baseUrl = process.env.PUBLIC_IMAGE_BASE_URL || 'http://localhost:3000';

    const result = shows.map((show) => ({
      id: show.id,
      beginTime: show.beginTime,
      endTime: show.endTime,
      price: show.price,
      movie: {
        name: show.movie.name,
        length: show.movie.length,
        image: show.movie.image
          ? show.movie.image
          : undefined,
      },
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('❌ Error loading showtimes:', err);
    return NextResponse.json({ error: 'Failed to load showtimes' }, { status: 500 });
  }
}
