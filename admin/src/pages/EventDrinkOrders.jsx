import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getTeaOrders, createTeaOrder, getTeaSummary, deleteTeaOrder, getEvent, getTeaItems, getBookings } from '../utils/api'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function EventDrinkOrders() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [orders, setOrders] = useState([])
  const [summary, setSummary] = useState(null)
  const [teaItems, setTeaItems] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ booking_id: '', tea_item_id: '', quantity: 1, notes: '' })
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [evRes, ordersRes, summaryRes, teaRes, bookingsRes] = await Promise.all([
        getEvent(id), getTeaOrders(id), getTeaSummary(id), getTeaItems(), getBookings()
      ])
      setEvent(evRes.data || evRes)
      setOrders(ordersRes.data || [])
      setSummary(summaryRes.data || summaryRes)
      setTeaItems(teaRes.data || [])
      setBookings(bookingsRes.data || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createTeaOrder(id, form)
      setShowModal(false)
      setForm({ booking_id: '', tea_item_id: '', quantity: 1, notes: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding order')
    }
  }

  const handleDelete = async (orderId) => {
    await deleteTeaOrder(orderId)
    load()
  }

  if (loading) return <div className="animate-fadeIn"><PageHeader title="Drink Orders" /></div>

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={`Drink Orders — ${event?.title || ''}`}
        description="Track drinks ordered on-site by attendees"
        actions={
          <button onClick={() => navigate('/admin/events')} className="btn-secondary text-sm">
            <ArrowLeft size={16} /> Back to Events
          </button>
        }
      />

      {summary && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Summary</h3>
          <p className="text-2xl font-bold mb-3">{summary.total_orders || 0} total drinks ordered</p>
          <div className="flex flex-wrap gap-3">
            {(summary.by_item || []).map((item, i) => (
              <div key={i} className="px-3 py-2 rounded-lg bg-[var(--color-bg-alt)] text-sm">
                <span className="font-semibold">{item.name}</span>: {item.quantity} ordered
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-hidden mb-6">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Orders ({orders.length})</h3>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm"><Plus size={16} /> Add Drink Order</button>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--color-text-muted)]">No drink orders yet. Add the first one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">Attendee</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">Drink</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">Qty</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">Price</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">Notes</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">Added By</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-6 py-4 font-medium">{order.booking?.name || '—'}</td>
                    <td className="px-6 py-4">{order.tea_item?.name || '—'}</td>
                    <td className="px-6 py-4">{order.quantity}</td>
                    <td className="px-6 py-4">${(order.unit_price * order.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{order.notes || '—'}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{order.added_by || '—'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(order.id)} className="btn-danger"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Add Drink Order</h3>
            {error && <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-100">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Attendee (Booking)</label>
                  <select required value={form.booking_id} onChange={e => setForm({ ...form, booking_id: e.target.value })}>
                    <option value="">Select attendee...</option>
                    {bookings.filter(b => String(b.event_id) === String(id)).map(b => (
                      <option key={b.id} value={b.id}>{b.name} — {b.reference}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Drink</label>
                  <select required value={form.tea_item_id} onChange={e => setForm({ ...form, tea_item_id: e.target.value })}>
                    <option value="">Select drink...</option>
                    {teaItems.map(t => (
                      <option key={t.id} value={t.id}>{t.name} — ${t.price}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                  <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. no sugar" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">Add Order</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
