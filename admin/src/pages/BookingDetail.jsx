import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBooking, updateBookingStatus } from '../utils/api'
import { ArrowLeft, Check, X, Coffee } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)

  useEffect(() => {
    getBooking(id)
      .then(r => setItem(r.data))
      .catch(() => {
        navigate('/admin/bookings')
      })
  }, [id, navigate])

  const updateStatus = async (status) => {
    await updateBookingStatus(id, status)
    setItem(prev => ({ ...prev, payment_status: status }))
  }

  if (!item) return <div className="animate-fadeIn"><PageHeader title="Booking Detail" /></div>

  return (
    <div className="animate-fadeIn max-w-2xl space-y-6">
      <PageHeader title="Booking Detail" description={`Reference: ${item.reference}`}
        actions={<Link to="/admin/bookings" className="btn-secondary text-sm no-underline"><ArrowLeft size={16} /> Back</Link>} />
      <div className="card p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Name</label><p className="text-sm font-medium text-[var(--color-text)]">{item.name}</p></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Email</label><p className="text-sm text-[var(--color-text)]">{item.email}</p></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Phone</label><p className="text-sm text-[var(--color-text)]">{item.phone || '—'}</p></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Guests</label><p className="text-sm text-[var(--color-text)]">{item.spots_booked}</p></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Total</label><p className="text-sm font-semibold text-[var(--color-text)]">${item.total_price}</p></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Payment Method</label><p className="text-sm capitalize text-[var(--color-text)]">{item.payment_method === 'pay_on_arrival' ? 'Pay on Arrival' : item.payment_method || '—'}</p></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Event</label><p className="text-sm text-[var(--color-text)]">{item.event?.title || 'N/A'}</p></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Status</label>
            <span className={`badge mt-0.5 ${item.payment_status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' : item.payment_status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' : item.payment_status === 'pay_on_arrival' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{item.payment_status}</span>
          </div>
          {item.notes && <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Notes</label><p className="text-sm text-[var(--color-text-secondary)]">{item.notes}</p></div>}
        </div>
        {item.payment_status === 'pending' && (
          <div className="flex gap-3 mt-6 pt-5 border-t border-[var(--color-border)]">
            <button onClick={() => updateStatus('confirmed')} className="btn-primary"><Check size={16} /> Confirm</button>
            <button onClick={() => updateStatus('cancelled')} className="btn-secondary"><X size={16} /> Cancel</button>
          </div>
        )}
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-2 m-0">
            <Coffee size={18} /> Ordered Drinks
          </h3>
          <Link to={`/admin/bookings/${id}/drinks`} className="btn-primary text-xs !py-1.5 !px-3 no-underline">
            Manage Drinks
          </Link>
        </div>
        {(!item.teaOrders || item.teaOrders.length === 0) && (!item.tea_orders || item.tea_orders.length === 0) ? (
          <p className="text-sm text-[var(--color-text-muted)]">No drinks ordered by this attendee.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-4 py-2">Drink</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-4 py-2">Qty</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-4 py-2">Total Price</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {((item.teaOrders || item.tea_orders || [])).map((ord) => (
                  <tr key={ord.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-4 py-3">{(ord.teaItem || ord.tea_item)?.name || '—'}</td>
                    <td className="px-4 py-3">{ord.quantity}</td>
                    <td className="px-4 py-3">${(ord.unit_price * ord.quantity).toFixed(2)}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{ord.notes || '—'}</td>
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
