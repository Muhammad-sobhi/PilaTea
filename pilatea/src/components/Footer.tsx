"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { submitContact } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

export function Footer() {
  const settings = useSettings();
  const [email, setEmail] = useState("");
  const [subMsg, setSubMsg] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!email.trim() || !email.includes("@")) return;
    setSubMsg(null);
    try {
      await submitContact({
        name: "Newsletter Subscriber",
        email: email.trim(),
        subject: "Newsletter Subscription",
        message: "Subscribed via footer newsletter",
      });
      setSubMsg("subscribed");
      setEmail("");
    } catch {
      setSubMsg("error");
    }
  };

  return (
    <footer className="w-full relative py-12 px-4 sm:px-6 lg:px-8 bg-[#F7F2E9]">
      {/* Outer Card Container matching mockup exactly */}
      <div className="max-w-[1320px] mx-auto rounded-[36px] overflow-hidden shadow-2xl bg-[#5B1D2E] text-[#F7F2E9]">
        {/* Top Image Banner Section */}
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] bg-[#EFE8DC]">
          <Image
            src="/footer.png"
            alt="PILATEA Studio"
            fill
            className="object-cover object-center brightness-[0.98]"
            priority
          />

          {/* Organic Wave Transition into Burgundy Footer */}
          <div className="absolute left-0 right-0 bottom-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
            <svg
              className="relative block w-full h-16 sm:h-24 md:h-28 text-[#5B1D2E]"
              viewBox="0 0 1440 120"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M0,60 C320,120 720,10 1440,60 L1440,120 L0,120 Z" />
            </svg>
          </div>
        </div>

        {/* Lower Burgundy Content Section */}
        <div className="px-6 sm:px-10 lg:px-14 pt-4 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-[#F7F2E9]/20">
            {/* Column 1: Brand & Logo */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <Link href="/" className="inline-block mb-3">
                  <img
                    src="/logo-cream.png"
                    alt="PILATEA"
                    className="h-16 md:h-20 w-auto object-contain"
                  />
                </Link>

                <p
                  className="font-script text-3xl sm:text-4xl text-[#F7F2E9] mt-1 mb-6"
                  style={{
                    background: "none",
                    WebkitBackgroundClip: "unset",
                    WebkitTextFillColor: "#F7F2E9",
                    color: "#F7F2E9",
                  }}
                >
                  {settings.site_tagline || "Sip. Stretch. Glow."}
                </p>
              </div>

              {/* Circular Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href={
                    settings.instagram && settings.instagram.startsWith("http")
                      ? settings.instagram
                      : `https://instagram.com/${(settings.instagram || "").replace("@", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#F7F2E9]/40 flex items-center justify-center text-[#F7F2E9] hover:bg-[#F7F2E9] hover:text-[#5B1D2E] transition-all"
                  aria-label="Instagram"
                >
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
                <a
                  href={
                    settings.facebook_url && settings.facebook_url.startsWith("http")
                      ? settings.facebook_url
                      : `https://facebook.com/${settings.facebook_url || ""}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#F7F2E9]/40 flex items-center justify-center text-[#F7F2E9] hover:bg-[#F7F2E9] hover:text-[#5B1D2E] transition-all"
                  aria-label="Facebook"
                >
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a
                  href={`mailto:${settings.business_email || "hello@pilatea.com"}`}
                  className="w-10 h-10 rounded-full border border-[#F7F2E9]/40 flex items-center justify-center text-[#F7F2E9] hover:bg-[#F7F2E9] hover:text-[#5B1D2E] transition-all"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-semibold text-[#F7F2E9] uppercase tracking-[0.2em] mb-5">
                QUICK LINKS
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#F7F2E9]/85">
                {[
                  ["Home", "/"],
                  ["About", "/about"],
                  ["Pilates on the Go", "/pilates-on-the-go"],
                  ["Tea Experience", "/tea-experience"],
                  ["Events", "/events"],
                  ["Memberships", "/memberships"],
                  ["Contact", "/contact"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                    >
                      <span className="text-xs text-[#F7F2E9]/60 group-hover:text-white">
                        🍃
                      </span>
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-semibold text-[#F7F2E9] uppercase tracking-[0.2em] mb-5">
                SUPPORT
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#F7F2E9]/85">
                {[
                  ["FAQ", "/faq"],
                  ["Terms of Service", "/terms"],
                  ["Privacy Policy", "/privacy"],
                  ["Cancellation Policy", "/cancellation"],
                  ["Returns & Refunds", "/returns"],
                  ["Accessibility", "/accessibility"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                    >
                      <span className="text-xs text-[#F7F2E9]/60 group-hover:text-white">
                        🍃
                      </span>
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Stay Connected & Contact Details */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-semibold text-[#F7F2E9] uppercase tracking-[0.2em] mb-3">
                STAY CONNECTED
              </h4>
              <p className="text-xs text-[#F7F2E9]/80 leading-relaxed mb-4">
                Subscribe to receive updates on new classes, events and offers.
              </p>

              {/* Email Input Field with Floating Send Button */}
              {subMsg === "subscribed" ? (
                <p className="text-emerald-300 text-xs font-medium mb-5">
                  ✓ Subscribed successfully!
                </p>
              ) : (
                <div className="relative mb-5">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    className="w-full bg-[#481523]/80 border border-[#F7F2E9]/20 rounded-full py-2.5 pl-4 pr-11 text-xs text-[#F7F2E9] placeholder:text-[#F7F2E9]/50 focus:outline-none focus:border-[#F7F2E9]/50 transition-all"
                  />
                  <button
                    onClick={handleSubscribe}
                    aria-label="Subscribe"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F7F2E9]/20 hover:bg-[#F7F2E9] text-[#F7F2E9] hover:text-[#5B1D2E] flex items-center justify-center transition-colors"
                  >
                    <Send size={13} />
                  </button>
                </div>
              )}

              {/* Direct Contact Details */}
              <ul className="space-y-2.5 text-xs text-[#F7F2E9]/85">
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="shrink-0 text-[#F7F2E9]/70" />
                  <span>{settings.business_email || "hello@pilatea.com"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="shrink-0 text-[#F7F2E9]/70" />
                  <span>{settings.business_phone || "(123) 456 - 7890"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="shrink-0 text-[#F7F2E9]/70 mt-0.5" />
                  <span>
                    {settings.business_address ||
                      "123 Wellness Way, Suite 100\nMindful City, MC 12345"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar with Center Leaf Accent matching mockup */}
          <div className="pt-6 text-center relative flex items-center justify-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5B1D2E] px-4 text-[#F7F2E9]/60 text-base">
              🌿
            </div>
            <p className="text-[11px] text-[#F7F2E9]/70">
              © {new Date().getFullYear()} Pilatea. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}