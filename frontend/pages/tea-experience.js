import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassCard from '../components/GlassCard';
import { getTeaItems, getSettings } from '../utils/api';

export default function TeaExperience() {
  const [teas, setTeas] = useState([]);
  const [settings, setSettings] = useState({});

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const storageUrl = (path) => path ? `${baseUrl}/storage/${path}` : null;

  useEffect(() => {
    getTeaItems().then(r => setTeas(r || [])).catch(() => {});
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const s = (key, fallback) => settings[key] || fallback;

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="text-center mb-20" data-aos="fade-up">
        <p className="font-parisienne text-3xl md:text-5xl text-[#d071c7] mb-4">{s('tea_heading', 'Sip & Savor')}</p>
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-8">
          The{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">
            Tea Experience
          </span>
        </h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          {s('tea_description', 'Every PILATEA session ends with our signature tea ceremony. A moment to ground, reflect, and connect.')}
        </p>
      </section>

      <section className="mb-20" data-aos="fade-up">
        <h2 className="font-poppins text-4xl font-bold text-center mb-10">
          Our{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">Collection</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          {teas.map(t => (
            <GlassCard key={t.id}>
              <div className="w-full h-32 rounded-xl mb-3 bg-gradient-to-br from-[#BFEFFF]/20 to-[#F8D6E8]/20 flex items-center justify-center overflow-hidden">
                {t.image ? <img src={storageUrl(t.image)} alt={t.name} className="w-full h-full object-cover" /> : <span className="text-4xl">🍵</span>}
              </div>
              <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
              {t.category && <p className="text-sm font-medium text-[#d071c7] mb-2">{t.category.name}</p>}
              <p className="text-sm opacity-65 mb-2">{t.description}</p>
              {t.ingredients && <p className="text-xs opacity-50">Ingredients: {t.ingredients}</p>}
              <p className="text-sm font-semibold mt-2">${t.price}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mb-20" data-aos="fade-up">
        <div className="glass-card p-10 md:p-16 text-center">
          <h2 className="font-poppins text-3xl font-bold mb-6">The Ritual</h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <span className="text-4xl block mb-3">🫖</span>
              <h3 className="font-semibold mb-2">Mindful Brewing</h3>
              <p className="opacity-65">Watch as your tea is prepared with intention — temperature, steep time, and vessel chosen to match the leaf.</p>
            </div>
            <div>
              <span className="text-4xl block mb-3">🧘</span>
              <h3 className="font-semibold mb-2">Peaceful Pause</h3>
              <p className="opacity-65">Three deep breaths before the first sip. This is your moment of stillness after movement.</p>
            </div>
            <div>
              <span className="text-4xl block mb-3">💬</span>
              <h3 className="font-semibold mb-2">Quiet Connection</h3>
              <p className="opacity-65">Share the experience with fellow members or savor it solo. Tea time is your time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}