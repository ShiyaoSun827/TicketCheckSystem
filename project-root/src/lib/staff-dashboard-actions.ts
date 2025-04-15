"use server";

import prisma from "@/lib/prisma";

// 获取最近签到记录（5条）
export async function getRecentCheckins() {
    const records = await prisma.qRScanRecord.findMany({
        orderBy: { scanTime: "desc" },
        take: 5,
    });

    // 假设你通过 qrCode 能找到对应的 Ticket → User
    const enriched = await Promise.all(records.map(async (record) => {
        const ticket = await prisma.ticket.findUnique({
            where: { qrCode: record.qrCode },
            include: { show: { include: { movie: true } } },
        });
        const user = await prisma.user.findUnique({ where: { id: ticket?.userID } });
        return {
            userName: user?.name ?? "Unknown",
            seat: ticket?.seat ?? "-",
            time: record.scanTime,
        };
    }));

    return enriched;
}

// 获取当天的 Show
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
