"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackButton } from "@/components/BackButton";
import { getEvents } from "@/lib/api";
import { storageUrl, formatDate } from "@/lib/utils";
import type { Event } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  useEffect(() => {
    getEvents()
      .then((r) => setEvents(Array.isArray(r) ? r : (r as any)?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Finding upcoming sessions..." />;

  // Sample static events matching mockup if database empty
  const defaultEvents: Event[] = [
    {
      id: 1,
      title: "Sunset Pilates in the Park",
      description: "Join us for a relaxing sunset Pilates session at Lumphini Park. Connect with nature, breathe, and move.",
      price: 35,
      capacity: 15,
      spots_remaining: 13,
      event_date: "2026-07-10",
      start_time: "17:30",
      end_time: "18:30",
      location_name: "Lumphini Park",
      image: undefined,
      created_at: "",
      updated_at: "",
    },
    {
      id: 2,
      title: "Rooftop Pilates Flow",
      description: "Start your morning with an energizing Pilates flow on our beautiful rooftop venue overlooking the city skyline.",
      price: 45,
      capacity: 15,
      spots_remaining: 12,
      event_date: "2026-07-22",
      start_time: "07:00",
      end_time: "08:00",
      location_name: "The Sky Lounge",
      image: undefined,
      created_at: "",
      updated_at: "",
    },
    {
      id: 3,
      title: "Beach Pilates & Tea",
      description: "Pilates on the sand followed by a curated tea experience. The ultimate wellness afternoon by the ocean.",
      price: 55,
      capacity: 30,
      spots_remaining: 25,
      event_date: "2026-07-29",
      start_time: "16:00",
      end_time: "18:00",
      location_name: "Pattaya Beach",
      image: undefined,
      created_at: "",
      updated_at: "",
    },
    {
      id: 4,
      title: "Full Moon Candlelight Pilates",
      description: "Atmospheric evening session surrounded by soft candlelight and calming herbal aromas.",
      price: 50,
      capacity: 20,
      spots_remaining: 18,
      event_date: "2026-08-05",
      start_time: "19:00",
      end_time: "20:15",
      location_name: "Pilatea Main Studio",
      image: undefined,
      created_at: "",
      updated_at: "",
    },
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className="relative min-h-screen pt-28 pb-32 md:pb-40 mb-12">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        <BackButton />

        {/* Hero Section matching mockup with event.png */}
        <ScrollReveal>
          <div className="mt-4 relative min-h-[440px] md:min-h-[480px] rounded-[32px] overflow-hidden flex items-start p-8 md:p-14 border border-[#EBE3D5] shadow-sm">
            {/* Background Image event.png */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/event.png"
                alt="PILATEA Events & Gatherings"
                fill
                className="object-cover object-right lg:object-center brightness-[0.98]"
                priority
              />
              {/* Soft gradient overlay on left for high readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7F2E9] via-[#F7F2E9]/85 to-transparent lg:w-[60%]" />
            </div>

            {/* Left Hero Text Column */}
            <div className="relative z-10 max-w-xl text-[#4A354F] pt-2 md:pt-4">
              <h1
                className="font-script text-5xl md:text-6xl lg:text-7xl text-[#5B1D2E] mb-2 leading-tight"
                style={{
                  background: "none",
                  WebkitBackgroundClip: "unset",
                  WebkitTextFillColor: "initial",
                  color: "#5B1D2E",
                }}
              >
                Join Our Gatherings
              </h1>

              <h2
                className="font-script text-4xl md:text-5xl lg:text-6xl text-[#5B1D2E] mb-4 leading-tight"
                style={{
                  background: "none",
                  WebkitBackgroundClip: "unset",
                  WebkitTextFillColor: "initial",
                  color: "#5B1D2E",
                }}
              >
                Upcoming Events
              </h2>

              <p className="text-sm md:text-base text-[#5C4D56] leading-relaxed max-w-lg">
                From mat Pilates in the park to tea experience workshops — explore all our upcoming sessions and reserve your spot.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Directly Floating Event Cards & Floating Side Arrows */}
        <div className="relative z-20 -mt-24 md:-mt-32 px-2 sm:px-4 md:px-6 group overflow-hidden">
          <ScrollReveal>
            <div className="relative">
              {/* Left Floating Circular Arrow Button */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 sm:-left-3 md:-left-5 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#5B1D2E] text-white hover:bg-[#481523] flex items-center justify-center transition-all shadow-2xl active:scale-95 border-2 border-white text-xl sm:text-3xl font-black leading-none pb-0.5"
                aria-label="Scroll left"
              >
                &#8249;
              </button>

              {/* Right Floating Circular Arrow Button */}
              <button
                onClick={scrollRight}
                className="absolute right-0 sm:-right-3 md:-right-5 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#5B1D2E] text-white hover:bg-[#481523] flex items-center justify-center transition-all shadow-2xl active:scale-95 border-2 border-white text-xl sm:text-3xl font-black leading-none pb-0.5"
                aria-label="Scroll right"
              >
                &#8250;
              </button>

              {/* Horizontal Slider Track of Individual Glassy Cards */}
              <div
                ref={carouselRef}
                className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth py-3 px-2 snap-x snap-mandatory no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {displayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="min-w-[260px] max-w-[280px] md:min-w-[310px] md:max-w-[330px] flex-1 snap-start bg-[#F7F2E9]/80 backdrop-blur-xl rounded-[28px] overflow-hidden border border-[#EBE3D5]/80 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:bg-[#F7F2E9]/95 transition-all shrink-0 hover:-translate-y-1"
                  >
                    <div>
                      {/* Compact Event Thumbnail */}
                      <div className="relative w-full h-44 bg-[#E0D5C3]">
                        {event.image && storageUrl(event.image) ? (
                          <Image
                            src={storageUrl(event.image)!}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full relative">
                            <Image
                              src={
                                event.id % 3 === 1
                                  ? "/about.png"
                                  : event.id % 3 === 2
                                  ? "/go.png"
                                  : "/tea.png"
                              }
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Price Badge (Top Right) */}
                        <div className="absolute top-3.5 right-3.5 bg-[#5B1D2E] text-white px-3.5 py-1 rounded-full text-xs font-semibold shadow-md">
                          ${typeof event.price === "number" ? event.price.toFixed(2) : event.price}
                        </div>

                        {/* Spots Left Badge (Bottom Left) */}
                        {(event.spots_remaining ?? event.capacity ?? 0) > 0 && (
                          <div className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#4A354F] px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
                            <svg className="w-3.5 h-3.5 text-[#5B1D2E]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                            <span>{event.spots_remaining ?? event.capacity} spots left</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <h4 className="font-semibold text-base text-[#4A354F] mb-1.5 leading-snug">
                          {event.title}
                        </h4>

                        {event.description && (
                          <p className="text-xs text-[#6A5A64] line-clamp-2 mb-4 leading-relaxed">
                            {event.description}
                          </p>
                        )}

                        {/* Date, Time, Location Box */}
                        <div className="bg-[#EFE8DC]/80 backdrop-blur-sm rounded-xl p-3 space-y-1.5 text-xs text-[#5C4D56]">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#5B1D2E] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            <span>{formatDate(event.event_date)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#5B1D2E] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{event.start_time}{event.end_time ? ` – ${event.end_time}` : ""}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#5B1D2E] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="truncate">{event.location_name || "Location TBD"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Session Button */}
                    <div className="p-5 pt-0">
                      <Link
                        href={`/events/${event.id}`}
                        className="block w-full bg-[#5B1D2E] hover:bg-[#481523] text-white font-medium py-2.5 rounded-full text-center transition-all shadow-md text-xs tracking-wide"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}