"use client";

import React from "react";

interface CheckedSeat {
    id: string;
    row: string;
    col: number;
    status: "VALID" | "CHECKED" | null;
}

interface CheckedSeatMapProps {
    seats: CheckedSeat[] | null | undefined;
}

const CheckedSeatMap: React.FC<CheckedSeatMapProps> = ({ seats }) => {
    if (!seats) {
        return <p className="text-gray-500 italic">Load in the seat...</p>;
    }

    if (seats.length === 0) {
        return <p className="text-red-600">❌ No available seat table</p>;
    }

    const getSeatKey = (row: string, col: number) => `${row}${col}`;

    const rows = [...new Set(seats.map((s) => s.row))];
    const cols = [...new Set(seats.map((s) => s.col))];

    const seatMap = new Map(seats.map((s) => [getSeatKey(s.row, s.col), s.status]));

    return (
        <div className="space-y-2">
            {rows.map((row) => (
                <div key={row} className="flex gap-1 justify-center">
                    {cols.map((col) => {
                        const seatKey = getSeatKey(row, col);
                        const status = seatMap.get(seatKey);

                        let colorClass = "bg-gray-300 text-black";
                        if (status === "VALID") colorClass = "bg-yellow-400 text-black";
                        if (status === "CHECKED") colorClass = "bg-green-500 text-white";

                        return (
                            <div
                                key={seatKey}
                                className={`w-8 h-8 text-xs rounded border font-mono flex items-center justify-center ${colorClass}`}
                            >
                                {seatKey}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default CheckedSeatMap;
