import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyBookings } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB') : ''

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMyBookings().then(r => {
      setBookings(r.data || r || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return <div className="page min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  if (!user) return (
    <div className="page min-h-screen flex items-center justify-center text-center" style={{ paddingTop: 130 }}>
      <div data-aos="fade-up">
        <h1 className="text-2xl font-bold mb-4">Sign in to view your bookings</h1>
        <Link href="/login" className="btn">Sign In</Link>
      </div>
    </div>
  );

  const statusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      confirmed: 'bg-green-50 text-green-700 border-green-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      pay_on_arrival: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return `px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`;
  };

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="max-w-3xl mx-auto" data-aos="fade-up">
        <h1 className="font-poppins text-4xl font-bold mb-2">My Bookings</h1>
        <p className="opacity-60 mb-10">View your upcoming and past sessions.</p>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="opacity-60 mb-4">No bookings yet.</p>
            <Link href="/events" className="btn">Book a Session</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{b.event?.title || 'Event'}</h3>
                  <p className="text-sm opacity-60">{fmtDate(b.event?.event_date)} · {b.event?.start_time}</p>
                  <p className="text-xs opacity-50 mt-1">Booking Ref: {b.reference}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusBadge(b.payment_status)}>
                    {b.payment_status === 'pay_on_arrival' ? 'Pay on Arrival' : b.payment_status}
                  </span>
                  <span className="text-sm font-semibold">{b.spots_booked} spot(s)</span>
                  <span className="text-sm font-bold">${b.total_price}</span>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <Link href="/events" className="btn">Book Another Session</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}