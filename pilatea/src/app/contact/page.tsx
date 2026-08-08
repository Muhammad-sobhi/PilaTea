"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { submitContact } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { getSetting } from "@/lib/utils";
import { BackButton } from "@/components/BackButton";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const settings = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitContact(form);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  const s = (key: string, fallback: string) => getSetting(settings, key, fallback);

  return (
    <div className="relative min-h-screen pt-28 pb-32 md:pb-40 mb-12 overflow-hidden">
      {/* Background image matching mockup contact.png */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src="/contact.png"
          alt="Studio Background"
          fill
          className="object-cover object-center brightness-[0.98]"
          priority
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 md:px-8">
        <BackButton />

        <ScrollReveal>
          <div className="mt-6 grid lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            {/* Left Card: Get In Touch (Glassy & Transparent Background) */}
            <div className="lg:col-span-5 bg-[#F7F2E9]/75 backdrop-blur-xl rounded-[28px] p-8 md:p-10 flex flex-col justify-between border border-[#EBE3D5]/80 shadow-xl">
              <div>
                <p className="text-[12px] tracking-[0.25em] font-semibold text-[#6E555C] uppercase mb-3">
                  {s("contact_heading", "GET IN TOUCH")}
                </p>
                
                <h1 
                  className="font-script text-4xl md:text-5xl lg:text-6xl text-[#5B1D2E] mb-8 leading-tight"
                  style={{
                    background: 'none',
                    WebkitBackgroundClip: 'unset',
                    WebkitTextFillColor: 'initial',
                    color: '#5B1D2E'
                  }}
                >
                  We'd Love to Hear From You
                </h1>

                {/* Contact details list */}
                <div className="space-y-6 text-[#5C4D56] text-sm md:text-base">
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-[#7A283E30] flex items-center justify-center text-[#5B1D2E] shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.29-5.111-3.577-6.401-6.401l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <span className="font-medium">{s("business_phone", "+1 (555) 123-4567")}</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-[#7A283E30] flex items-center justify-center text-[#5B1D2E] shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <span className="font-medium">{s("business_email", "hello@pilatea.com")}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-[#7A283E30] flex items-center justify-center text-[#5B1D2E] shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <span className="font-medium">{s("address", "Mississauga, ON, Canada")}</span>
                  </div>
                </div>
              </div>

              {/* Social Icons at bottom of left card */}
              <div className="mt-12 pt-6 flex items-center gap-5 text-[#5B1D2E]">
                {/* Instagram Icon */}
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-[#7A283E40] flex items-center justify-center hover:bg-[#5B1D2E] hover:text-white transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                {/* TikTok Icon */}
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-[#7A283E40] flex items-center justify-center hover:bg-[#5B1D2E] hover:text-white transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68 6.34 6.34 0 009.35 22a6.34 6.34 0 006.34-6.34V9.48a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.87-.91z"/>
                  </svg>
                </a>

                {/* Pinterest Icon */}
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-[#7A283E40] flex items-center justify-center hover:bg-[#5B1D2E] hover:text-white transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Card: Send Us a Message Form (Glassy & Transparent Background) */}
            <div className="lg:col-span-7 bg-[#F7F2E9]/75 backdrop-blur-xl rounded-[28px] p-8 md:p-10 flex flex-col justify-between border border-[#EBE3D5]/80 shadow-xl">
              <div>
                <h2 className="text-xl md:text-2xl font-medium text-center text-[#4A354F] mb-6">
                  Send Us a Message
                </h2>

                {sent ? (
                  <div className="text-center py-16">
                    <h3 className="font-semibold text-2xl text-[#5B1D2E] mb-2">Message Sent!</h3>
                    <p className="text-[#5C4D56]">Thank you for reaching out. We will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-100/90 backdrop-blur-sm text-red-700 text-xs rounded-xl">
                        {error}
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 rounded-2xl bg-[#EFE8DC]/60 backdrop-blur-md border border-[#E0D7C6]/80 text-[#4A354F] placeholder-[#8A7983] outline-none focus:border-[#5B1D2E] transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 rounded-2xl bg-[#EFE8DC]/60 backdrop-blur-md border border-[#E0D7C6]/80 text-[#4A354F] placeholder-[#8A7983] outline-none focus:border-[#5B1D2E] transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 rounded-2xl bg-[#EFE8DC]/60 backdrop-blur-md border border-[#E0D7C6]/80 text-[#4A354F] placeholder-[#8A7983] outline-none focus:border-[#5B1D2E] transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <textarea
                        placeholder="Message"
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 rounded-2xl bg-[#EFE8DC]/60 backdrop-blur-md border border-[#E0D7C6]/80 text-[#4A354F] placeholder-[#8A7983] outline-none focus:border-[#5B1D2E] transition-colors text-sm resize-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#5B1D2E] hover:bg-[#481523] text-white font-medium px-10 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg text-sm md:text-base tracking-wide disabled:opacity-50"
                      >
                        {submitting ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}