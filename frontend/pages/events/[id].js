import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassCard from '../../components/GlassCard';
import Loading from '../../components/Loading';
import { getEvent, createBooking, getSettings, getExistingBooking, addGuestsToBooking } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB') : ''

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [existingBooking, setExistingBooking] = useState(null);
  const [checkingBooking, setCheckingBooking] = useState(false);
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEvent(id).then(res => {
      setEvent(res.data || res);
      setLoading(false);
    }).catch(() => setLoading(false));
    getSettings().then(setSettings).catch(() => {});
  }, [id]);

  const payAfterEnabled = settings.pay_after_attend_enabled !== '0';
  const totalPrice = event ? (event.price * guests).toFixed(2) : '0.00';

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const openModal = async () => {
    setShowModal(true);
    setBookingMsg('');
    setBookingSuccess(false);
    setGuests(1);
    setPaymentMethod('card');
    setCardName(''); setCardNumber(''); setCardExpiry(''); setCardCvv('');
    setDiscountCode('');
    setDiscountApplied(null);
    if (!user) return;
    setCheckingBooking(true);
    try {
      const res = await getExistingBooking(id);
      setExistingBooking(res.booking || null);
    } catch {
      setExistingBooking(null);
    } finally {
      setCheckingBooking(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    setBookingSuccess(false);
    setSubmitting(true);
    try {
      if (existingBooking) {
        await addGuestsToBooking(existingBooking.id, {
          additional_spots: guests,
          payment_method: paymentMethod,
        });
        setBookingMsg('Guests added to your existing booking!');
      } else {
        const payload = {
          event_id: id, name: user.name, email: user.email,
          phone: user.phone || '', spots_booked: guests, payment_method: paymentMethod,
        };
        if (discountCode.trim()) payload.discount_code = discountCode.trim();
        await createBooking(payload);
        setBookingMsg(paymentMethod === 'pay_on_arrival'
          ? 'Booking confirmed! You can pay when you arrive.'
          : 'Booking confirmed! Check your email for payment details.');
      }
      setBookingSuccess(true);
    } catch (err) {
      setBookingMsg('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setBookingMsg('');
    setBookingSuccess(false);
    setExistingBooking(null);
    setGuests(1);
    setPaymentMethod('card');
    setCardName(''); setCardNumber(''); setCardExpiry(''); setCardCvv('');
  };

  if (loading || authLoading) return <Loading text="Loading event details..." />;
  if (!event) return (
    <div className="text-center py-20">
      <p className="text-6xl mb-4">📅</p>
      <p className="opacity-50 mb-6">Event not found.</p>
      <Link href="/events" className="btn">Browse Events</Link>
    </div>
  );

  return (
    <div>
      <Link href="/events" className="btn-ghost mb-8 inline-block">← Back to Events</Link>

      <div className="grid lg:grid-cols-2 gap-12 mb-16" data-aos="fade-up">
        <div data-aos="fade-right">
          {event.image && (
            <img src={`http://localhost:8000/storage/${event.image}`} alt={event.title} className="w-full rounded-3xl shadow-xl mb-6" />
          )}
          {!event.image && (
            <div className="w-full aspect-video rounded-3xl bg-gradient-to-br from-[#BFEFFF] to-[#F8D6E8] flex items-center justify-center text-7xl mb-6">📅</div>
          )}
        </div>

        <div data-aos="fade-left">
          <p className="font-parisienne text-3xl text-[#d071c7] mb-2">Upcoming Event</p>
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>

          <div className="space-y-3 mb-8 text-sm">
            <p className="flex items-center gap-3">📅 <strong>{fmtDate(event.event_date)}</strong></p>
            <p className="flex items-center gap-3">⏰ <strong>{event.start_time} - {event.end_time}</strong></p>
            <p className="flex items-center gap-3">📍 <strong>{event.location_name}</strong></p>
            <p className="flex items-center gap-3">💰 <strong>${event.price}</strong> per person</p>
            <p className="flex items-center gap-3">👥 Capacity: {event.capacity}</p>
            {event.instructor && <p className="flex items-center gap-3">🧘 Instructor: {event.instructor.name}</p>}
          </div>

          <p className="text-lg opacity-75 mb-8">{event.description}</p>

          {!user ? (
            <GlassCard className="mb-8">
              <div className="text-center py-6">
                <p className="text-lg mb-4">🔒</p>
                <p className="opacity-70 mb-4">Please sign in to book a session</p>
                <Link href={`/login?redirect=/events/${id}`} className="btn inline-block">Sign In to Book</Link>
                <p className="text-sm mt-3 opacity-50">
                  Don&apos;t have an account?{' '}
                  <Link href={`/register?redirect=/events/${id}`} className="text-[#d071c7] font-semibold hover:underline">Sign Up</Link>
                </p>
              </div>
            </GlassCard>
          ) : (
            <button onClick={openModal} className="btn w-full text-lg py-4">
              Book Your Spot
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-lg">&times;</button>

            {checkingBooking ? (
              <div className="text-center py-10"><p className="opacity-50">Checking your booking...</p></div>
            ) : (
              <>
                <h3 className="font-poppins text-2xl font-bold mb-1">
                  {existingBooking ? 'Add More Guests' : 'Book Your Spot'}
                </h3>
                <p className="text-sm opacity-60 mb-6">{event.title} — {fmtDate(event.event_date)}</p>

                {existingBooking && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                    You are already booked in this Event. You can add guests now.
                    <p className="text-xs mt-1 opacity-75">Currently booked: {existingBooking.spots_booked} guest(s)</p>
                  </div>
                )}

                {bookingMsg && (
                  <p className={`mb-4 p-3 rounded-xl text-sm ${bookingMsg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {bookingMsg}
                    {bookingSuccess && (
                      <button onClick={closeModal} className="block mt-2 text-sm font-semibold text-[#d071c7] hover:underline">Close</button>
                    )}
                  </p>
                )}

                {!bookingSuccess && (
                  <form onSubmit={handleBook} className="space-y-5">
                    <div>
                      <label className="text-sm font-semibold block mb-1.5">
                        {existingBooking ? 'Additional Guests' : 'Number of Guests'}
                      </label>
                      <input type="number" min="1" max={event.capacity} value={guests}
                        onChange={e => setGuests(parseInt(e.target.value) || 1)}
                        className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[#d071c7]" />
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#d071c7]/5 to-[#BFEFFF]/5 border border-gray-100 text-sm">
                      <div className="flex justify-between">
                        <span>${event.price} x {guests} guest(s)</span>
                        <span>$ {(event.price * guests).toFixed(2)}</span>
                      </div>
                      {existingBooking && (
                        <div className="flex justify-between text-xs opacity-60 mt-1">
                          <span>Existing total: {existingBooking.spots_booked} guest(s)</span>
                          <span>$ {(event.price * existingBooking.spots_booked).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-200">
                        <span>{existingBooking ? 'New Total' : 'Total'}</span>
                        <span>$ {(event.price * ((existingBooking?.spots_booked || 0) + guests)).toFixed(2)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold block mb-1.5">Discount Code</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Enter code" value={discountCode}
                          onChange={e => setDiscountCode(e.target.value)}
                          className="flex-1 p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[#d071c7]" />
                        {discountApplied && (
                          <span className="inline-flex items-center text-green-600 text-sm font-semibold">Applied!</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold block mb-2">Payment Method</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setPaymentMethod('card')}
                          className={`flex-1 p-3 rounded-xl text-sm font-medium border-2 transition-all ${paymentMethod === 'card' ? 'border-[#d071c7] bg-[#d071c7]/10' : 'border-gray-200 bg-white/50'}`}>
                          💳 Pay Now
                        </button>
                        {payAfterEnabled && (
                          <button type="button" onClick={() => setPaymentMethod('pay_on_arrival')}
                            className={`flex-1 p-3 rounded-xl text-sm font-medium border-2 transition-all ${paymentMethod === 'pay_on_arrival' ? 'border-[#d071c7] bg-[#d071c7]/10' : 'border-gray-200 bg-white/50'}`}>
                            📍 Pay After Attending
                          </button>
                        )}
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-[#d071c7]/5 to-[#BFEFFF]/5 border border-gray-100">
                        <p className="text-xs font-semibold opacity-60 uppercase tracking-wide">Card Details</p>
                        <input type="text" placeholder="Cardholder Name" required value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[#d071c7]" />
                        <input type="text" placeholder="Card Number" required value={cardNumber}
                          onChange={e => setCardNumber(formatCard(e.target.value))}
                          className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[#d071c7]" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="MM/YY" required value={cardExpiry}
                            onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                            className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[#d071c7]" />
                          <input type="text" placeholder="CVV" required maxLength={4} value={cardCvv}
                            onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[#d071c7]" />
                        </div>
                      </div>
                    )}

                    <button type="submit" disabled={submitting} className="btn w-full disabled:opacity-50 py-3">
                      {submitting ? 'Booking...' : existingBooking
                        ? `Add ${guests} Guest(s) $${(event.price * guests).toFixed(2)}`
                        : paymentMethod === 'pay_on_arrival' ? 'Reserve Spot' : `Pay $${totalPrice} & Book`}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
