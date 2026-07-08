import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassCard from '../components/GlassCard';
import { getSettings } from '../utils/api';

export default function About() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const s = (key, fallback) => settings[key] || fallback;

  let values = [];
  try { values = JSON.parse(s('about_values', '[]')); } catch { values = []; }

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="text-center mb-20" data-aos="fade-up">
        <p className="font-parisienne text-3xl md:text-5xl text-[#d071c7] mb-4">{s('about_heading', 'Our Story')}</p>
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-8">
          About{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">PILATEA</span>
        </h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg opacity-75">{s('about_content', 'Born from a love of movement and a passion for tea, PILATEA is where Pilates meets the soul-nourishing ritual of tea.')}</p>
        </div>
      </section>

      {values.length > 0 && (
        <section className="mb-20" data-aos="fade-up">
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-center mb-12">
            Our{' '}
            <span className="bg-gradient-to-r from-[#E7A6D8] to-[#CFA5E8] bg-clip-text text-transparent">Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {values.map((v, i) => (
              <GlassCard key={i} className="text-center">
                <span className="text-5xl block mb-4">{v.icon}</span>
                <h3 className="font-semibold text-lg mb-3">{v.title}</h3>
                <p className="text-sm opacity-65">{v.text}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      <section className="mb-20" data-aos="fade-up">
        <div className="glass-card p-10 md:p-16 text-center">
          <span className="text-6xl block mb-4">🏡</span>
          <h2 className="font-poppins text-4xl md:text-5xl font-bold mb-6">Visit Our Studio</h2>
          <p className="text-lg opacity-70 max-w-xl mx-auto mb-3">{s('address', 'Located in a cozy home setting, just 15 minutes from downtown.')}</p>
          <div className="flex gap-4 justify-center mt-6">
            <Link href="/events" className="btn">Book a Session</Link>
            <Link href="/contact" className="btn-ghost">Get Directions</Link>
          </div>
        </div>
      </section>
    </div>
  );
}