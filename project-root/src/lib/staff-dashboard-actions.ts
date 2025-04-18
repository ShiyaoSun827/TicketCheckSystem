"use server";

import prisma from "@/lib/prisma";

// get recent checkin history
export async function getRecentCheckins() {
    const scans = await prisma.qRScanRecord.findMany({
        orderBy: { scanTime: "desc" },
        take: 10,
    });

    const results = await Promise.all(
        scans.map(async (scan) => {
            const ticket = await prisma.ticket.findUnique({
                where: { qrCode: scan.qrCode },
                include: {
                    user: true,
                },
            });

            if (!ticket) return null;

            return {
                userName: ticket.user.name,
                seat: `${ticket.seatRow}${ticket.seatCol}`,
                time: scan.scanTime,
            };
        })
    );

    return results.filter(Boolean);
}

export async function getSeatStatusByShow(showId: string) {
    const seats = await prisma.seat.findMany({
        where: { showId },
        include: {
            ticket: {
                select: {
                    status: true,
                },
            },
        },
    });

    return seats.map((seat) => ({
        id: seat.id,
        row: seat.row,
        col: seat.col,
        reserved: !!seat.ticketId,
        status: seat.ticket?.status ?? null,
    }));
}

// get today's Show
export async function getTodayShows() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const shows = await prisma.show.findMany({
        where: {
            beginTime: {
                gte: start,
                lte: end,
            },
        },
        include: {
            movie: true,
        },
        orderBy: { beginTime: "asc" },
    });



    return shows.map((s) => ({
        id: s.id,
        movieName: s.movie.name,
        beginTime: s.beginTime,
        endTime: s.endTime,
    }));
}

export async function getAllShowsWithMovieNames() {
    const shows = await prisma.show.findMany({
        orderBy: { beginTime: "asc" },
        include: {
            movie: true,
        },
    });

    return shows.map((show) => ({
        id: show.id,
        movieName: show.movie.name,
        beginTime: show.beginTime,
        endTime: show.endTime,
    }));
}

export async function getCheckedSeats(showId: string) {
    const seats = await prisma.seat.findMany({
        where: { showId },
        include: {
            ticket: {
                select: {
                    status: true, // VALID / CHECKED
                },
            },
        },
    });

    return seats.map((s) => ({
        id: s.id,
        row: s.row,
        col: s.col,
        status: s.ticket?.status ?? null, // CHECKED / VALID / null
    }));
}
