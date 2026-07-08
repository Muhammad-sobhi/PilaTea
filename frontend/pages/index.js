import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents, getTeaItems, getGallery, getBanners, getSettings } from '../utils/api';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [teaItems, setTeaItems] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    getEvents().then(r => setEvents(r || [])).catch(() => {});
    getTeaItems().then(r => setTeaItems(r || [])).catch(() => {});
    getGallery().then(r => setGallery(r || [])).catch(() => {});
    getBanners().then(r => setBanners(r || [])).catch(() => {});
    getSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  const s = (key, fallback) => settings[key] || fallback;

  let values = [];
  try { values = JSON.parse(s('about_values', '[]')); } catch { values = []; }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const storageUrl = (path) => path ? `${baseUrl}/storage/${path}` : null;

  const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  return (
    <div className="page">
      <section className="hero" style={{ paddingTop: 120 }}>
        <div>
          <h1>{s('site_name', 'PILATEA')}</h1>
          <div className="script">{s('site_tagline', 'Sip. Stretch. Glow.')}</div>
          <h2>{s('hero_subtitle', 'Pilates, Tea & Serenity Anywhere You Go.')}</h2>
          <p>{s('hero_description', 'We blend mindful movement with comforting tea experiences to nourish your body, mind, and soul.')}</p>
          <div className="hero-actions">
            <Link href="/events" className="btn">{s('hero_cta_1', 'Book a Session')}</Link>
            <Link href="/events" className="btn">{s('hero_cta_2', 'Explore Events')}</Link>
            <Link href="/tea-experience" className="btn">{s('hero_cta_3', 'Tea Experience')}</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orb"></div>
          <div className="cup-character">
            <div className="steam">≋<br />≋</div>
            <div className="face">⌒ ⌒</div>
            <div className="smile"></div>
          </div>
        </div>
      </section>

      {values.length > 0 && (
        <section className="feature-row glass">
          {values.map((v, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </section>
      )}

      <div className="content-grid">
        <section className="panel glass">
          <div className="section-title">
            <h2>Upcoming <span className="script" style={{ margin: 0 }}>Events</span></h2>
            <Link href="/events" className="btn" style={{ fontSize: 13, padding: '10px 20px' }}>View All</Link>
          </div>
          {events.slice(0, 3).map(ev => {
            const d = ev.event_date ? new Date(ev.event_date + 'T00:00:00') : null;
            const month = d ? monthNames[d.getMonth()] : '';
            const day = d ? d.getDate() : '';
            return (
              <Link key={ev.id} href={`/events/${ev.id}`} className="event-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="image-card">{ev.image ? <img src={storageUrl(ev.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌴'}</div>
                <div className="date-box"><span>{month}</span><strong>{day}</strong></div>
                <div>
                  <h3 style={{ fontSize: 16 }}>{ev.title}</h3>
                  <p style={{ fontSize: 13, opacity: 0.7 }}>{ev.location_name} · {ev.start_time}</p>
                  <small style={{ fontSize: 12, opacity: 0.5 }}>{ev.capacity} spots left</small>
                </div>
              </Link>
            );
          })}
          {events.length === 0 && <p style={{ opacity: 0.5, padding: 20 }}>No upcoming events yet.</p>}
        </section>

        <section className="panel glass">
          <div className="section-title">
            <h2>Tea Menu 🫖</h2>
            <Link href="/tea-experience" className="btn" style={{ fontSize: 13, padding: '10px 20px' }}>Full Menu</Link>
          </div>
          {teaItems.slice(0, 3).map(item => (
            <div key={item.id} className="tea-item">
              <div className="image-card">{item.image ? <img src={storageUrl(item.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍵'}</div>
              <div>
                <h3 style={{ fontSize: 16 }}>{item.name}</h3>
                <p style={{ fontSize: 13, opacity: 0.7 }}>{item.description}</p>
                <span className="tag">${item.price}</span>
                {item.category && <span className="tag">{item.category.name}</span>}
              </div>
            </div>
          ))}
          {teaItems.length === 0 && <p style={{ opacity: 0.5, padding: 20 }}>Tea menu coming soon.</p>}
        </section>
      </div>

      {gallery.length > 0 && (
        <section className="panel glass" style={{ marginTop: 30 }}>
          <div className="section-title">
            <h2>{s('gallery_heading', 'Moments Captured')} </h2>
            <Link href="/gallery" className="btn" style={{ fontSize: 13, padding: '10px 20px' }}>View Gallery</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.slice(0, 4).map(img => (
              <div key={img.id} className="glass-card p-2">
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-[#BFEFFF]/20 to-[#F8D6E8]/20 flex items-center justify-center overflow-hidden">
                  {img.image ? <img src={storageUrl(img.image)} alt={img.alt_text || img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📸'}
                </div>
                <p className="text-xs font-medium mt-1 px-1 opacity-70">{img.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {banners.length > 0 && (
        <section className="panel glass" style={{ marginTop: 30 }}>
          <div className="section-title">
            <h2>{s('banners_heading', 'Featured')} </h2>
          </div>
          <div className="glass-card p-6 text-center" data-aos="fade-up">
            <p className="font-parisienne text-3xl text-[#d071c7] mb-2">{banners[bannerIdx].title}</p>
            <p className="text-lg opacity-75">{banners[bannerIdx].subtitle}</p>
            {banners.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {banners.map((_, i) => (
                  <button key={i} onClick={() => setBannerIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === bannerIdx ? 'bg-[#d071c7] w-6' : 'bg-white/30'}`} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="go-section glass">
        <div className="go-image"></div>
        <div className="go-content">
          <p style={{ fontSize: 12, letterSpacing: 2, fontWeight: 600, marginBottom: 4 }}>{s('signature_label', 'OUR SIGNATURE EXPERIENCE')}</p>
          <div className="script" style={{ margin: '8px 0' }}>{s('signature_title', 'Pilates on the Go')}</div>
          <h2>{s('signature_subtitle', 'We bring Pilates to you.')}</h2>
          <p>{s('signature_description', 'Different locations. Different vibes. Same good energy.')}</p>
          <div className="location-icons">
            <span>🌳 Parks</span>
            <span>🌊 Beaches</span>
            <span>🏙️ Rooftops</span>
            <span>💼 Corporate</span>
            <span>📅 Events</span>
          </div>
          <Link href="/pilates-on-the-go" className="btn">Learn More</Link>
        </div>
      </section>

      <section className="social-section glass">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{s('social_title', 'Follow Our Journey')} 💗</h2>
          <p style={{ opacity: 0.7 }}>{s('social_cta_text', 'Join our community')}</p>
        </div>
        <div className="mini-gallery">
          <div>🍵</div>
          <div>🧘‍♀️</div>
          <div>🧋</div>
          <div>🌊</div>
          <div>🫖</div>
        </div>
        <div>
          <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 10 }}>{s('social_cta_text', 'Join our community')}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 28, marginTop: 6 }}>
            {settings.instagram && (
              <a href={`https://instagram.com/${settings.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'transform 0.2s', display: 'inline-flex' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            )}
            {settings.tiktok && (
              <a href={`https://tiktok.com/@${settings.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'transform 0.2s', display: 'inline-flex' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url.startsWith('http') ? settings.facebook_url : `https://${settings.facebook_url}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'transform 0.2s', display: 'inline-flex' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}