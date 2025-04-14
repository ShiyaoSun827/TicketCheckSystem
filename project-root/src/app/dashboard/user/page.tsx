//src/app/dashboard/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyTickets, getWaitlistStatus, getProfile } from "@/lib/user-dashboard-actions";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";

interface Ticket {
  id: string;
  eventTitle: string;
  date: string;
  seat: string;
  qrCodeUrl?: string;
}

interface WaitlistItem {
  eventTitle: string;
  status: string;
}

interface Profile {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [ticketData, waitlistData, profileData] = await Promise.all([
        getMyTickets(),
        getWaitlistStatus(),
        getProfile(),
      ]);
      setTickets(ticketData);
      setWaitlist(waitlistData);
      setProfile(profileData);
      setLoading(false);
    }
    fetchData();
  }, []);
  const { session, isLoading: sessionLoading } = authClient.useSession();
  console.log("Session from authClient:", session);
  return (
    <div className="p-6 space-y-8">
      <NavBarClient session={session} />
      <h1 className="text-3xl font-bold">🎫 Attendee Dashboard</h1>

      {profile && (
        <section>
          <h2 className="text-2xl font-semibold mb-2">🧾 Profile Summary</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-2">🎟️ My Tickets</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>You haven’t booked any tickets yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="border p-4 rounded-lg shadow-md space-y-2">
                <h3 className="text-xl font-semibold">{ticket.eventTitle}</h3>
                <p><strong>Date:</strong> {ticket.date}</p>
                <p><strong>Seat:</strong> {ticket.seat}</p>
                {ticket.qrCodeUrl && (
                  <Image src={ticket.qrCodeUrl} alt="QR Code" width={100} height={100} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">📤 Waitlist Status</h2>
        {waitlist.length === 0 ? (
          <p>You are not currently on any waitlists.</p>
        ) : (
          <ul className="list-disc list-inside">
            {waitlist.map((item, index) => (
              <li key={index}>
                {item.eventTitle} - <span className="italic text-gray-600">{item.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <a href="/movies" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
          📅 Browse Upcoming Events
        </a>
      </section>

    </div>
  );
}
