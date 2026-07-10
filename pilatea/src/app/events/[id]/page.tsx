"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackButton } from "@/components/BackButton";
import { getEvent, createBooking, getExistingBooking, addGuestsToBooking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { storageUrl, formatDate } from "@/lib/utils";
import type { Event } from "@/lib/types";

const formatCard = (val: string) => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
const formatExpiry = (val: string) => {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();
  const settings = useSettings();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingBooking, setExistingBooking] = useState<{ id: number; spots_booked: number } | null>(null);
  const [checkingBooking, setCheckingBooking] = useState(false);
  const [guests, setGuests] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed" | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [discountSuccessMsg, setDiscountSuccessMsg] = useState("");
  const [validatingCode, setValidatingCode] = useState(false);
  const [cardName, setCardName] = useState("");
  const [isByo, setIsByo] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEvent(id).then((res: unknown) => {
      const data = (res as Record<string, unknown>).data as Event || (res as Event);
      setEvent(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const payAfterEnabled = settings.pay_after_attend_enabled !== "0";

  const openModal = async () => {
    setShowModal(true);
    setBookingMsg(""); setBookingSuccess(false);
    setGuests(1); setPaymentMethod("card");
    setCardName(""); setCardNumber(""); setCardExpiry(""); setCardCvv("");
    setDiscountCode(""); setDiscountValue(0); setDiscountType(null); setDiscountError(""); setDiscountSuccessMsg("");
    if (!user) return;
    setCheckingBooking(true);
    try {
      const res = await getExistingBooking(id) as { booking?: { id: number; spots_booked: number } };
      setExistingBooking(res.booking || null);
    } catch { setExistingBooking(null); }
    finally { setCheckingBooking(false); }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setValidatingCode(true);
    setDiscountError("");
    setDiscountSuccessMsg("");
    try {
      const res = await validateDiscountCode(discountCode) as { valid: boolean; discount_type: "percentage" | "fixed"; value: number; message?: string };
      if (res.valid) {
        setDiscountType(res.discount_type);
        setDiscountValue(res.value);
        setDiscountSuccessMsg(`Discount code applied! (${res.discount_type === "percentage" ? res.value + "%" : "$" + res.value} off)`);
      } else {
        setDiscountError(res.message || "Invalid discount code");
      }
    } catch (err: any) {
      setDiscountError(err.message || "Failed to validate code");
    } finally {
      setValidatingCode(false);
    }
  };

  const calculateDiscount = (subtotal: number) => {
    if (!discountType) return 0;
    if (discountType === "percentage") {
      return (subtotal * discountValue) / 100;
    } else {
      return Math.min(subtotal, discountValue);
    }
  };

  const currentPrice = isByo ? (event?.byo_price ?? event?.price ?? 0) : (event?.price ?? 0);
  const subtotalPriceNum = event ? currentPrice * guests : 0;
  const discountAmount = calculateDiscount(subtotalPriceNum);
  const finalPriceNum = Math.max(0, subtotalPriceNum - discountAmount);
  const totalPrice = finalPriceNum.toFixed(2);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingMsg(""); setBookingSuccess(false);
    setSubmitting(true);
    try {
      if (existingBooking) {
        await addGuestsToBooking(existingBooking.id, { additional_spots: guests, payment_method: paymentMethod });
        setBookingMsg("Guests added to your existing booking!");
      } else {
        const payload: Record<string, unknown> = {
          event_id: id, name: (user as Record<string, string>).name, email: (user as Record<string, string>).email,
          phone: (user as Record<string, string>).phone || "", spots_booked: guests, payment_method: paymentMethod,
          discount_code: discountType ? discountCode : undefined,
          is_byo: isByo,
        };
        await createBooking(payload);
        setBookingMsg(paymentMethod === "pay_on_arrival"
          ? "Booking confirmed! You can pay when you arrive."
          : "Booking confirmed! Check your email for payment details.");
      }
      setBookingSuccess(true);
    } catch (err: unknown) {
      setBookingMsg("Error: " + (err instanceof Error ? err.message : "Something went wrong"));
    } finally { setSubmitting(false); }
  };

  const closeModal = () => {
    setShowModal(false);
    setBookingMsg(""); setBookingSuccess(false);
    setExistingBooking(null); setGuests(1);
    setPaymentMethod("card");
    setCardName(""); setCardNumber(""); setCardExpiry(""); setCardCvv("");
    setDiscountCode(""); setDiscountValue(0); setDiscountType(null); setDiscountError(""); setDiscountSuccessMsg("");
  };

  if (loading || authLoading) return <Loading text="Loading event details..." />;
  if (!event) return (
    <div className="page min-h-screen flex items-center justify-center text-center" style={{ paddingTop: 130 }}>
      <p className="text-6xl mb-4">&#x1F4C5;</p>
      <p className="opacity-50 mb-6">Event not found.</p>
      <Link href="/events" className="btn">Browse Events</Link>
    </div>
  );

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />

      <ScrollReveal>
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            {event.image && <img src={storageUrl(event.image)} alt={event.title} className="w-full rounded-3xl shadow-xl mb-6" />}
            {!event.image && <div className="w-full aspect-video rounded-3xl bg-gradient-to-br from-[#BFEAFF] to-[#E8A6F4]/50 flex items-center justify-center text-7xl mb-6">&#x1F4C5;</div>}
          </div>

          <div>
            <p className="script" style={{ margin: "0 0 8px" }}>Upcoming Event</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>

            <div className="space-y-3 mb-8 text-sm">
              <p className="flex items-center gap-3"><strong>{formatDate(event.event_date)}</strong></p>
              <p className="flex items-center gap-3"><strong>{event.start_time}{event.end_time ? ` - ${event.end_time}` : ""}</strong></p>
              <p className="flex items-center gap-3"><strong>{event.location_name}</strong></p>
              <p className="flex items-center gap-3"><strong>${event.price}</strong> per person</p>
              <p className="flex items-center gap-3">Capacity: {event.spots_remaining} spots left / {event.capacity} total</p>
              {event.byo_enabled && (
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl mt-2 text-xs text-amber-900">
                  <p className="font-semibold">BYO (Bring Your Own) Option Available:</p>
                  <p className="opacity-80">{event.byo_description || "If capacity is reached, you can book a BYO spot with less privilege (bring your own mat, last row placement)."}</p>
                  {event.byo_price != null && <p className="font-semibold mt-1">BYO Price: ${event.byo_price} per person</p>}
                  <p className="font-semibold mt-0.5">{event.byo_spots_remaining} BYO spots remaining</p>
                </div>
              )}
            </div>

            <p className="text-lg opacity-75 mb-8">{event.description}</p>

            {!user ? (
              <div className="glass-card mb-8">
                <div className="text-center py-6">
                  <p className="opacity-70 mb-4">Please sign in to book a session</p>
                  <Link href={`/login?redirect=/events/${id}`} className="btn inline-block">Sign In to Book</Link>
                  <p className="text-sm mt-3 opacity-50">
                    Don&apos;t have an account?{" "}
                    <Link href={`/register?redirect=/events/${id}`} className="text-[var(--color-primary)] font-semibold hover:underline">Sign Up</Link>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {(event.spots_remaining ?? 0) > 0 ? (
                  <button onClick={() => { setIsByo(false); openModal(); }} className="btn w-full text-lg py-4">Book Your Spot</button>
                ) : event.byo_enabled && (event.byo_spots_remaining ?? 0) > 0 ? (
                  <button onClick={() => { setIsByo(true); openModal(); }} className="btn w-full text-lg py-4 bg-amber-500 hover:bg-amber-600 text-white border-none">Book BYO Spot</button>
                ) : (
                  <button disabled className="btn w-full text-lg py-4 opacity-50 cursor-not-allowed">Event Sold Out</button>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-lg">&times;</button>

            {checkingBooking ? (
              <div className="text-center py-10"><p className="opacity-50">Checking your booking...</p></div>
            ) : (
              <>
                 <h3 className="text-2xl font-bold mb-1">{existingBooking ? "Add More Guests" : isByo ? "Book BYO Spot" : "Book Your Spot"}</h3>
                <p className="text-sm opacity-60 mb-6">{event.title} &mdash; {formatDate(event.event_date)}</p>

                {isByo && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                    <strong>Bring Your Own Spot:</strong> {event.byo_description || "Please bring your own mat. Note that your placement will be in the last line of the class."}
                  </div>
                )}

                {existingBooking && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                    You are already booked in this Event. You can add guests now.
                    <p className="text-xs mt-1 opacity-75">Currently booked: {existingBooking.spots_booked} guest(s)</p>
                  </div>
                )}

                {bookingMsg && (
                  <p className={`mb-4 p-3 rounded-xl text-sm ${bookingMsg.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {bookingMsg}
                    {bookingSuccess && <button onClick={closeModal} className="block mt-2 text-sm font-semibold text-[var(--color-primary)] hover:underline">Close</button>}
                  </p>
                )}

                {!bookingSuccess && (
                  <form onSubmit={handleBook} className="space-y-5">
                    <div>
                      <label className="text-sm font-semibold block mb-1.5">{existingBooking ? "Additional Guests" : "Number of Guests"}</label>
                      <input type="number" min="1" max={isByo ? event.byo_spots_remaining : event.spots_remaining} value={guests}
                        onChange={e => setGuests(parseInt(e.target.value) || 1)}
                        className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[var(--color-primary)]" />
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#E8A6F4]/10 to-[#BFEAFF]/10 border border-white/20 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal (${event.price} x {guests} guest(s))</span>
                        <span>$ {subtotalPriceNum.toFixed(2)}</span>
                      </div>
                      {discountValue > 0 && (
                        <div className="flex justify-between text-green-600 font-semibold mt-1">
                          <span>Discount Applied</span>
                          <span>- $ {discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {existingBooking && (
                        <div className="flex justify-between text-xs opacity-60 mt-1">
                          <span>Existing total: {existingBooking.spots_booked} guest(s)</span>
                          <span>$ {(event.price * existingBooking.spots_booked).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-white/20">
                        <span>{existingBooking ? "New Total" : "Total"}</span>
                        <span>$ {totalPrice}</span>
                      </div>
                    </div>

                    {!existingBooking && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold block">Discount Code</label>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Enter code" value={discountCode}
                            onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                            className="flex-1 p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[var(--color-primary)] text-sm" />
                          <button type="button" onClick={handleApplyDiscount} disabled={validatingCode}
                            className="btn !px-4 !py-2.5 text-sm shrink-0">
                            {validatingCode ? "Applying..." : "Apply"}
                          </button>
                        </div>
                        {discountError && <p className="text-xs text-red-500">{discountError}</p>}
                        {discountSuccessMsg && <p className="text-xs text-green-600 font-semibold">{discountSuccessMsg}</p>}
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-semibold block mb-2">Payment Method</label>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setPaymentMethod("card")}
                          className={`flex-1 min-w-[120px] p-3 rounded-xl text-sm font-medium border-2 transition-all ${paymentMethod === "card" ? "border-[var(--color-primary)] bg-[#E8A6F4]/10" : "border-gray-200 bg-white/50"}`}>
                          Pay Now
                        </button>
                        {payAfterEnabled && (
                          <button type="button" onClick={() => setPaymentMethod("pay_on_arrival")}
                            className={`flex-1 min-w-[120px] p-3 rounded-xl text-sm font-medium border-2 transition-all ${paymentMethod === "pay_on_arrival" ? "border-[var(--color-primary)] bg-[#E8A6F4]/10" : "border-gray-200 bg-white/50"}`}>
                            Pay After Attending
                          </button>
                        )}
                      </div>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-[#E8A6F4]/10 to-[#BFEAFF]/10 border border-white/20">
                        <p className="text-xs font-semibold opacity-60 uppercase tracking-wide">Card Details</p>
                        <input type="text" placeholder="Cardholder Name" required value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[var(--color-primary)]" />
                        <input type="text" placeholder="Card Number" required value={cardNumber}
                          onChange={e => setCardNumber(formatCard(e.target.value))}
                          className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[var(--color-primary)]" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="MM/YY" required value={cardExpiry}
                            onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                            className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[var(--color-primary)]" />
                          <input type="text" placeholder="CVV" required maxLength={4} value={cardCvv}
                            onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            className="w-full p-3 rounded-xl bg-white/60 border border-gray-200 outline-none focus:border-[var(--color-primary)]" />
                        </div>
                      </div>
                    )}

                    <button type="submit" disabled={submitting} className="btn w-full disabled:opacity-50 py-3">
                      {submitting ? "Booking..." : existingBooking
                        ? `Add ${guests} Guest(s) $${(event.price * guests).toFixed(2)}`
                        : paymentMethod === "pay_on_arrival" ? "Reserve Spot" : `Pay $${totalPrice} & Book`}
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