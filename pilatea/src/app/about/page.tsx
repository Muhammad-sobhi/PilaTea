"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackButton } from "@/components/BackButton";
import { useSettings } from "@/context/SettingsContext";

export default function AboutPage() {
  const settings = useSettings();

  const s = (key: string, fallback: string) => settings[key] || fallback;

  let values: Array<{ icon: string; title: string; text: string }> = [];
  try { values = JSON.parse(s("about_values", "[]")); } catch { values = []; }

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="text-center mb-20">
          <p className="script" style={{ margin: "0 0 12px" }}>{s("about_heading", "Our Story")}</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">About PILATEA</h1>
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg opacity-75">{s("about_content", "Born from a love of movement and a passion for tea, PILATEA is where Pilates meets the soul-nourishing ritual of tea.")}</p>
          </div>
        </section>
      </ScrollReveal>

      {values.length > 0 && (
        <ScrollReveal>
          <section className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div key={i} className="glass-card text-center">
                  <span className="text-5xl block mb-4">{v.icon}</span>
                  <h3 className="font-semibold text-lg mb-3">{v.title}</h3>
                  <p className="text-sm opacity-65">{v.text}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <section className="mb-20">
          <div className="glass-panel p-10 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Visit Our Studio</h2>
            <p className="text-lg opacity-70 max-w-xl mx-auto mb-3">{s("address", "Located in a cozy home setting, just 15 minutes from downtown.")}</p>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Link href="/events" className="btn">Book a Session</Link>
              <Link href="/contact" className="btn">Get Directions</Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}