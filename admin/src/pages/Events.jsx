import { useState, useEffect } from 'react'
import { getEvents, deleteEvent, completeEvent, sendTemplateEmail } from '../utils/api'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, CheckCircle, Coffee, Mail } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB') : '—'

const statusBadge = (s, featured) => {
  if (featured) return <span className="badge bg-amber-50 text-amber-700 border border-amber-200">Featured</span>
  const map = {
    published: 'badge bg-green-50 text-green-700 border border-green-200',
    draft: 'badge bg-gray-50 text-gray-600 border border-gray-200',
    cancelled: 'badge bg-red-50 text-red-700 border border-red-200',
    completed: 'badge bg-blue-50 text-blue-700 border border-blue-200',
  }
  return <span className={map[s] || 'badge bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)]'}>{s}</span>
}

export default function Events() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [statusMsg, setStatusMsg] = useState('')
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getEvents().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    const ok = await confirm('Are you sure you want to delete this event? This cannot be undone.', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteEvent(id)
    load()
  }

  const handleComplete = async (id) => {
    const ok = await confirm('Mark this event as completed? This will update all confirmed bookings to completed.', { confirmLabel: 'Complete' })
    if (!ok) return
    try {
      await completeEvent(id)
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Error completing event')
    }
  }

  const handleSendTemplateEmail = async (eventId, slug) => {
    const ok = await confirm(`Are you sure you want to send the ${slug.replace('_', ' ')} email to all attendees of this event?`, { confirmLabel: 'Send' })
    if (!ok) return
    setStatusMsg('Sending email...')
    try {
      const res = await sendTemplateEmail({
        slug: slug,
        recipient_type: 'event_attendees',
        event_id: eventId
      })
      setStatusMsg(res.data?.message || 'Emails sent successfully!')
      setTimeout(() => setStatusMsg(''), 3000)
    } catch (err) {
      setStatusMsg('Error: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setStatusMsg(''), 5000)
    }
  }

  const filtered = items.filter(e =>
    !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.location_name?.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-semibold text-[var(--color-text)]">{row.title}</span> },
    { key: 'event_date', label: 'Date', render: (row) => <span className="text-[var(--color-text-secondary)]">{fmtDate(row.event_date)}</span> },
    { key: 'start_time', label: 'Time', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.start_time}</span> },
    { key: 'location_name', label: 'Location', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.location_name}</span> },
    { key: 'price', label: 'Price', render: (row) => <span className="font-medium text-[var(--color-text)]">${row.price}</span> },
    {
      key: 'status', label: 'Status',
      render: (row) => statusBadge(row.status, row.featured)
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          {row.status === 'published' && (
            <button onClick={() => handleComplete(row.id)} className="btn-secondary text-xs !px-3 !py-1.5 text-green-600">
              <CheckCircle size={14} /> Complete
            </button>
          )}

          <Link to={`/admin/events/${row.id}/edit`} className="btn-secondary text-xs !px-3 !py-1.5 no-underline"><Pencil size={14} /> Edit</Link>
          <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
        </div>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Events"
        description="Manage your studio events and classes"
        actions={(
          <>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
                className="!w-56 !pl-9" />
            </div>
            <Link to="/admin/events/new" className="btn-primary no-underline text-sm"><Plus size={16} /> New Event</Link>
          </>
        )}
      />
      {statusMsg && (
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm font-semibold border ${statusMsg.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
          {statusMsg}
        </div>
      )}
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No events found. Create your first event to get started." />
      {dialog}
    </div>
  )
}
