import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const shows = await prisma.show.findMany({
      where: {
        cancelled: false,
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

    // 👇 拼接完整的图片地址
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
          ? `${baseUrl}${show.movie.image}`
          : undefined,
      },
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('❌ Error loading showtimes:', err);
    return NextResponse.json({ error: 'Failed to load showtimes' }, { status: 500 });
  }
}
