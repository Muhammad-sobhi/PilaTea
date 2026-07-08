import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSettings, submitContact } from '../utils/api';

export default function Footer() {
  const [settings, setSettings] = useState({});
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim() || !email.includes('@')) return;
    setSubMsg(null);
    try {
      await submitContact({
        name: 'Newsletter Subscriber',
        email: email.trim(),
        subject: 'Newsletter Subscription',
        message: 'Subscribed via footer newsletter',
      });
      setSubMsg('subscribed');
      setEmail('');
    } catch {
      setSubMsg('error');
    }
  };

  return (
    <footer className="glass" style={{ marginBottom: 26 }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 34px' }}>
        <div className="footer-grid">
        <div>
          <div className="brand" style={{ marginBottom: 14 }}>
            <img src="/Untitled.png" alt="PILATEA" className="logo-img" />
            {settings.site_name || 'PILATEA'}
          </div>
          <div className="script">{settings.site_tagline || 'Sip. Stretch. Glow.'}</div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/pilates-on-the-go">Pilates on the Go</Link>
          <Link href="/tea-experience">Tea Experience</Link>
        </div>

        <div>
          <h4>Support</h4>
          <Link href="/faq">FAQ</Link>
          {/* <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
          <p>Cancellation Policy</p> */}
        </div>

        <div>
          <h4>Stay Connected</h4>
          <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 14 }}>
            Subscribe for updates on events, tea drops, and wellness moments.
          </p>
          {subMsg === 'subscribed' ? (
            <p style={{ color: '#16a34a', fontSize: 14, fontWeight: 600 }}>Subscribed!</p>
          ) : subMsg === 'error' ? (
            <p style={{ color: '#dc2626', fontSize: 14 }}>Failed. Try again.</p>
          ) : (
            <div className="email-box">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              />
              <button className="btn" onClick={handleSubscribe}>➤</button>
            </div>
          )}
          <div style={{ marginTop: 14, fontSize: 14 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              {settings.instagram && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  {settings.instagram}
                </span>
              )}
              {settings.tiktok && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  {settings.tiktok}
                </span>
              )}
              {settings.facebook_url && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  {settings.facebook_url}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {settings.business_email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>✉️ {settings.business_email}</span>}
              {settings.business_phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>📱 {settings.business_phone}</span>}
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}