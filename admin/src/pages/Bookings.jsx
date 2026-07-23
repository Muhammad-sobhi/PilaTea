import { useState, useEffect } from 'react'
import { getBookings, deleteBooking, sendTemplateEmail } from '../utils/api'
import { Link } from 'react-router-dom'
import { Search, Eye, Trash2, Coffee, Mail } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import BookingDetail from './BookingDetail'
import { useConfirm } from '../components/ConfirmDialog'

const statusBadge = (s) => {
  const map = {
    confirmed: 'badge bg-green-50 text-green-700 border border-green-200',
    cancelled: 'badge bg-red-50 text-red-700 border border-red-200',
    completed: 'badge bg-blue-50 text-blue-700 border border-blue-200',
    pay_on_arrival: 'badge bg-amber-50 text-amber-700 border border-amber-200',
    pending: 'badge bg-yellow-50 text-yellow-700 border border-yellow-200',
  }
  return <span className={map[s] || 'badge bg-slate-100 text-slate-600'}>{s}</span>
}

export default function Bookings() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getBookings().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleOpenDetail = (id) => {
    setSelectedBookingId(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBookingId(null)
    load()
  }

  const handleDelete = async (id) => {
    const ok = await confirm('Are you sure you want to delete this booking?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteBooking(id)
    load()
  }

  const filtered = items.filter(b =>
    !search || b.name?.toLowerCase().includes(search.toLowerCase()) || b.email?.toLowerCase().includes(search.toLowerCase()) || b.reference?.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'reference', label: 'Reference', render: (row) => <code className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">{row.reference}</code> },
    { key: 'name', label: 'Name', render: (row) => <span className="font-semibold text-slate-800">{row.name}</span> },
    { key: 'spots_booked', label: 'Guests' },
    { key: 'total_price', label: 'Total', render: (row) => <span className="font-bold text-slate-900">${row.total_price}</span> },
    { key: 'payment_method', label: 'Payment', render: (row) => <span className="text-xs capitalize font-medium text-slate-600">{row.payment_method === 'pay_on_arrival' ? 'Pay on Arrival' : row.payment_method || '-'}</span> },
    { key: 'event', label: 'Event', render: (row) => <span className="text-slate-500">{row.event?.title || 'N/A'}</span> },
    { key: 'payment_status', label: 'Status', render: (row) => statusBadge(row.payment_status) },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button onClick={() => handleOpenDetail(row.id)} title="View Booking Details" className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer border-0">
            <Eye size={15} />
          </button>
          <Link to={`/admin/bookings/${row.id}/drinks`} title="Manage Drinks" className="p-2 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer border-0 no-underline">
            <Coffee size={15} />
          </Link>
          <button onClick={() => handleDelete(row.id)} title="Delete Booking" className="btn-danger !p-2 rounded-xl transition-colors border-0">
            <Trash2 size={15} />
          </button>
        </div>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Bookings" description="View and manage customer bookings"
        actions={(
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} className="!w-64 !pl-9" />
          </div>
        )} />
      {statusMsg && (
        <div className={`mb-6 rounded-2xl px-4 py-3 text-xs font-semibold border ${statusMsg.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
          {statusMsg}
        </div>
      )}
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No bookings found." />
      
      {/* Booking Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Booking Detail" maxWidth="max-w-2xl">
        <BookingDetail bookingId={selectedBookingId} onClose={handleCloseModal} />
      </Modal>

      {dialog}
    </div>
  )
}
