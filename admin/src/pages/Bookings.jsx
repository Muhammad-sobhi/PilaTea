import { useState, useEffect } from 'react'
import { getBookings, deleteBooking } from '../utils/api'
import { Link } from 'react-router-dom'
import { Search, Eye, Trash2 } from 'lucide-react'
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
  const [loading, setLoading] = useState(true)
  const { confirm, dialog } = useConfirm()

  useEffect(() => {
    setLoading(true)
    getBookings().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    const ok = await confirm('Are you sure you want to delete this booking?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteBooking(id)
    setItems(items.filter(i => i.id !== id))
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
        <div className="flex items-center gap-2">
          <Link to={`/admin/bookings/${row.id}`} className="btn-secondary text-xs !px-3 !py-1.5 no-underline"><Eye size={14} /> View</Link>
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
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No bookings found." />
      {dialog}
    </div>
  )
}
