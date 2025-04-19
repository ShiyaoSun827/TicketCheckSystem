//src/app/dashboard/staff/page.tsx
//src/app/dashboard/staff/checkin/checkedSeatMap.tsx
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";
import { useRouter } from "next/navigation";
import CheckedSeatMap from "@/app/dashboard/staff/checkin/checkedSeatMap";
import { getCheckedSeats, getRecentCheckins, getTodayShows, getAllShowsWithMovieNames } from "@/lib/staff-dashboard-actions";


export default function StaffDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [selectedShow, setSelectedShow] = useState("");
    const [allShows, setAllShows] = useState<any[]>([]);

    const [checkedSeats, setCheckedSeats] = useState<any[]>([]);

    async function loadCheckedSeats(showId: string) {
        const res = await getCheckedSeats(showId);
        setCheckedSeats(res);
    }
    const { session } = authClient.useSession();
    const [name, setName] = useState("");
    const router = useRouter();
    const [recentCheckins, setRecentCheckins] = useState<any[]>([]);
    const [todayShows, setTodayShows] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const checkins = await getRecentCheckins();
            const today = await getTodayShows();
            const all = await getAllShowsWithMovieNames();
            setRecentCheckins(checkins);
            setTodayShows(today);
            setAllShows(all);
            setLoading(false);
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


            <section className="bg-white p-4 rounded-lg shadow space-y-4">
                <h2 className="text-2xl font-semibold">📲 Quick Actions</h2>
                <button
                    onClick={() => router.push("/dashboard/staff/checkin")}
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                >
                    ▶️ Start Check-in
                </button>
            </section>

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

            <section className="bg-white p-4 rounded-lg shadow space-y-2">
                <h2 className="text-2xl font-semibold">📝 Recent Check-ins</h2>
                <ul className="text-sm space-y-1">
                    {loading ? (
                        <p className="text-gray-500 italic">Loading recent check-ins...</p>
                    ) : recentCheckins.length === 0 ? (
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

            <section className="bg-white p-4 rounded-lg shadow space-y-4">
                <h2 className="text-2xl font-semibold">🎟️ Preview Checked Seats</h2>
                <select
                    className="border p-2 rounded"
                    value={selectedShow}
                    onChange={(e) => {
                        const showId = e.target.value;
                        setSelectedShow(showId);
                        if (showId) loadCheckedSeats(showId);
                    }}
                >
                    <option value="">Select Show</option>
                    {allShows.map((show: any) => (
                        <option key={show.id} value={show.id}>
                            {show.movieName} ({new Date(show.beginTime).toLocaleString()})
                        </option>
                    ))}
                </select>

                {checkedSeats && (
                    <CheckedSeatMap seats={checkedSeats} />
                )}
            </section>

        </div>
    );
}
