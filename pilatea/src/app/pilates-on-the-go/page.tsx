"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackButton } from "@/components/BackButton";
import { useSettings } from "@/context/SettingsContext";
import { getSetting } from "@/lib/utils";

export default function PilatesOnTheGoPage() {
  const settings = useSettings();
  const s = (key: string, fallback: string) => getSetting(settings, key, fallback);

  return (
    <div className="relative min-h-screen pt-28 pb-32 md:pb-40 mb-12">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        <BackButton />

        {/* Top Hero Section matching go.png */}
        <ScrollReveal>
          <div className="mt-4 grid lg:grid-cols-12 gap-8 items-center mb-16">
            {/* Left Text Column */}
            <div className="lg:col-span-5 text-[#4A354F]">
              <p className="text-[12px] tracking-[0.25em] font-semibold text-[#6E555C] uppercase mb-3">
                {s("onthego_subheading", "PILATEA ON THE GO")}
              </p>

              <h1
                className="font-script text-5xl md:text-6xl lg:text-7xl text-[#5B1D2E] mb-6 leading-tight"
                style={{
                  background: "none",
                  WebkitBackgroundClip: "unset",
                  WebkitTextFillColor: "initial",
                  color: "#5B1D2E",
                }}
              >
                Pilates on the Go
              </h1>

              <p className="text-base md:text-lg text-[#5C4D56] leading-relaxed mb-8 max-w-lg">
                {s(
                  "onthego_description",
                  "We bring the studio to you. Perfect for those who prefer the comfort of their own space or cannot make it to our location."
                )}
              </p>

              <div>
                <Link
                  href="/contact"
                  className="inline-block bg-[#5B1D2E] hover:bg-[#481523] text-white font-medium px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg text-sm md:text-base tracking-wide"
                >
                  Book a Mobile Session
                </Link>
              </div>
            </div>

            {/* Right Photo & Overlay Box Column */}
            <div className="lg:col-span-7 relative">
              <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] rounded-[28px] overflow-hidden shadow-md border border-[#EBE3D5]">
                <Image
                  src="/go.png"
                  alt="PILATEA Mobile Reformer Van"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Floating Pill/Badge at bottom right matching go.png (Glassy & Transparent Background) */}
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-[#F7F2E9]/75 backdrop-blur-xl border border-[#EBE3D5]/80 rounded-2xl p-4 md:px-6 md:py-4 flex items-center gap-4 shadow-xl max-w-xs md:max-w-sm">
                <div className="w-12 h-12 rounded-xl bg-[#EFE8DC]/80 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-[#E0D7C6]/60">
                  🚐
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-[#4A354F] leading-snug">
                    Mobile Reformer Studio
                  </h3>
                  <p className="text-xs text-[#6A5A64]">
                    Delivered &amp; set up at your location
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* How It Works Section matching go.png */}
        <ScrollReveal>
          <div className="mt-8">
            {/* Header with floral accent line matching go.png */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-[#7A283E30]" />
                <h2 className="text-2xl md:text-3xl font-normal text-[#4A354F]">
                  How It Works
                </h2>
                <div className="h-[1px] w-12 bg-[#7A283E30]" />
              </div>
              <div className="text-[#5B1D2E] text-base mt-1">🌿</div>
            </div>

            {/* 3 Step Cards matching go.png */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-[#F7F2E9] rounded-[28px] p-8 text-center border border-[#EBE3D5] shadow-sm flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#5B1D2E] text-white font-semibold text-lg flex items-center justify-center mb-6 shadow-sm">
                  01
                </div>

                <div className="w-8 h-8 flex items-center justify-center text-[#5B1D2E] mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>

                <h3 className="font-bold text-base md:text-lg text-[#4A354F] mb-3">
                  Book
                </h3>

                <p className="text-xs md:text-sm text-[#6A5A64] leading-relaxed max-w-xs">
                  Choose your preferred time and location. We&apos;ll confirm your mobile session within 24 hours.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#F7F2E9] rounded-[28px] p-8 text-center border border-[#EBE3D5] shadow-sm flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#5B1D2E] text-white font-semibold text-lg flex items-center justify-center mb-6 shadow-sm">
                  02
                </div>

                <div className="w-8 h-8 flex items-center justify-center text-[#5B1D2E] mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>

                <h3 className="font-bold text-base md:text-lg text-[#4A354F] mb-3">
                  We Arrive
                </h3>

                <p className="text-xs md:text-sm text-[#6A5A64] leading-relaxed max-w-xs">
                  Our certified instructor brings a fully sanitized reformer and sets it up at your home or office.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#F7F2E9] rounded-[28px] p-8 text-center border border-[#EBE3D5] shadow-sm flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#5B1D2E] text-white font-semibold text-lg flex items-center justify-center mb-6 shadow-sm">
                  03
                </div>

                <div className="w-8 h-8 flex items-center justify-center text-[#5B1D2E] mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>

                <h3 className="font-bold text-base md:text-lg text-[#4A354F] mb-3">
                  You Glow
                </h3>

                <p className="text-xs md:text-sm text-[#6A5A64] leading-relaxed max-w-xs">
                  Enjoy a private or duet session in your own space. Tea included, of course!
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}