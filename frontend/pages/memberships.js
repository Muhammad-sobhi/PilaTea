import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import GlassCard from '../components/GlassCard';
import { getMemberships, getSettings, purchaseMembership } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Memberships() {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [settings, setSettings] = useState({});
  const [billing, setBilling] = useState('monthly');
  const [purchasing, setPurchasing] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getMemberships().then(r => setPlans(r || [])).catch(() => {});
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const s = (key, fallback) => settings[key] || fallback;

  const handlePurchase = async (plan) => {
    if (!user) {
      router.push('/login?redirect=/memberships');
      return;
    }
    setPurchasing(plan.id);
    setMessage(null);
    try {
      const res = await purchaseMembership(plan.id);
      setMessage({ type: 'success', text: `Welcome to ${plan.name}! Your membership is active.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="text-center mb-16" data-aos="fade-up">
        <p className="font-parisienne text-3xl md:text-5xl text-[#d071c7] mb-4">{s('membership_heading', 'Choose Your Path')}</p>
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-6">
          Membership{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">Plans</span>
        </h1>
        <div className="inline-flex bg-white/5 rounded-full p-1 mb-6">
          <button className={`px-6 py-2 rounded-full transition-colors ${billing === 'monthly' ? 'bg-white/10 font-semibold' : 'opacity-60 hover:opacity-100'}`} onClick={() => setBilling('monthly')}>Monthly</button>
          <button className={`px-6 py-2 rounded-full transition-colors ${billing === 'annual' ? 'bg-white/10 font-semibold' : 'opacity-60 hover:opacity-100'}`} onClick={() => setBilling('annual')}>Annual <span className="text-xs text-green-400">Save ~15%</span></button>
        </div>
      </section>

      {message && (
        <div className={`max-w-md mx-auto mb-8 px-4 py-3 rounded-xl text-center text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.text}
        </div>
      )}

      <section className="grid md:grid-cols-3 gap-6 mb-16 items-stretch stagger-children">
        {plans.map(p => (
          <div key={p.id} className={`relative ${p.popular ? 'scale-105' : ''}`}>
            {p.popular && (
              <p className="text-center text-sm font-semibold text-[#d071c7] mb-3">{p.badge_text || 'Most Popular'}</p>
            )}
            <GlassCard className={`h-full flex flex-col ${p.popular ? 'ring-2 ring-[#d071c7]/40' : ''}`}>
              <h3 className="font-poppins text-2xl font-bold mb-1">{p.name}</h3>
              <p className="text-sm opacity-60 mb-4">{p.description}</p>
              <div className="mb-6">
                <span className="font-poppins text-5xl font-bold">${billing === 'monthly' ? p.price : Math.round(p.price * 12 * 0.85)}</span>
                <span className="opacity-60 text-sm">/month</span>
                {billing === 'annual' && <p className="text-xs opacity-50 mt-1">${Math.round(p.price * 12 * 0.85 * 12)}/year</p>}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(p.features || []).map((f, i) => <li key={i} className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> {f}</li>)}
              </ul>
              <button
                onClick={() => handlePurchase(p)}
                disabled={purchasing === p.id}
                className={`w-full py-3 rounded-full font-semibold transition-colors ${purchasing === p.id ? 'opacity-60 cursor-not-allowed' : ''} ${p.popular ? 'bg-gradient-to-r from-[#E7A6D8] to-[#CFA5E8] text-white' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {purchasing === p.id ? 'Processing...' : 'Get Started'}
              </button>
            </GlassCard>
          </div>
        ))}
      </section>
    </div>
  );
}
