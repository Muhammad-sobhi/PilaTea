import Link from 'next/link';
import GlassCard from '../components/GlassCard';

export default function PilatesOnTheGo() {
  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="grid lg:grid-cols-2 gap-12 items-center mb-20" data-aos="fade-up">
        <div data-aos="fade-right">
          <p className="font-parisienne text-3xl md:text-5xl text-[#d071c7] mb-4">Mobile Studio</p>
          <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-8">
            Pilates{' '}
            <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">
              on the Go
            </span>
          </h1>
          <p className="text-lg opacity-75 mb-8 max-w-xl">
            We bring the studio to you. Perfect for those who prefer the comfort of their own space or cannot make it to our location.
          </p>
          <Link href="/contact" className="btn">Book a Mobile Session</Link>
        </div>
        <div className="glass-card p-10 text-center" data-aos="fade-left">
          <span className="text-8xl block mb-4 animate-float">🚐</span>
          <p className="font-semibold text-lg mb-2">Mobile Reformer Studio</p>
          <p className="text-sm opacity-65">Delivered & set up at your location</p>
        </div>
      </section>

      <section className="mb-20" data-aos="fade-up">
        <h2 className="font-poppins text-4xl font-bold text-center mb-10">
          How It{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] to-[#CFA5E8] bg-clip-text text-transparent">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          {[
            { step: '01', title: 'Book', desc: 'Choose your preferred time and location. We\'ll confirm your mobile session within 24 hours.' },
            { step: '02', title: 'We Arrive', desc: 'Our certified instructor brings a fully sanitized reformer and sets it up at your home or office.' },
            { step: '03', title: 'You Glow', desc: 'Enjoy a private or duet session in your own space. Tea included, of course!' },
          ].map(item => (
            <GlassCard key={item.step} className="text-center">
              <p className="font-poppins text-5xl font-bold bg-gradient-to-r from-[#E7A6D8] to-[#BFEFFF] bg-clip-text text-transparent mb-4">{item.step}</p>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm opacity-65">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mb-20" data-aos="fade-up">
        <div className="glass-card p-10 md:p-16">
          <h2 className="font-poppins text-3xl font-bold mb-6 text-center">Coverage Area</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm max-w-xl mx-auto">
            <p className="flex items-center gap-2">✨ Within 15 min of downtown</p>
            <p className="flex items-center gap-2">✨ Up to 30 min from downtown</p>
          </div>
        </div>
      </section>
    </div>
  );
}
