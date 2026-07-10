"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getMyBookings } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import type { Booking } from "@/lib/types";

import { BackButton } from "@/components/BackButton";

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMyBookings().then((r: unknown) => {
      const data = (r as Record<string, unknown>).data as Booking[] || (r as Booking[]) || [];
      setBookings(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return <div className="page min-h-screen flex items-center justify-center" style={{ paddingTop: 130 }}><p className="opacity-60">Loading...</p></div>;

  if (!user) return (
    <div className="page min-h-screen flex items-center justify-center text-center" style={{ paddingTop: 130 }}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Sign in to view your bookings</h1>
        <Link href="/login" className="btn">Sign In</Link>
      </div>
    </div>
  );

  const statusBadge = (status?: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-green-50 text-green-700 border-green-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      pay_on_arrival: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return `px-3 py-1 rounded-full text-xs font-medium border ${colors[status || ""] || "bg-gray-50 text-gray-600 border-gray-200"}`;
  };

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="opacity-60 mb-10">View your upcoming and past sessions.</p>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
          ) : bookings.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="opacity-60 mb-4">No bookings yet.</p>
              <Link href="/events" className="btn">Book a Session</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="glass-card flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{b.event?.title || "Event"}</h3>
                    <p className="text-sm opacity-60">{formatDate(b.event?.event_date)} &middot; {b.event?.start_time}</p>
                    <p className="text-xs opacity-50 mt-1">Booking Ref: {b.reference}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={statusBadge(b.status)}>
                      {b.status === "pay_on_arrival" ? "Pay on Arrival" : b.status}
                    </span>
                    <span className="text-sm font-semibold">{b.spots_booked} spot(s)</span>
                    <span className="text-sm font-bold">${b.total_price}</span>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <Link href="/events" className="btn">Book Another Session</Link>
              </div>
            </div>
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}