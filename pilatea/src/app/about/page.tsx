"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackButton } from "@/components/BackButton";
import { useSettings } from "@/context/SettingsContext";
import { getSetting } from "@/lib/utils";

export default function AboutPage() {
  const settings = useSettings();

  const s = (key: string, fallback: string) => getSetting(settings, key, fallback);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1320px] mx-auto">
      <BackButton />
      
      <ScrollReveal>
        <div className="mt-4 grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Yoga / Movement Photo matching mockup */}
          <div className="lg:col-span-5 relative min-h-[420px] lg:min-h-[560px] rounded-[28px] overflow-hidden shadow-sm">
            <Image
              src="/about.png"
              alt="PILATEA Movement & Mindful Pilates"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right Column: Warm Cream Story Panel matching mockup */}
          <div className="lg:col-span-7 bg-[#F7F2E9] text-[#4A354F] rounded-[28px] p-8 md:p-12 flex flex-col justify-between border border-[#EBE3D5] shadow-sm">
            <div>
              {/* Small Tracker Category Heading */}
              <p className="text-[13px] tracking-[0.25em] font-semibold text-[#6E555C] uppercase mb-2">
                {s("about_heading", "OUR STORY")}
              </p>

              {/* Script Subheading */}
              <h1 
                className="font-script text-4xl md:text-5xl lg:text-6xl text-[#5B1D2E] mb-6 leading-tight"
                style={{
                  background: 'none',
                  WebkitBackgroundClip: 'unset',
                  WebkitTextFillColor: 'initial',
                  color: '#5B1D2E'
                }}
              >
                More Than Movement <span className="inline-block text-3xl md:text-4xl text-[#5B1D2E] align-middle">♥</span>
              </h1>

              {/* Story Content */}
              <div className="space-y-4 text-sm md:text-base text-[#5C4D56] leading-relaxed max-w-xl">
                <p>
                  {s(
                    "about_content_p1",
                    "PILATEA was created to bring people together through mindful movement, nourishing tea, and real community."
                  )}
                </p>
                <p>
                  {s(
                    "about_content_p2",
                    "We believe in balance, connection, and moments that make you feel good inside and out."
                  )}
                </p>
              </div>
            </div>

            {/* Bottom Section: 3 Pillars + Call to Action Button */}
            <div className="mt-10 pt-8 border-t border-[#E8DFCFA0]">
              {/* 3 Pillars */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 text-center mb-10">
                {/* Pillar 1: Mindful Movement */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-[#7A283E30] flex items-center justify-center mb-3 text-[#5B1D2E]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 10.5l-2-2m11 0l-2 2" />
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-[#4A354F] leading-snug">
                    Mindful<br />Movement
                  </span>
                </div>

                {/* Pillar 2: Nourishing Tea */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-[#7A283E30] flex items-center justify-center mb-3 text-[#5B1D2E]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 8.25h1.875a1.875 1.875 0 010 3.75h-1.875M4.5 8.25h14v7.5a3.75 3.75 0 01-3.75 3.75h-6.5A3.75 3.75 0 014.5 15.75v-7.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75c0 1.5-1.5 1.5-1.5 3m4.5-3c0 1.5-1.5 1.5-1.5 3m4.5-3c0 1.5-1.5 1.5-1.5 3" />
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-[#4A354F] leading-snug">
                    Nourishing<br />Tea
                  </span>
                </div>

                {/* Pillar 3: Real Community */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-[#7A283E30] flex items-center justify-center mb-3 text-[#5B1D2E]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.942 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-[#4A354F] leading-snug">
                    Real<br />Community
                  </span>
                </div>
              </div>

              {/* Join Our Community Pill Button */}
              <div className="flex justify-center">
                <Link
                  href="/events"
                  className="bg-[#5B1D2E] hover:bg-[#481523] text-white font-medium px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg text-sm md:text-base tracking-wide"
                >
                  Join Our Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}