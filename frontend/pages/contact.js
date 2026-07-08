import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { submitContact, getSettings } from '../utils/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const s = (key, fallback) => settings[key] || fallback;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await submitContact(form);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
  };

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="text-center mb-16" data-aos="fade-up">
        <p className="font-parisienne text-3xl md:text-5xl text-[#d071c7] mb-4">{s('contact_heading', 'Get in Touch')}</p>
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-6">
          Contact{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">Us</span>
        </h1>
        <p className="text-lg opacity-70 max-w-xl mx-auto">
          {s('contact_description', 'Have a question or ready to book your first session? We would love to hear from you.')}
        </p>
      </section>

      <section className="grid lg:grid-cols-2 gap-8 mb-16" data-aos="fade-up">
        <GlassCard className="p-8">
          {sent ? (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">🎉</span>
              <h2 className="font-poppins text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="opacity-70">We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="font-poppins text-xl font-semibold mb-4">Send Us a Message</p>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#d071c7] outline-none transition-colors" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#d071c7] outline-none transition-colors" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#d071c7] outline-none transition-colors" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              <textarea placeholder="Your Message" rows="5" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#d071c7] outline-none transition-colors resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              <button type="submit" className="btn w-full">Send Message</button>
            </form>
          )}
        </GlassCard>

        <div className="space-y-6 stagger-children">
          <GlassCard className="p-6 flex items-center gap-4">
            <span className="text-3xl">📍</span>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm opacity-65">{s('address', 'Cozy home studio, 15 minutes from downtown')}</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <span className="text-3xl">📧</span>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm opacity-65">{s('business_email', 'hello@pilatea.com')}</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <span className="text-3xl">📱</span>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm opacity-65">{s('business_phone', '(555) 123-4567')}</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <span className="text-3xl">🕐</span>
            <div>
              <h3 className="font-semibold">Hours</h3>
              <p className="text-sm opacity-65">{s('business_hours', 'Mon-Fri: 6am-8pm · Sat: 7am-6pm · Sun: 8am-2pm')}</p>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}