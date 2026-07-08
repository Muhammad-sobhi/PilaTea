import Link from 'next/link';
import GlassCard from '../components/GlassCard';

export default function Custom404() {
  return (
    <div className="animate-fade-in text-center py-20">
      <div className="max-w-lg mx-auto">
        <span className="text-8xl block mb-6 animate-float">☕</span>
        <h1 className="font-poppins text-6xl font-bold mb-4">404</h1>
        <p className="text-xl opacity-60 mb-8">This page needs a stretch break — it doesn&apos;t exist.</p>
        <GlassCard className="p-8">
          <p className="mb-6 opacity-70">Let&apos;s guide you back to your mat.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn-primary">Home</Link>
            <Link href="/events" className="btn-secondary">Book a Session</Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
