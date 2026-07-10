"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Users, Activity, Coffee, Sparkles, Sun, Trees, Waves, Building, Briefcase, Calendar, Heart, MapPin, Flower2, Sunrise } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Loading } from "@/components/Loading";
import { getEvents, getTeaItems, getGallery } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { storageUrl, eventDateParts } from "@/lib/utils";
import type { Event, TeaItem, GalleryImage } from "@/lib/types";

const YogaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="4" r="2" />
    <path d="M12 6v8" />
    <path d="M6 9c2 .5 4 1.5 6 1.5s4-1 6-1.5" />
    <path d="M6 9a2 2 0 0 1-2-2v-1" />
    <path d="M18 9a2 2 0 0 0 2-2v-1" />
    <path d="M4 19c3-1.5 5-2.5 8-2.5s5 1 8 2.5" />
    <path d="M8 14.5c1.5 1 2.5 1.5 4 1.5s2.5-.5 4-1.5" />
  </svg>
);

const floatBubbles = [
  { Icon: YogaIcon, title: "Mindful Movement", top: "22%", left: "15%", delay: 0.7, duration: 10 },
  { Icon: Coffee, title: "Premium Tea", top: "25%", left: "70%", delay: 2.1, duration: 12 },
  { Icon: Sun, title: "Outdoor Wellness", top: "60%", left: "12%", delay: 0, duration: 9 },
  { Icon: Users, title: "Community & Connection", top: "62%", left: "68%", delay: 1.4, duration: 11 },
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [teaItems, setTeaItems] = useState<TeaItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [ready, setReady] = useState(false);
  const settings = useSettings();

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        getEvents<Event[]>().then(r => setEvents(r || [])).catch(() => {}),
        getTeaItems<TeaItem[]>().then(r => setTeaItems(r || [])).catch(() => {}),
        getGallery<GalleryImage[]>().then(r => setGallery(r || [])).catch(() => {}),
      ]).finally(() => setReady(true));
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const s = (key: string, fallback: string) => settings[key] || fallback;

  const getFeatureIcon = (emoji: string) => {
    switch (emoji) {
      case "🪷": return <YogaIcon width={24} height={24} />;
      case "🍵": return <Leaf size={24} strokeWidth={1.5} />;
      case "🌅": return <Sun size={24} strokeWidth={1.5} />;
      case "💗": return <Users size={24} strokeWidth={1.5} />;
      default: return <span>{emoji}</span>;
    }
  };

  const signatureBg = s("signature_bg_image", "");
  const signatureBgUrl = (signatureBg && signatureBg !== "[]" && signatureBg !== '""') ? storageUrl(signatureBg) : undefined;
  const overlayOpacity = s("signature_overlay_opacity", "0.5");

  const goSectionStyle = {
    ...(signatureBgUrl ? { "--go-bg-image": `url(${signatureBgUrl})` } : {}),
    "--go-overlay-opacity": overlayOpacity,
  } as React.CSSProperties;

  let values: Array<{ icon: string; title: string; text: string }> = [];
  try { 
    const rawValues = s("about_values", "");
    if (rawValues) {
      values = JSON.parse(rawValues);
    }
  } catch {}
  
  if (!values || values.length === 0) {
    values = [
      { icon: '🪷', title: 'Mindful Movement', text: 'Strengthen your body and calm your mind.' }, 
      { icon: '🍵', title: 'Premium Tea', text: 'Handcrafted teas made to nourish.' }, 
      { icon: '🌅', title: 'Outdoor Experiences', text: 'Pilates on the go in beautiful locations.' }, 
      { icon: '💗', title: 'Community', text: 'Connect with a like-minded wellness community.' }
    ];
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  if (!ready) return <Loading />;

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-grid">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {s("hero_heading", "PILATEA") === "PILATEA" ? (
              <>
                PILATE<span className="title-letter-a">A</span>
              </>
            ) : s("hero_heading", "PILATEA")}
          </motion.h1>
          <motion.div
            className="script"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >{s("site_tagline", "Sip. Stretch. Glow.")}</motion.div>
          <motion.h2
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >{s("hero_subtitle", "Pilates, Tea & Serenity Anywhere You Go.")}</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hero-desc"
          >{s("hero_description", "We blend the art of mindful movement with comforting tea experiences to nourish your body, mind, and soul.")}</motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Link href="/events" className="btn"><Calendar size={22} /> {s("hero_cta_1", "Book a Session")}</Link>
            <Link href="/about" className="btn btn-explore"><MapPin size={22} /> {s("hero_cta_2", "Explore Events")}</Link>
            <Link href="/tea-experience" className="btn btn-tea-experience"><Coffee size={22} /> {s("hero_cta_3", "Tea Experience")}</Link>
          </motion.div>
        </div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <div className="cup-stage">
            <motion.div
              className="big-bubble"
              animate={{ scale: [1, 1.04, 1], y: [0, -8, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bubble-highlight" />
              <div className="bubble-rimlight" />
            </motion.div>

            <motion.div
              className="bubble-logo"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src="/logo.png" alt="PILATEA" className="big-bubble-img" />
            </motion.div>

            {floatBubbles.map((b, i) => {
              const dir = i % 2 === 0 ? 1 : -1;
              return (
                <motion.div
                  key={b.title}
                  className="float-bubble"
                  style={{ top: b.top, left: b.left }}
                  animate={{
                    x: [0, dir * 18, 0],
                    y: [0, -22, 0],
                    rotate: [0, dir * 4, 0],
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: b.duration,
                    delay: b.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="float-bubble-shine" />
                  <b.Icon size={20} strokeWidth={1.5} className="relative" />
                  <span>{b.title}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {values.length > 0 && (
        <motion.div 
          className="hero-features-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {values.map((v, i) => (
            <div key={i} className="feature-card">
              <div className={`feature-icon-wrapper pastel-${i % 4}`}>
                {getFeatureIcon(v.icon)}
              </div>
              <div className="feature-text">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </section>

      <div className="content-grid">
        <ScrollReveal>
          <section className="panel glass">
            <div className="section-title">
              <h2>Upcoming <span className="script" style={{ margin: 0 }}>Events ✨</span></h2>
              <Link href="/events" className="btn text-sm">View All</Link>
            </div>
            {events.slice(0, 3).map((ev) => {
              const { month, day } = eventDateParts(ev.event_date);
              return (
                <Link key={ev.id} href={`/events/${ev.id}`} className="event-item" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="image-card">{ev.image ? <img src={storageUrl(ev.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="text-2xl opacity-40">&#x1F334;</span>}</div>
                  <div className="date-box"><span>{month}</span><strong>{day}</strong></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>{ev.title}</h3>
                    <p style={{ fontSize: 13, opacity: 0.7 }}>{ev.location_name} &middot; {ev.start_time}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs opacity-60">
                      <span>👤</span>
                      <span>{ev.capacity} spots left</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            {events.length === 0 && <p className="opacity-50 py-5">No upcoming events yet.</p>}
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <section className="panel glass">
            <div className="section-title">
              <h2>Tea Menu <span style={{ color: '#ff6b8b' }}>🩷</span></h2>
              <Link href="/tea-experience" className="btn text-sm">Full Menu</Link>
            </div>
            {teaItems.slice(0, 3).map((item) => (
              <div key={item.id} className="tea-item">
                <div className="image-card">{item.image ? <img src={storageUrl(item.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="text-2xl opacity-40">&#x1FAD5;</span>}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</h3>
                  <p style={{ fontSize: 13, opacity: 0.7 }} className="mb-1">{item.description}</p>
                  {item.price != null && <span className="tag">${item.price}</span>}
                  {item.category?.name && <span className="tag">{item.category.name}</span>}
                  {item.ingredients && item.ingredients.split(',').map((ing, idx) => (
                    <span key={idx} className={`tag tag-pastel-${idx % 3}`}>{ing.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
            {teaItems.length === 0 && <p className="opacity-50 py-5">Tea menu coming soon.</p>}
          </section>
        </ScrollReveal>
      </div>

      {gallery.length > 0 && (
        <ScrollReveal>
          <section className="panel glass" style={{ marginTop: 30 }}>
            <div className="section-title">
              <h2>{s("gallery_heading", "Moments Captured")}</h2>
              <Link href="/gallery" className="btn text-sm">View Gallery</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((img) => (
                <div key={img.id} className="glass-card p-2">
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#BFEAFF]/20 to-[#E8A6F4]/20 flex items-center justify-center overflow-hidden">
                    {img.image ? <img src={storageUrl(img.image)} alt={img.title || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="text-2xl opacity-40">&#x1F4F8;</span>}
                  </div>
                  <p className="text-xs font-medium mt-1.5 px-1 opacity-70">{img.title}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <section className="go-section">
          <div className="go-image-wrapper">
            <img src={signatureBgUrl || "hero-background.png?v=2"} alt="Pilates on the Go" />
          </div>
          <div className="go-content">
            <p className="go-label">{s("signature_label", "OUR SIGNATURE EXPERIENCE")}</p>
            <div className="script go-script">{s("signature_title", "Pilates on the Go")}</div>
            <h2>{s("signature_subtitle", "We bring Pilates to you.")}</h2>
            <p className="go-desc">{s("signature_description", "Different locations. Different vibes. Same good energy.")}</p>
            <div className="go-footer-row">
              <div className="location-icons">
                <div className="location-item">
                  <Trees size={22} strokeWidth={1.5} />
                  <span>Parks</span>
                </div>
                <div className="location-item">
                  <Waves size={22} strokeWidth={1.5} />
                  <span>Beaches</span>
                </div>
                <div className="location-item">
                  <Building size={22} strokeWidth={1.5} />
                  <span>Rooftops</span>
                </div>
                <div className="location-item">
                  <Briefcase size={22} strokeWidth={1.5} />
                  <span>Corporate</span>
                </div>
                <div className="location-item">
                  <Calendar size={22} strokeWidth={1.5} />
                  <span>Events</span>
                </div>
              </div>
              <Link href={s("signature_btn_link", "/pilates-on-the-go")} className="btn">
                {s("signature_btn_text", "Learn More")}
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="social-section glass">
          <motion.div variants={staggerItem} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{s("social_title", "Follow Our Journey")}</h2>
            <p className="opacity-70">{s("social_cta_text", "Join our community")}</p>
          </motion.div>
          <motion.div className="mini-gallery" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[1, 2, 3, 4, 5].map((num) => {
              const imgVal = s(`social_img_${num}`, "");
              const defaultImgs = [
                "/storage/gallery/tea-bar.jpg",
                "/storage/gallery/sunset.jpg",
                "/storage/gallery/studio.jpg",
                "/storage/gallery/group.jpg",
                "/storage/gallery/rooftop.jpg"
              ];
              const imgSrc = imgVal ? storageUrl(imgVal) : defaultImgs[num - 1];
              return (
                <motion.div key={num} variants={staggerItem} style={{ overflow: "hidden" }}>
                  <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </motion.div>
              );
            })}
          </motion.div>
          <motion.div variants={staggerItem} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex justify-center gap-5 mt-2">
              {settings.instagram && (
                <a href={settings.instagram.startsWith("http") ? settings.instagram : `https://instagram.com/${settings.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary transition-colors">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok.startsWith("http") ? settings.tiktok : `https://tiktok.com/@${settings.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary transition-colors">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </a>
              )}
              {settings.pinterest && (
                <a href={settings.pinterest.startsWith("http") ? settings.pinterest : `https://pinterest.com/${settings.pinterest.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary transition-colors">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 20c.5-2.7 1.7-6.2 2-7.5-.4-.7-.6-1.7-.6-2.5 0-1.2.7-2 1.5-2 .7 0 1 .5 1 1 0 .7-.4 1.7-.7 2.6-.2.8.4 1.4 1.1 1.4 1.4 0 2.4-1.8 2.4-4 0-1.6-1.1-2.8-3-2.8-2.2 0-3.6 1.6-3.6 3.5 0 .6.2 1.3.5 1.6.1.1.1.2 0 .4l-.3.9c-.1.2-.2.2-.4.1-1-.4-1.4-1.5-1.4-2.8 0-2.3 2-5 5.5-5 2.9 0 4.8 2.1 4.8 4.6 0 3-1.6 5.3-4 5.3-.8 0-1.5-.4-1.8-.9l-.5 1.9c-.2.7-.8 1.8-1.2 2.4"/></svg>
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url.startsWith("http") ? settings.facebook_url : `https://facebook.com/${settings.facebook_url}`} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary transition-colors">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
            </div>
          </motion.div>
        </section>
      </ScrollReveal>
    </div>
  );
}