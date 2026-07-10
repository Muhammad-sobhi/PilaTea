"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getEvents } from "@/lib/api";
import { storageUrl, formatDate } from "@/lib/utils";
import type { Event } from "@/lib/types";

import { BackButton } from "@/components/BackButton";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents<Event[]>().then(r => setEvents(r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Finding upcoming sessions..." />;

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="text-center mb-16">
          <p className="script" style={{ margin: "0 0 12px" }}>Join Us</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Events &amp; Workshops</h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto">
            From sunrise Pilates sessions to tea-tasting workshops &mdash; discover what&apos;s happening at PILATEA.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {events.length === 0 && (
            <p className="opacity-50 col-span-3 text-center py-12">No upcoming events at the moment. Check back soon!</p>
          )}
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
            >
              <Link href={`/events/${event.id}`} className="block">
                <div className="glass-card">
                  {event.image ? (
                    <img src={storageUrl(event.image)} alt={event.title} className="w-full h-48 object-cover rounded-2xl mb-4" />
                  ) : (
                    <div className="w-full h-48 rounded-2xl mb-4 bg-gradient-to-br from-[#BFEAFF] to-[#E8A6F4]/50 flex items-center justify-center text-5xl">&#x1F4C5;</div>
                  )}
                  <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">{formatDate(event.event_date)} &middot; {event.start_time}</p>
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm opacity-65 mb-3">{event.description?.substring(0, 120)}</p>
                  <div className="flex justify-between text-sm">
                    <span>&#x1F4CD; {event.location_name}</span>
                    <span className="font-semibold">${event.price}</span>
                  </div>
                  <p className="text-xs opacity-50 mt-2">Capacity: {event.capacity}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      </ScrollReveal>
    </div>
  );
}