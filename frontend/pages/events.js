import { useState, useEffect } from 'react';
import Link from 'next/link';
import Loading from '../components/Loading';
import { getEvents } from '../utils/api';

const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB') : ''

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(r => setEvents(r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Finding upcoming sessions..." />;

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="text-center mb-16" data-aos="fade-up">
        <p className="font-parisienne text-3xl md:text-5xl text-[#d071c7] mb-4">Join Us</p>
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-6">
          Events &{' '}
          <span className="bg-gradient-to-r from-[#E7A6D8] via-[#CFA5E8] to-[#BFEFFF] bg-clip-text text-transparent">
            Workshops
          </span>
        </h1>
        <p className="text-lg opacity-70 max-w-xl mx-auto">
          From sunrise Pilates sessions to tea-tasting workshops — discover what&apos;s happening at PILATEA.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 stagger-children">
        {events.length === 0 && (
          <p className="opacity-50 col-span-3 text-center py-12">No upcoming events at the moment. Check back soon!</p>
        )}
        {events.map(event => (
          <Link key={event.id} href={`/events/${event.id}`} className="block">
            <div className="glass-card p-4">
              {event.image && (
                <img src={`http://localhost:8000/storage/${event.image}`} alt={event.title} className="w-full h-48 object-cover rounded-2xl mb-4" />
              )}
              {!event.image && <div className="w-full h-48 rounded-2xl mb-4 bg-gradient-to-br from-[#BFEFFF] to-[#F8D6E8] flex items-center justify-center text-5xl">📅</div>}
              <p className="text-sm font-semibold text-[#d071c7] mb-1">{fmtDate(event.event_date)} · {event.start_time}</p>
              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
              <p className="text-sm opacity-65 mb-3">{event.description?.substring(0, 120)}</p>
              <div className="flex justify-between text-sm">
                <span>📍 {event.location_name}</span>
                <span className="font-semibold">${event.price}</span>
              </div>
              <p className="text-xs opacity-50 mt-2">Capacity: {event.capacity}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
