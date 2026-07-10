"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getGallery as fetchGallery } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { storageUrl } from "@/lib/utils";

interface GalleryImageData {
  id?: number;
  title?: string;
  image?: string;
  category?: string;
  alt_text?: string;
}

import { BackButton } from "@/components/BackButton";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImageData[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();

  useEffect(() => {
    fetchGallery<GalleryImageData[]>().then(r => setImages(r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(images.map(i => i.category).filter(Boolean) as string[])];
  const filtered = activeCategory === "all" ? images : images.filter(i => i.category === activeCategory);

  const s = (key: string, fallback: string) => settings[key] || fallback;

  if (loading) return <Loading text="Loading gallery..." />;

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="text-center mb-16">
          <p className="script" style={{ margin: "0 0 12px" }}>{s("gallery_heading", "Moments Captured")}</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Gallery</h1>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-10">
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map(cat => (
                <button key={cat} className={`px-5 py-2 rounded-full text-sm capitalize transition-colors ${activeCategory === cat ? "bg-white/20 font-semibold" : "bg-white/5 opacity-60 hover:opacity-100"}`}
                  onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
          )}
          {filtered.length === 0 && <p className="text-center opacity-50 py-12">No images in this category yet.</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                className="glass-card cursor-pointer group"
                onClick={() => setLightboxIndex(idx)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
              >
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-[#BFEAFF]/20 to-[#E8A6F4]/20 flex items-center justify-center overflow-hidden">
                  {img.image ? <img src={storageUrl(img.image)} alt={img.title || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <span className="text-6xl group-hover:scale-110 transition-transform duration-500">&#x1F4F8;</span>}
                </div>
                <p className="text-sm font-medium mt-2 px-1">{img.title}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxIndex(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-white text-3xl z-10 hover:opacity-70" onClick={() => setLightboxIndex(null)}>&times;</button>
            {filtered[lightboxIndex] && (
              <div className="glass-card">
                <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#BFEAFF]/20 to-[#E8A6F4]/20 flex items-center justify-center overflow-hidden">
                  {filtered[lightboxIndex].image ? <img src={storageUrl(filtered[lightboxIndex].image)} alt={filtered[lightboxIndex].title || ""} className="w-full h-full object-contain" /> : <span className="text-8xl">&#x1F4F8;</span>}
                </div>
                <p className="text-center font-medium mt-4 text-lg">{filtered[lightboxIndex].title}</p>
                <div className="flex justify-center gap-4 mt-4">
                  <button className="btn text-sm" onClick={() => setLightboxIndex(prev => (prev! - 1 + filtered.length) % filtered.length)}>&larr; Prev</button>
                  <button className="btn text-sm" onClick={() => setLightboxIndex(prev => (prev! + 1) % filtered.length)}>Next &rarr;</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}