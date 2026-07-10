"use client";

import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getTeaItems } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { storageUrl } from "@/lib/utils";
import type { TeaItem } from "@/lib/types";

import { BackButton } from "@/components/BackButton";

export default function TeaExperiencePage() {
  const [teas, setTeas] = useState<TeaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();

  useEffect(() => {
    getTeaItems<TeaItem[]>().then(r => setTeas(r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const s = (key: string, fallback: string) => settings[key] || fallback;

  if (loading) return <Loading text="Loading tea menu..." />;

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="text-center mb-20">
          <p className="script" style={{ margin: "0 0 12px" }}>{s("tea_heading", "Sip & Savor")}</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">The Tea Experience</h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            {s("tea_description", "Every PILATEA session ends with our signature tea ceremony. A moment to ground, reflect, and connect.")}
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-10">Our Collection</h2>
          {teas.length === 0 && <p className="text-center opacity-50 py-12">No tea items available yet. Check back soon!</p>}
          <div className="grid md:grid-cols-3 gap-6">
            {teas.map(t => (
              <div key={t.id} className="glass-card">
                <div className="w-full h-64 rounded-xl mb-3 bg-gradient-to-br from-[#BFEAFF]/20 to-[#E8A6F4]/20 flex items-center justify-center overflow-hidden">
                  {t.image ? <img src={storageUrl(t.image)} alt={t.name} className="w-full h-full object-cover" /> : <span className="text-4xl">&#x1FAD5;</span>}
                </div>
                <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
                {t.category && <p className="text-sm font-medium text-[var(--color-primary)] mb-2">{t.category.name}</p>}
                <p className="text-sm opacity-65 mb-2">{t.description}</p>
                {t.ingredients && <p className="text-xs opacity-50">Ingredients: {t.ingredients}</p>}
                {t.price != null && <p className="text-sm font-semibold mt-2">${t.price}</p>}
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-20">
          <div className="glass-panel p-10 md:p-16 text-center">
            <h2 className="text-3xl font-bold mb-6">The Ritual</h2>
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Mindful Brewing</h3>
                <p className="opacity-65">Watch as your tea is prepared with intention &mdash; temperature, steep time, and vessel chosen to match the leaf.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Peaceful Pause</h3>
                <p className="opacity-65">Three deep breaths before the first sip. This is your moment of stillness after movement.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quiet Connection</h3>
                <p className="opacity-65">Share the experience with fellow members or savor it solo. Tea time is your time.</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}