"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Send } from "lucide-react";
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
    <footer className="px-4 pb-8 sm:px-6 lg:px-12 mt-10">
      <div className="glass-panel glass-shine mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-8 rounded-[28px] p-6 sm:p-8 sm:grid-cols-2 lg:grid-cols-4 lg:p-14 lg:gap-10">
        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="PILATEA" width={80} height={38} className="h-[38px] w-[80px] object-contain" />
            <span className="font-heading text-[40px] font-semibold tracking-[3px] text-dark">
              {settings.site_name || "PILATEA"}
            </span>
          </div>
          <p className="mt-4 font-script text-[40px] leading-none text-primary">
            {settings.site_tagline || "Sip. Stretch. Glow."}
          </p>
          <p className="mt-4 max-w-xs text-[14px] text-dark/60">
            {/* Blending mindful movement with comforting tea since 2024. */}
          </p>
        </div>

        {/* Quick Links */}
        <div className="relative z-10">
          <h4 className="mb-4 text-[15px] font-semibold text-dark">Quick Links</h4>
          <ul className="flex flex-col gap-2.5">
            {[["Home", "/"], ["About", "/about"], ["Pilates on the Go", "/pilates-on-the-go"], ["Tea Experience", "/tea-experience"]].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-[14px] text-dark/60 transition-colors hover:text-primary">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="relative z-10">
          <h4 className="mb-4 text-[15px] font-semibold text-dark">Support</h4>
          <ul className="flex flex-col gap-2.5">
            {[["FAQ", "/faq"], ["Contact", "/contact"], ["Events", "/events"], ["Memberships", "/memberships"]].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-[14px] text-dark/60 transition-colors hover:text-primary">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Stay Connected */}
        <div className="relative z-10">
          <h4 className="mb-4 text-[15px] font-semibold text-dark">Stay Connected</h4>
          <p className="mb-3 text-[14px] text-dark/60">
            Subscribe for updates on events, tea drops, and wellness moments.
          </p>
          {subMsg === "subscribed" ? (
            <p className="text-green-600 text-[14px] font-semibold">Subscribed!</p>
          ) : subMsg === "error" ? (
            <p className="text-red-600 text-[14px]">Failed. Try again.</p>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/50 p-1.5">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-dark outline-none placeholder:text-dark/40"
              />
              <button
                onClick={handleSubscribe}
                aria-label="Subscribe"
                className="btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full !p-0"
              >
                <Send size={16} />
              </button>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3 text-[14px] text-dark/60">
            {settings.instagram && (
              <a href={settings.instagram.startsWith("http") ? settings.instagram : `https://instagram.com/${settings.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                {settings.instagram}
              </a>
            )}
            {settings.tiktok && (
              <a href={settings.tiktok.startsWith("http") ? settings.tiktok : `https://tiktok.com/@${settings.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                {settings.tiktok}
              </a>
            )}
            {settings.pinterest && (
              <a href={settings.pinterest.startsWith("http") ? settings.pinterest : `https://pinterest.com/${settings.pinterest.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 20c.5-2.7 1.7-6.2 2-7.5-.4-.7-.6-1.7-.6-2.5 0-1.2.7-2 1.5-2 .7 0 1 .5 1 1 0 .7-.4 1.7-.7 2.6-.2.8.4 1.4 1.1 1.4 1.4 0 2.4-1.8 2.4-4 0-1.6-1.1-2.8-3-2.8-2.2 0-3.6 1.6-3.6 3.5 0 .6.2 1.3.5 1.6.1.1.1.2 0 .4l-.3.9c-.1.2-.2.2-.4.1-1-.4-1.4-1.5-1.4-2.8 0-2.3 2-5 5.5-5 2.9 0 4.8 2.1 4.8 4.6 0 3-1.6 5.3-4 5.3-.8 0-1.5-.4-1.8-.9l-.5 1.9c-.2.7-.8 1.8-1.2 2.4" /></svg>
                {settings.pinterest}
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url.startsWith("http") ? settings.facebook_url : `https://facebook.com/${settings.facebook_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                Facebook
              </a>
            )}
            {settings.business_email && <span>{settings.business_email}</span>}
            {settings.business_phone && <span>{settings.business_phone}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}