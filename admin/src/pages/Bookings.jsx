import { useState, useEffect } from 'react'
import { getBookings, deleteBooking, sendTemplateEmail } from '../utils/api'
import { Link } from 'react-router-dom'
import { Search, Eye, Trash2, Coffee, Mail } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

const statusBadge = (s) => {
  const map = {
    confirmed: 'badge bg-green-50 text-green-700 border border-green-200',
    cancelled: 'badge bg-red-50 text-red-700 border border-red-200',
    completed: 'badge bg-blue-50 text-blue-700 border border-blue-200',
    pay_on_arrival: 'badge bg-amber-50 text-amber-700 border border-amber-200',
    pending: 'badge bg-yellow-50 text-yellow-700 border border-yellow-200',
  }
  return <span className={map[s] || 'badge bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)]'}>{s}</span>
}

export default function Bookings() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getBookings().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    const ok = await confirm('Are you sure you want to delete this booking?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteBooking(id)
    load()
  }

  const handleSendTemplateEmail = async (bookingId, slug) => {
    const ok = await confirm(`Are you sure you want to send the ${slug.replace('_', ' ')} email to this attendee?`, { confirmLabel: 'Send' })
    if (!ok) return
    setStatusMsg('Sending email...')
    try {
      const res = await sendTemplateEmail({
        slug: slug,
        recipient_type: 'booking',
        booking_id: bookingId
      })
      setStatusMsg(res.data?.message || 'Email sent successfully!')
      setTimeout(() => setStatusMsg(''), 3000)
    } catch (err) {
      setStatusMsg('Error: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setStatusMsg(''), 5000)
    }
  }

  const filtered = items.filter(b =>
    !search || b.name?.toLowerCase().includes(search.toLowerCase()) || b.email?.toLowerCase().includes(search.toLowerCase()) || b.reference?.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'reference', label: 'Reference', render: (row) => <code className="text-sm font-semibold text-[var(--color-text)]">{row.reference}</code> },
    { key: 'name', label: 'Name', render: (row) => <span className="font-semibold text-[var(--color-text)]">{row.name}</span> },
    { key: 'spots_booked', label: 'Guests' },
    { key: 'total_price', label: 'Total', render: (row) => <span className="font-semibold">${row.total_price}</span> },
    { key: 'payment_method', label: 'Payment', render: (row) => <span className="text-xs capitalize">{row.payment_method === 'pay_on_arrival' ? 'Pay on Arrival' : row.payment_method || '-'}</span> },
    { key: 'event', label: 'Event', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.event?.title || 'N/A'}</span> },
    { key: 'payment_status', label: 'Status', render: (row) => statusBadge(row.payment_status) },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/admin/bookings/${row.id}`} className="btn-secondary text-xs !px-3 !py-1.5 no-underline"><Eye size={14} /> View</Link>
          <Link to={`/admin/bookings/${row.id}/drinks`} className="btn-secondary text-xs !px-3 !py-1.5 no-underline text-sky-600">
            <Coffee size={14} /> Drinks
          </Link>
          <button onClick={() => handleSendTemplateEmail(row.id, 'post_event')} className="btn-secondary text-xs !px-3 !py-1.5 text-indigo-600">
            <Mail size={14} /> Thank You
          </button>
          <button onClick={() => handleSendTemplateEmail(row.id, 'review_request')} className="btn-secondary text-xs !px-3 !py-1.5 text-purple-600">
            <Mail size={14} /> Review Request
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
        </div>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Bookings" description="View and manage customer bookings"
        actions={(
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} className="!w-56 !pl-9" />
          </div>
        )} />
      {statusMsg && (
        <div className={`mb-4 rounded-lg px-4 py-3 text-sm border ${statusMsg.includes('Error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {statusMsg}
        </div>
      )}
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No bookings found." />
      {dialog}
    </div>
  )
}
