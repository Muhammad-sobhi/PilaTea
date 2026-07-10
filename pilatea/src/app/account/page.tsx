"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAuth } from "@/context/AuthContext";

import { BackButton } from "@/components/BackButton";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const membership = user?.membership as { end_date?: string; membership?: { id?: number; name?: string; price?: number } } | undefined;
  const plan = membership?.membership;

  if (loading) return <div className="page min-h-screen flex items-center justify-center" style={{ paddingTop: 130 }}><p>Loading...</p></div>;

  if (!user) return (
    <div className="page min-h-screen flex items-center justify-center text-center" style={{ paddingTop: 130 }}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Sign in to view your account</h1>
        <Link href="/login" className="btn">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="opacity-60 mb-10">Welcome back, {user.name}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="glass-card">
              <h2 className="text-lg font-bold mb-1">Profile</h2>
              <p className="text-sm opacity-60">{user.email}</p>
              {user.phone && <p className="text-sm opacity-60">{user.phone}</p>}
              <p className="text-sm opacity-60 capitalize">{user.role}</p>
            </div>

            <div className="glass-card">
              <h2 className="text-lg font-bold mb-1">Membership</h2>
              {plan ? (
                <>
                  <p className="text-sm font-semibold text-[#E8A6F4]">{plan.name}</p>
                  <p className="text-xs opacity-60">Active until {membership?.end_date ? new Date(membership.end_date).toLocaleDateString("en-GB") : ""}</p>
                </>
              ) : (
                <>
                  <p className="text-sm opacity-60 mb-3">No active membership</p>
                  <Link href="/memberships" className="btn text-sm !py-2 !px-4">View Plans</Link>
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="glass-card">
              <h2 className="text-lg font-bold mb-1">Bookings</h2>
              <p className="text-sm opacity-60">View your upcoming and past sessions.</p>
              <Link href="/my-bookings" className="btn text-sm !py-2 !px-4 mt-4 inline-block">View Bookings</Link>
            </div>
            <div className="glass-card">
              <h2 className="text-lg font-bold mb-1">Book a Session</h2>
              <p className="text-sm opacity-60">Browse upcoming events and book your spot.</p>
              <Link href="/events" className="btn text-sm !py-2 !px-4 mt-4 inline-block">Browse Events</Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}