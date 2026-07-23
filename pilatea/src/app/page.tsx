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

const getDayOfWeek = (dateStr?: string) => {
  if (!dateStr) return "SATURDAY";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "SATURDAY";
    return d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  } catch {
    return "SATURDAY";
  }
};

const formatFullDate = (dateStr?: string) => {
  if (!dateStr) return "JUNE 21, 2025";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "JUNE 21, 2025";
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
  } catch {
    return "JUNE 21, 2025";
  }
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [teaItems, setTeaItems] = useState<TeaItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [ready, setReady] = useState(false);
  const settings = useSettings();

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        getEvents().then(r => setEvents(Array.isArray(r) ? r : (r as any)?.data || [])).catch(() => { }),
        getTeaItems().then(r => setTeaItems(Array.isArray(r) ? r : (r as any)?.data || [])).catch(() => { }),
        getGallery().then(r => setGallery(Array.isArray(r) ? r : (r as any)?.data || [])).catch(() => { }),
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
  } catch { }

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
    <div>
      <section className="hero-flyer-container">
        <div className="flyer-card">
          {/* Top lake photo section */}
          <div
            className="flyer-photo-section"
            style={{ backgroundImage: `url('/pilatea/hero-background.png?v=5')`, backgroundPosition: 'center 60%' }}
          >
            {/* Spots Available Badge on top right */}
            <div className="flyer-spots-badge">
              <div className="flyer-spots-icons">
                <Users size={16} />
              </div>
              <div className="flyer-spots-num">32</div>
              <div className="flyer-spots-text">SPOTS AVAILABLE!</div>
            </div>

            {/* Logo, Title and subtitle container */}
            <div className="flyer-header">
              <div className="relative flex flex-col items-center justify-center min-h-[140px] w-full">
                {/* Dropping leaves animation */}
                <div className="absolute inset-0 pointer-events-none overflow-visible flex justify-center">
                  {[
                    { id: 1, left: "-45px", delay: 0, duration: 4.2, scale: 0.95, rotateEnd: 60, xOffset: -35 },
                    { id: 2, left: "40px", delay: 0.9, duration: 4.8, scale: 1.1, rotateEnd: -75, xOffset: 40 },
                    { id: 3, left: "-70px", delay: 1.8, duration: 5.2, scale: 0.8, rotateEnd: 90, xOffset: -25 },
                    { id: 4, left: "65px", delay: 2.7, duration: 4.5, scale: 1.0, rotateEnd: -50, xOffset: 30 },
                    { id: 5, left: "-10px", delay: 3.5, duration: 4.0, scale: 0.85, rotateEnd: 40, xOffset: -20 },
                    { id: 6, left: "15px", delay: 1.4, duration: 5.0, scale: 0.75, rotateEnd: -90, xOffset: 45 },
                  ].map((leaf) => (
                    <motion.div
                      key={leaf.id}
                      className="absolute top-2 text-[#5B1D2E]"
                      style={{ left: `calc(50% + ${leaf.left})` }}
                      animate={{
                        y: [0, 45, 100, 150],
                        x: [0, leaf.xOffset, -leaf.xOffset * 0.4, leaf.xOffset * 0.7],
                        opacity: [0, 0.85, 0.75, 0],
                        rotate: [0, leaf.rotateEnd * 0.5, leaf.rotateEnd],
                      }}
                      transition={{
                        duration: leaf.duration,
                        repeat: Infinity,
                        delay: leaf.delay,
                        ease: "easeInOut",
                      }}
                    >
                      <Leaf size={16 * leaf.scale} strokeWidth={1.5} fill="#5B1D2E" fillOpacity={0.2} />
                    </motion.div>
                  ))}
                </div>

                <motion.img
                  src="/pilatea/logo.png?v=2"
                  alt="PILATEA"
                  className="flyer-logo relative z-10"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <div className="flyer-brand-tagline">Sip. Stretch. Glow.</div>

              <h1 className="flyer-main-title">MAT PILATES</h1>
              <div className="flyer-cursive-title">
                in the Park <span className="flyer-heart-symbol">♥</span>
              </div>

              <div className="flyer-spaced-tagline">
                <div>MOVE. BREATHE. CONNECT.</div>
                <div>PILATES + TEA + COMMUNITY</div>
              </div>
            </div>
          </div>
          {/* Floating Events Bar over bottom of hero section (Shows 1 featured event with View All) */}
          <div className="w-full max-w-[1100px] px-4 mx-auto -mt-36 relative z-20">
            <div className="flex flex-col gap-3">
              {events.length > 0 ? (
                events.slice(0, 1).map((ev) => {
                  const dayName = getDayOfWeek(ev.event_date);
                  const fullDate = formatFullDate(ev.event_date);
                  return (
                    <div key={ev.id} className="event-line-bar">
                      <div className="event-line-item">
                        <div className="event-line-icon">
                          <MapPin size={18} />
                        </div>
                        <div className="event-line-text">
                          <strong>{(ev.location_name || "MARIE CURTIS PARK").toUpperCase()}</strong>
                          <span>{typeof ev.city === "string" ? ev.city : "Mississauga, ON"}</span>
                        </div>
                      </div>
                      <div className="event-line-item">
                        <div className="event-line-icon">
                          <Calendar size={18} />
                        </div>
                        <div className="event-line-text">
                          <strong>{dayName}</strong>
                          <span>{fullDate}</span>
                        </div>
                      </div>
                      <div className="event-line-item">
                        <div className="event-line-icon">
                          <Coffee size={18} />
                        </div>
                        <div className="event-line-text">
                          <strong>{ev.start_time ? `${ev.start_time} ${ev.end_time ? '– ' + ev.end_time : ''}` : "9:00 AM – 10:30 AM"}</strong>
                          <span>{typeof ev.checkin_time === "string" ? `Check-in ${ev.checkin_time}` : "Check-in 8:30 AM"}</span>
                        </div>
                      </div>
                      <div className="event-line-item flex justify-end">
                        <Link href="/events" className="btn-sm !py-2 !px-4 text-xs font-semibold whitespace-nowrap">
                          View All
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="event-line-bar">
                  <div className="event-line-item">
                    <div className="event-line-icon">
                      <MapPin size={18} />
                    </div>
                    <div className="event-line-text">
                      <strong>MARIE CURTIS PARK</strong>
                      <span>Mississauga, ON</span>
                    </div>
                  </div>
                  <div className="event-line-item">
                    <div className="event-line-icon">
                      <Calendar size={18} />
                    </div>
                    <div className="event-line-text">
                      <strong>SATURDAY</strong>
                      <span>JUNE 21, 2025</span>
                    </div>
                  </div>
                  <div className="event-line-item">
                    <div className="event-line-icon">
                      <Coffee size={18} />
                    </div>
                    <div className="event-line-text">
                      <strong>9:00 AM – 10:30 AM</strong>
                      <span>Check-in 8:30 AM</span>
                    </div>
                  </div>
                  <div className="event-line-item flex justify-end">
                    <Link href="/events" className="btn-sm !py-2 !px-4 text-xs font-semibold whitespace-nowrap">
                      View All
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="page" style={{ marginTop: 20 }}>

        <ScrollReveal delay={0.15}>
          <section className="flyer-tea-menu mt-8 mb-10">
            <div className="menu-header flex flex-col items-center gap-1 border-b border-[#5B1D2E]/10 pb-4 text-center">
              <strong className="text-xl text-[#5B1D2E] tracking-widest italic font-bold">TEA MENU</strong>
              <span className="text-xs text-[#5B1D2E]/70">Available for Purchase</span>
            </div>

            {teaItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {teaItems.map((item) => (
                  <div key={item.id} className="tea-card-item flex flex-col items-center text-center p-4 rounded-2xl bg-[#F1EADD] border border-[#5B1D2E]/15 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 mb-3 flex items-center justify-center overflow-hidden rounded-xl">
                      {item.image ? (
                        <img src={storageUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-4xl opacity-40">🍵</span>
                      )}
                    </div>
                    <strong className="text-sm text-[#5B1D2E] font-bold tracking-wider uppercase">{item.name}</strong>
                    <p className="text-xs text-[#5B1D2E]/80 my-1 line-clamp-2">{item.description || item.ingredients}</p>
                    {item.price != null && (
                      <span className="tea-price text-base font-bold text-[#5B1D2E] mt-1">${item.price}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="tea-items-grid mt-6">
                <div className="tea-card-item">
                  <img src="/pilatea/calm-bloom.png" alt="Calm Bloom" />
                  <strong>CALM BLOOM</strong>
                  <p>Lavender, Chamomile, Rose, Lemon Balm</p>
                  <span className="tea-price">$6</span>
                </div>
                <div className="tea-card-item">
                  <img src="/pilatea/matcha-glow.png" alt="Matcha Glow" />
                  <strong>MATCHA GLOW</strong>
                  <p>Ceremonial Matcha, Oat Milk, Vanilla</p>
                  <span className="tea-price">$7</span>
                </div>
                <div className="tea-card-item">
                  <img src="/pilatea/berry-balance.png" alt="Berry Balance" />
                  <strong>BERRY BALANCE</strong>
                  <p>Hibiscus, Mixed Berries, Mint, Lemon</p>
                  <span className="tea-price">$8</span>
                </div>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <Link href="/tea-experience" className="btn text-sm">
                View Full Tea Menu
              </Link>
            </div>
          </section>
        </ScrollReveal>

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
              <img src={signatureBgUrl || "hero-background.png"} alt="Pilates on the Go" />
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
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  </a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok.startsWith("http") ? settings.tiktok : `https://tiktok.com/@${settings.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary transition-colors">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                  </a>
                )}
                {settings.pinterest && (
                  <a href={settings.pinterest.startsWith("http") ? settings.pinterest : `https://pinterest.com/${settings.pinterest.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary transition-colors">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 20c.5-2.7 1.7-6.2 2-7.5-.4-.7-.6-1.7-.6-2.5 0-1.2.7-2 1.5-2 .7 0 1 .5 1 1 0 .7-.4 1.7-.7 2.6-.2.8.4 1.4 1.1 1.4 1.4 0 2.4-1.8 2.4-4 0-1.6-1.1-2.8-3-2.8-2.2 0-3.6 1.6-3.6 3.5 0 .6.2 1.3.5 1.6.1.1.1.2 0 .4l-.3.9c-.1.2-.2.2-.4.1-1-.4-1.4-1.5-1.4-2.8 0-2.3 2-5 5.5-5 2.9 0 4.8 2.1 4.8 4.6 0 3-1.6 5.3-4 5.3-.8 0-1.5-.4-1.8-.9l-.5 1.9c-.2.7-.8 1.8-1.2 2.4" /></svg>
                  </a>
                )}
                {settings.facebook_url && (
                  <a href={settings.facebook_url.startsWith("http") ? settings.facebook_url : `https://facebook.com/${settings.facebook_url}`} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary transition-colors">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  </a>
                )}
              </div>
            </motion.div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}