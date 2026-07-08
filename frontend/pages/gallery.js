import { useState, useEffect } from 'react';
import { getGallery as fetchGallery, getSettings } from '../utils/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const storageUrl = (path) => path ? `${baseUrl}/storage/${path}` : null;

  useEffect(() => {
    fetchGallery().then(r => setImages(r || [])).catch(() => {});
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const categories = ['all', ...new Set(images.map(i => i.category).filter(Boolean))];
  const filtered = activeCategory === 'all' ? images : images.filter(i => i.category === activeCategory);

  const openLightbox = idx => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex(prev => (prev + 1) % filtered.length);
  const prevImage = () => setLightboxIndex(prev => (prev - 1 + filtered.length) % filtered.length);

  const s = (key, fallback) => settings[key] || fallback;

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="text-center mb-16" data-aos="fade-up">
        <p className="font-parisienne text-3xl md:text-5xl text-[#d071c7] mb-4">{s('gallery_heading', 'Moments Captured')}</p>
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-6">
          Our{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">Gallery</span>
        </h1>
      </section>

      <section className="mb-10" data-aos="fade-up">
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map(cat => (
              <button key={cat} className={`px-5 py-2 rounded-full text-sm capitalize transition-colors ${activeCategory === cat ? 'bg-white/20 font-semibold' : 'bg-white/5 opacity-60 hover:opacity-100'}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
          {filtered.map((img, idx) => (
            <div key={img.id || idx} className="glass-card p-2 cursor-pointer group" onClick={() => openLightbox(idx)}>
              <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-[#BFEFFF]/20 to-[#F8D6E8]/20 flex items-center justify-center overflow-hidden">
                {img.image ? <img src={storageUrl(img.image)} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="text-6xl group-hover:scale-110 transition-transform duration-500">📸</div>}
              </div>
              <p className="text-sm font-medium mt-2 px-1">{img.title}</p>
            </div>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-white text-3xl z-10 hover:opacity-70" onClick={closeLightbox}>&times;</button>
            {filtered[lightboxIndex] && (
              <div className="glass-card p-4">
                <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#BFEFFF]/20 to-[#F8D6E8]/20 flex items-center justify-center overflow-hidden">
                  {filtered[lightboxIndex].image ? <img src={storageUrl(filtered[lightboxIndex].image)} alt={filtered[lightboxIndex].title} className="w-full h-full object-contain" /> : <div className="text-8xl">📸</div>}
                </div>
                <p className="text-center font-medium mt-4 text-lg">{filtered[lightboxIndex].title}</p>
                <div className="flex justify-center gap-4 mt-4">
                  <button className="btn text-sm" onClick={prevImage}>← Prev</button>
                  <button className="btn text-sm" onClick={nextImage}>Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}