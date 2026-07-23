import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBooking, updateBookingStatus } from '../utils/api'
import { ArrowLeft, Check, X, Coffee } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function BookingDetail({ bookingId, onClose }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const id = bookingId !== undefined ? bookingId : paramId
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setLoading(true)
      getBooking(id)
        .then(r => setItem(r.data))
        .catch(() => {
          if (onClose) onClose()
          else navigate('/admin/bookings')
        })
        .finally(() => setLoading(false))
    }
  }, [id])

  const updateStatus = async (status) => {
    await updateBookingStatus(id, status)
    setItem(prev => ({ ...prev, payment_status: status }))
  }

  const handleBack = () => {
    if (onClose) onClose()
    else navigate('/admin/bookings')
  }

  if (loading || !item) {
    return (
      <div className="p-6 text-center">
        <div className="skeleton h-6 w-1/2 mx-auto mb-4" />
        <div className="skeleton h-32 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="animate-fadeIn w-full space-y-6">
      {!onClose && (
        <PageHeader title="Booking Detail" description={`Reference: ${item.reference}`}
          actions={<button onClick={handleBack} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      )}
      <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Name</label><p className="text-xs font-bold text-slate-800">{item.name}</p></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Email</label><p className="text-xs font-semibold text-slate-700">{item.email}</p></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Phone</label><p className="text-xs font-medium text-slate-600">{item.phone || '—'}</p></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Guests</label><p className="text-xs font-bold text-slate-800">{item.spots_booked}</p></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Total</label><p className="text-xs font-extrabold text-slate-900">${item.total_price}</p></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Payment Method</label><p className="text-xs font-semibold capitalize text-slate-700">{item.payment_method === 'pay_on_arrival' ? 'Pay on Arrival' : item.payment_method || '—'}</p></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Event</label><p className="text-xs font-semibold text-slate-800">{item.event?.title || 'N/A'}</p></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Status</label>
            <span className={`badge text-[11px] ${item.payment_status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' : item.payment_status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' : item.payment_status === 'pay_on_arrival' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{item.payment_status}</span>
          </div>
          {item.notes && <div className="sm:col-span-2"><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Notes</label><p className="text-xs text-slate-600">{item.notes}</p></div>}
        </div>
        {item.payment_status === 'pending' && (
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200">
            <button onClick={() => updateStatus('confirmed')} className="btn-primary text-xs !py-2"><Check size={15} /> Confirm</button>
            <button onClick={() => updateStatus('cancelled')} className="btn-secondary text-xs !py-2"><X size={15} /> Cancel</button>
          </div>
        )}
      </div>

      <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2 m-0">
            <Coffee size={16} className="text-cyan-600" /> Ordered Drinks
          </h3>
        </div>
        {(!item.teaOrders || item.teaOrders.length === 0) && (!item.tea_orders || item.tea_orders.length === 0) ? (
          <p className="text-xs text-slate-400 font-medium">No drinks ordered by this attendee.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase">
                  <th className="text-left px-3 py-2">Drink</th>
                  <th className="text-left px-3 py-2">Qty</th>
                  <th className="text-left px-3 py-2">Total Price</th>
                  <th className="text-left px-3 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {((item.teaOrders || item.tea_orders || [])).map((ord) => (
                  <tr key={ord.id} className="border-b border-slate-100/80 last:border-0 font-medium text-slate-700">
                    <td className="px-3 py-2 font-semibold">{(ord.teaItem || ord.tea_item)?.name || '—'}</td>
                    <td className="px-3 py-2">{ord.quantity}</td>
                    <td className="px-3 py-2 font-bold">${(ord.unit_price * ord.quantity).toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-400">{ord.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

