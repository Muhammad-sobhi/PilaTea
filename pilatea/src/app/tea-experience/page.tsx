"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getTeaItems } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { storageUrl, getSetting } from "@/lib/utils";
import type { TeaItem } from "@/lib/types";
import { BackButton } from "@/components/BackButton";

export default function TeaExperiencePage() {
  const [teas, setTeas] = useState<TeaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();

  useEffect(() => {
    getTeaItems<TeaItem[]>()
      .then((r) => setTeas(r || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const s = (key: string, fallback: string) => getSetting(settings, key, fallback);


  if (loading) return <Loading text="Loading tea menu..." />;

  // Sample static tea items matching mockup if database empty
  const defaultTeas = [
    {
      id: 1,
      name: "CALM LAVENDER",
      description: "Soothing lavender and chamomile for deep relaxation.",
      price: "6.50",
      image: null,
    },
    {
      id: 2,
      name: "JASMINE GREEN",
      description: "Delicate green tea with jasmine blossoms.",
      price: "6.50",
      image: null,
    },
    {
      id: 3,
      name: "CITRUS BLISS",
      description: "A refreshing blend of citrus peels and herbal notes.",
      price: "6.50",
      image: null,
    },
    {
      id: 4,
      name: "ROSE RADIANCE",
      description: "Floral rose with hints of hibiscus for natural glow.",
      price: "6.50",
      image: null,
    },
    {
      id: 5,
      name: "MINT REFRESH",
      description: "Cool peppermint and spearmint for a fresh, clean finish.",
      price: "6.50",
      image: null,
    },
  ];

  const displayTeas = teas.length > 0 ? teas : defaultTeas;

  return (
    <div className="relative min-h-screen pt-24 pb-16 md:pb-40 mb-12" style={{ overflowX: 'hidden' }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        <BackButton />

        {/* Outer Container matching mockup */}
        <div className="mt-4 relative rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#EBE3D5] shadow-lg bg-[#F7F2E9]">
          
          {/* Top Main Hero Block with tea.png full background */}
          <div className="relative p-5 sm:p-10 md:p-14 flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
            {/* Background Image tea.png */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/tea.png"
                alt="PILATEA Tea Experience"
                fill
                className="object-cover object-center brightness-[0.98]"
                priority
              />
              {/* Soft overlay gradient for high readability on mobile & desktop */}
              <div className="absolute inset-0 bg-[#F7F2E9]/92 sm:bg-gradient-to-r sm:from-[#F7F2E9] sm:via-[#F7F2E9]/85 sm:to-transparent sm:w-[65%]" />
            </div>

            {/* Top Hero Text Column */}
            <div className="relative z-10 w-full lg:max-w-xl text-[#4A354F] pb-4 sm:pb-12 md:pb-16">
              <p className="text-[10px] sm:text-[12px] tracking-[0.25em] font-semibold text-[#6E555C] uppercase mb-2 sm:mb-3">
                {s("tea_subheading", "OUR TEA PHILOSOPHY")}
              </p>

              <h1
                className="font-script text-[28px] sm:text-6xl lg:text-7xl text-[#5B1D2E] mb-3 sm:mb-4 leading-tight"
                style={{
                  background: "none",
                  WebkitBackgroundClip: "unset",
                  WebkitTextFillColor: "initial",
                  color: "#5B1D2E",
                }}
              >
                Savor the Moment. <br />
                Sip with Intention. <span className="inline-block text-lg sm:text-4xl text-[#5B1D2E] align-middle">♥</span>
              </h1>

              <div className="space-y-2 sm:space-y-3 text-xs sm:text-base text-[#5C4D56] leading-relaxed mb-4 sm:mb-6">
                <p>
                  {s(
                    "tea_content_p1",
                    "At PILATEA, tea is more than a drink—it's a moment of pause, a ritual of care, and a way to connect with yourself and others."
                  )}
                </p>
                <p>
                  {s(
                    "tea_content_p2",
                    "Handpicked leaves. Clean ingredients. Blends that nourish your body and calm your mind."
                  )}
                </p>
              </div>

              {/* 3 Quick Features */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center mb-4 sm:mb-6 pt-3 sm:pt-4 border-t border-[#E8DFCFA0]/60 max-w-md">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#7A283E30] flex items-center justify-center mb-1.5 sm:mb-2 text-[#5B1D2E]">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#4A354F] leading-tight sm:leading-snug">
                    Premium<br />Ingredients
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#7A283E30] flex items-center justify-center mb-1.5 sm:mb-2 text-[#5B1D2E]">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 8.25h1.875a1.875 1.875 0 010 3.75h-1.875M4.5 8.25h14v7.5a3.75 3.75 0 01-3.75 3.75h-6.5A3.75 3.75 0 014.5 15.75v-7.5z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#4A354F] leading-tight sm:leading-snug">
                    Thoughtful<br />Blends
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#7A283E30] flex items-center justify-center mb-1.5 sm:mb-2 text-[#5B1D2E]">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 1114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#4A354F] leading-tight sm:leading-snug">
                    Nourish. Relax.<br />Connect.
                  </span>
                </div>
              </div>

              {/* Explore Our Teas Pill Button */}
              <div className="relative z-10">
                <a
                  href="#collection"
                  className="inline-block bg-[#5B1D2E] hover:bg-[#481523] text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all shadow-md hover:shadow-lg text-xs sm:text-sm tracking-wide"
                >
                  Explore Our Teas
                </a>
              </div>
            </div>
          </div>

          {/* Tea Cards & Community Panel */}
          <div id="collection" className="relative z-20 px-3 sm:px-6 md:px-8 py-6 sm:py-8">
            <ScrollReveal>
              {/* Tea Cards Grid - stacks vertically on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
                {displayTeas.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#F7F2E9]/90 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] p-4 flex flex-col justify-between border border-[#EBE3D5]/80 text-center shadow-lg hover:shadow-xl hover:bg-[#F7F2E9] transition-all hover:-translate-y-1"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden mb-3 bg-[#E0D5C3]">
                        {item.image && storageUrl(item.image) ? (
                          <Image
                            src={storageUrl(item.image)!}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl bg-amber-100/60">
                            🍵
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-xs uppercase tracking-wide text-[#5B1D2E] mb-1.5 truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-[#6A5A64] leading-relaxed mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {item.price != null && (
                      <p className="font-semibold text-sm text-[#4A354F]">
                        ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Burgundy Card: Tea, Community & Connection */}
            <ScrollReveal>
              <div className="bg-[#5B1D2E] text-[#F7F2E9] rounded-[24px] sm:rounded-[28px] py-8 sm:py-10 px-6 sm:px-10 flex flex-col items-center justify-center text-center shadow-xl w-full mb-6">
                {/* Top Circle Clock Icon */}
                <div className="w-10 h-10 rounded-full border border-[#F7F2E9]/40 flex items-center justify-center text-[#F7F2E9] mb-4 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 15" />
                  </svg>
                </div>

                <h3 
                  className="font-script text-2xl sm:text-4xl leading-tight mb-3"
                  style={{
                    fontFamily: "var(--font-allura), cursive",
                    background: 'none',
                    WebkitBackgroundClip: 'unset',
                    WebkitTextFillColor: '#F7F2E9',
                    color: '#F7F2E9'
                  }}
                >
                  Tea, Community &amp; Connection
                </h3>

                <p className="text-xs sm:text-sm text-[#F7F2E9]/90 leading-relaxed max-w-sm font-normal mx-auto mb-6">
                  Join our tea gatherings and ceremonies to slow down, connect, and share meaningful moments.
                </p>

                <Link
                  href="/events"
                  className="bg-[#F7F2E9] hover:bg-white text-[#5B1D2E] font-medium px-8 py-3 rounded-full transition-all shadow-md text-xs sm:text-sm tracking-wide shrink-0"
                >
                  Upcoming Events
                </Link>
              </div>
            </ScrollReveal>

            {/* Bottom Banner - features grid */}
            <ScrollReveal>
              <div className="bg-[#EFE8DC]/90 backdrop-blur-sm rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 border border-[#EBE3D5] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-[#5C4D56] text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#7A283E30] flex items-center justify-center text-[#5B1D2E] shrink-0 text-sm">
                    🌱
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#4A354F] text-[11px] sm:text-xs">100% Natural</p>
                    <p className="text-[9px] sm:text-[10px] text-[#7A6872]">No artificial flavors</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#7A283E30] flex items-center justify-center text-[#5B1D2E] shrink-0 text-sm">
                    ♥
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#4A354F] text-[11px] sm:text-xs">Made with Love</p>
                    <p className="text-[9px] sm:text-[10px] text-[#7A6872]">Small batch blends</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#7A283E30] flex items-center justify-center text-[#5B1D2E] shrink-0 text-sm">
                    ☕
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#4A354F] text-[11px] sm:text-xs">Sustainably Sourced</p>
                    <p className="text-[9px] sm:text-[10px] text-[#7A6872]">Better for you & Earth</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#7A283E30] flex items-center justify-center text-[#5B1D2E] shrink-0 text-sm">
                    👥
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#4A354F] text-[11px] sm:text-xs">Community Focused</p>
                    <p className="text-[9px] sm:text-[10px] text-[#7A6872]">Tea brings us together</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}