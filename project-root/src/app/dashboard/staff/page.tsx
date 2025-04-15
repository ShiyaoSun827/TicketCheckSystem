"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";
import { useRouter } from "next/navigation";
import { getRecentCheckins, getTodayShows } from "@/lib/staff-dashboard-actions";

export default function StaffDashboardPage() {
    const { session } = authClient.useSession();
    const [name, setName] = useState("");
    const router = useRouter();
    const [recentCheckins, setRecentCheckins] = useState<any[]>([]);
    const [todayShows, setTodayShows] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            const checkins = await getRecentCheckins();
            const shows = await getTodayShows();
            setRecentCheckins(checkins);
            setTodayShows(shows);
        }
        loadData();
    }, []);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    return (
        <div className="p-6 space-y-8">
            <NavBarClient session={session} />
            <h1 className="text-3xl font-bold">👋 Welcome, {name || "Staff"}!</h1>

            {/* 快捷按钮区域 */}
            <section className="bg-white p-4 rounded-lg shadow space-y-4">
                <h2 className="text-2xl font-semibold">📲 Quick Actions</h2>
                <button
                    onClick={() => router.push("/dashboard/staff/checkin")}
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                >
                    ▶️ Start Check-in
                </button>
            </section>

            {/* 今日场次 */}
            <section className="bg-white p-4 rounded-lg shadow space-y-2">
                <h2 className="text-2xl font-semibold">🎬 Today’s Shows</h2>
                {todayShows.length === 0 ? (
                    <p>No scheduled shows today.</p>
                ) : (
                    <ul className="space-y-1 text-sm">
                        {todayShows.map((show, idx) => (
                            <li key={idx}>
                                📽️ <strong>{show.movieName}</strong> —{" "}
                                {new Date(show.beginTime).toLocaleTimeString()} to{" "}
                                {new Date(show.endTime).toLocaleTimeString()}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 最近签到 */}
            <section className="bg-white p-4 rounded-lg shadow space-y-2">
                <h2 className="text-2xl font-semibold">📝 Recent Check-ins</h2>
                <ul className="text-sm space-y-1">
                    {recentCheckins.length === 0 ? (
                        <p>No recent check-ins yet.</p>
                    ) : (
                        recentCheckins.map((checkin, i) => (
                            <li key={i}>
                                ✅ <strong>{checkin.userName}</strong> - Seat {checkin.seat} at{" "}
                                {new Date(checkin.time).toLocaleString()}
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}
