"use client";

import { useState } from "react";
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
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="text-center mb-16">
          <p className="script" style={{ margin: "0 0 12px" }}>{s("contact_heading", "Get in Touch")}</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto">
            {s("contact_description", "Have a question or ready to book your first session? We would love to hear from you.")}
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8">
            {sent ? (
              <div className="text-center py-12">
                <h2 className="font-semibold text-2xl mb-2">Message Sent!</h2>
                <p className="opacity-70">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xl font-semibold mb-4">Send Us a Message</p>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-primary)] outline-none transition-colors" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-primary)] outline-none transition-colors" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-primary)] outline-none transition-colors" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-primary)] outline-none transition-colors resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                <button type="submit" disabled={submitting} className="btn w-full disabled:opacity-50">{submitting ? "Sending..." : "Send Message"}</button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-sm opacity-65">{s("address", "Cozy home studio, 15 minutes from downtown")}</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm opacity-65">{s("business_email", "hello@pilatea.com")}</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-sm opacity-65">{s("business_phone", "(555) 123-4567")}</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Hours</h3>
                <p className="text-sm opacity-65">{s("business_hours", "Mon-Fri: 6am-8pm &middot; Sat: 7am-6pm &middot; Sun: 8am-2pm")}</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}