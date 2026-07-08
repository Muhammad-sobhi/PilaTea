import { useState } from 'react';

const faqData = [
  { q: 'What should I wear to a Pilates session?', a: 'Wear comfortable, form-fitting clothing that allows you to move freely. Avoid loose clothing that could get caught in the reformer. Grip socks are recommended.' },
  { q: 'Do I need prior Pilates experience?', a: 'Not at all! We welcome beginners and offer introductory sessions to get you comfortable with the equipment and foundational movements.' },
  { q: 'What is the tea ceremony like?', a: 'After your session, we invite you to a quiet tea ritual. We brew a selection of artisanal teas served in beautiful vessels. It is a moment to relax, reflect, and connect.' },
  { q: 'How long are the sessions?', a: 'Private sessions are 50 minutes. Small group classes are 55 minutes. Add about 15 minutes for the tea ceremony after your session.' },
  { q: 'What is your cancellation policy?', a: 'We require 24-hour notice for cancellations. Late cancellations or no-shows may result in a charge to your account.' },
  { q: 'Can I purchase gift certificates?', a: 'Yes! Gift certificates are available for single sessions, class packages, and tea experiences. Contact us for details.' },
  { q: 'Do you offer corporate or group events?', a: 'Absolutely! We can bring the mobile studio to your office for team-building events or host private group sessions at our studio.' },
  { q: 'Is the studio accessible?', a: 'Our home studio has a ramp entrance and ground-level access to all amenities. Please let us know if you have specific accessibility needs so we can accommodate you.' },
  { q: 'What is the mobile service coverage area?', a: 'We serve locations within 30 minutes of downtown. Additional travel fees may apply for further distances.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="text-center mb-16" data-aos="fade-up">
        <p className="font-parisienne text-3xl md:text-5xl text-[#d071c7] mb-4">Got Questions?</p>
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-6">
          Frequently Asked{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">Questions</span>
        </h1>
      </section>

      <section className="max-w-3xl mx-auto mb-20 space-y-4 stagger-children" data-aos="fade-up">
        {faqData.map((item, idx) => (
          <div key={idx} className="glass-card p-0 overflow-hidden">
            <button className="w-full flex justify-between items-center p-6 text-left font-medium" onClick={() => setOpen(open === idx ? null : idx)}>
              <span>{item.q}</span>
              <span className={`text-xl transition-transform duration-300 ${open === idx ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === idx ? 'max-h-96 pb-6 px-6' : 'max-h-0'}`}>
              <p className="opacity-70 text-sm">{item.a}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
