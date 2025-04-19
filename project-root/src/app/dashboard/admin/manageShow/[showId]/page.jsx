// src/app/dashboard/admin/manageShow/[showId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getShowById,
  getSeatsByShowId,
  cancelShowAndRefundTickets,
} from "@/lib/admin-dashboard-actions";
import Image from "next/image";
import NavBarClient from "@/components/NavBarClient";

export default function ManageShowPage() {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getShowById(showId);
      const seatList = await getSeatsByShowId(showId);
      setShow(data);
      setSeats(seatList);
    }
    load();
  }, [showId]);

  if (!show) return <p>Loading...</p>;

  const seatMap = new Map();
  seats.forEach((seat) => {
    if (!seatMap.has(seat.row)) seatMap.set(seat.row, []);
    seatMap.get(seat.row).push(seat);
  });

  const sortedRows = [...seatMap.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  const handleCancelShow = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this show and refund all sold tickets?");
    if (!confirmed) return;

    try {
      const result = await cancelShowAndRefundTickets(show.id);
      if (result.success) {
        alert("✅ Show has been cancelled and tickets refunded!");
        location.reload();
      } else {
        alert("❌ Cancellation failed: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Request failed");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <NavBarClient />

      {/* 🎬 Movie Info */}
      <div className="flex flex-col md:flex-row gap-6 border p-4 rounded-lg shadow-sm">
        {show.movie.image && (
          <div className="flex-shrink-0">
            <Image
              src={show.movie.image}
              alt={show.movie.name}
              width={96}
              height={128}
              className="rounded shadow"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold">🎬 {show.movie.name}</h1>
          <p>
            <strong>Show ID:</strong> {show.id}
          </p>
          <p>
            <strong>Description:</strong> {show.movie.description}
          </p>
          <p>
            <strong>Price:</strong> ${show.price}
          </p>
          <p>
            <strong>Showtime:</strong>{" "}
            {new Date(show.beginTime).toLocaleString()} -{" "}
            {new Date(show.endTime).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                show.status === "PUBLISHED"
                  ? "bg-green-600"
                  : show.status === "CANCELLED"
                  ? "bg-red-600"
                  : "bg-gray-500"
              }`}
            >
              {show.status}
            </span>
          </p>
        </div>

        {/* ❌ Cancel Show Section */}
        {show.status !== "CANCELLED" && (
          <div className="flex flex-col justify-start">
            <h2 className="text-xl font-semibold mb-2 text-red-600">❌ Actions</h2>
            <button
              onClick={handleCancelShow}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel this show and refund tickets
            </button>
          </div>
        )}
      </div>

      {/* 🎟️ Seat Picker */}
      <div>
        <h2 className="text-xl font-semibold mb-2">🪑 Seats Status</h2>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 my-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 border rounded" />
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded" />
            <span className="text-sm text-gray-600">Purchased</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded" />
            <span className="text-sm text-gray-600">Checked-in</span>
          </div>
        </div>

        <div className="space-y-2 w-fit mx-auto">
          {sortedRows.map(([row, rowSeats]) => (
            <div key={row} className="flex gap-1 items-center">
              <span className="w-4 text-center text-gray-800 font-mono">{row}</span>
              {rowSeats
                .sort((a, b) => a.col - b.col)
                .map((seat) => {
                  const ticketStatus = seat.ticket?.status;
                  let color = "bg-blue-100"; // Available

                  if (ticketStatus === "CHECKED") {
                    color = "bg-purple-500 text-white";
                  } else if (seat.reserved) {
                    color = "bg-green-500 text-white";
                  }

                  return (
                    <div
                      key={seat.id}
                      className={`w-8 h-8 text-sm text-center rounded font-mono ${color}`}
                    >
                      {row}
                      {seat.col + 1}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Check-in Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">✅ Check-in Details</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    </div>
  );
}