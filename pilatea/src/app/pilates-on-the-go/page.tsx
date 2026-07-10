"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

import { BackButton } from "@/components/BackButton";

export default function PilatesOnTheGoPage() {
  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="script" style={{ margin: "0 0 12px" }}>Mobile Studio</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">Pilates on the Go</h1>
            <p className="text-lg opacity-75 mb-8 max-w-xl">
              We bring the studio to you. Perfect for those who prefer the comfort of their own space or cannot make it to our location.
            </p>
            <Link href="/contact" className="btn">Book a Mobile Session</Link>
          </div>
          <div className="glass-panel p-10 text-center">
            <span className="text-8xl block mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🚐</span>
            <p className="font-semibold text-lg mb-2">Mobile Reformer Studio</p>
            <p className="text-sm opacity-65">Delivered &amp; set up at your location</p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Book", desc: "Choose your preferred time and location. We&apos;ll confirm your mobile session within 24 hours." },
              { step: "02", title: "We Arrive", desc: "Our certified instructor brings a fully sanitized reformer and sets it up at your home or office." },
              { step: "03", title: "You Glow", desc: "Enjoy a private or duet session in your own space. Tea included, of course!" },
            ].map(item => (
              <div key={item.step} className="glass-card text-center">
                <p className="text-5xl font-bold mb-4">{item.step}</p>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm opacity-65">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-20">
          <div className="glass-panel p-10 md:p-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Coverage Area</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm max-w-xl mx-auto">
              <p className="flex items-center gap-2">✨ Within 15 min of downtown</p>
              <p className="flex items-center gap-2">✨ Up to 30 min from downtown</p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}