"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Users, Coffee, Sparkles } from "lucide-react";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackButton } from "@/components/BackButton";
import { getEvents } from "@/lib/api";
import { storageUrl, formatDate } from "@/lib/utils";
import type { Event } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(r => setEvents(Array.isArray(r) ? r : (r as any)?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Finding upcoming sessions..." />;

  return (
    <div className="page" style={{ paddingTop: 130, paddingBottom: 60 }}>
      <BackButton />

      <ScrollReveal>
        <section className="text-center mb-16">
          <p className="script" style={{ margin: "0 0 8px" }}>Join Our Gatherings</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[#3A101C]">Upcoming Events</h1>
          <p className="text-lg opacity-75 max-w-xl mx-auto">
            From mat Pilates in the park to tea experience workshops — explore all our upcoming sessions and reserve your spot.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white/40 backdrop-blur-md rounded-3xl border border-[#5B1D2E]/10">
              <Sparkles size={40} className="mx-auto text-[#5B1D2E]/40 mb-3" />
              <p className="text-lg font-semibold text-[#5B1D2E]">No upcoming events right now</p>
              <p className="text-sm opacity-60 mt-1">Please check back soon or follow our social updates!</p>
            </div>
          ) : (
            events.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
              >
                <div className="flex flex-col h-full bg-[#F1EADD] rounded-3xl border border-[#5B1D2E]/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                  {/* Event Banner Image */}
                  <div className="relative w-full h-52 overflow-hidden bg-[#5B1D2E]/5">
                    {event.image ? (
                      <img
                        src={storageUrl(event.image)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#5B1D2E] to-[#7A283E] flex items-center justify-center text-white text-4xl">
                        <Coffee size={48} strokeWidth={1.25} />
                      </div>
                    )}
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-[#5B1D2E] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
                      ${event.price}
                    </div>

                    {/* Spots badge */}
                    {(event.spots_remaining ?? event.capacity ?? 0) > 0 && (
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#5B1D2E] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <Users size={14} />
                        <span>{event.spots_remaining ?? event.capacity} spots left</span>
                      </div>
                    )}
                  </div>

                  {/* Content area */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-xl text-[#3A101C] mb-2 group-hover:text-[#5B1D2E] transition-colors">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-[#3A101C]/75 line-clamp-2 mb-4">
                          {event.description}
                        </p>
                      )}

                      {/* Event Details List */}
                      <div className="flex flex-col gap-2 text-xs font-medium text-[#5B1D2E] bg-white/60 p-3.5 rounded-2xl border border-[#5B1D2E]/10">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="shrink-0 opacity-75" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={15} className="shrink-0 opacity-75" />
                          <span>{event.start_time}{event.end_time ? ` – ${event.end_time}` : ""}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="shrink-0 opacity-75" />
                          <span className="truncate">{event.location_name || "Location TBD"}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className="btn w-full text-center text-xs font-bold py-3 mt-2"
                    >
                      Book Session
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}