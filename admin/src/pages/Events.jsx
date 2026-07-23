import { useState, useEffect } from 'react'
import { getEvents, deleteEvent, completeEvent, sendTemplateEmail } from '../utils/api'
import { Plus, Search, Pencil, Trash2, CheckCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import EventForm from './EventForm'
import { useConfirm } from '../components/ConfirmDialog'

const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB') : '—'

const statusBadge = (s, featured) => {
  if (featured) return <span className="badge bg-amber-50 text-amber-700 border border-amber-200">Featured</span>
  const map = {
    published: 'badge bg-green-50 text-green-700 border border-green-200',
    draft: 'badge bg-slate-100 text-slate-600 border border-slate-200',
    cancelled: 'badge bg-red-50 text-red-700 border border-red-200',
    completed: 'badge bg-blue-50 text-blue-700 border border-blue-200',
  }
  return <span className={map[s] || 'badge bg-slate-100 text-slate-600'}>{s}</span>
}

export default function Events() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [statusMsg, setStatusMsg] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getEvents().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleOpenCreate = () => {
    setEditId(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (id) => {
    setEditId(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditId(null)
  }

  const handleFormSuccess = () => {
    handleCloseModal()
    load()
  }

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

  const filtered = items.filter(e =>
    !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.location_name?.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-semibold text-slate-800">{row.title}</span> },
    { key: 'event_date', label: 'Date', render: (row) => <span className="text-slate-500">{fmtDate(row.event_date)}</span> },
    { key: 'start_time', label: 'Time', render: (row) => <span className="text-slate-500">{row.start_time}</span> },
    { key: 'location_name', label: 'Location', render: (row) => <span className="text-slate-500">{row.location_name}</span> },
    { key: 'price', label: 'Price', render: (row) => <span className="font-semibold text-slate-800">${row.price}</span> },
    {
      key: 'status', label: 'Status',
      render: (row) => statusBadge(row.status, row.featured)
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {row.status === 'published' && (
            <button onClick={() => handleComplete(row.id)} title="Mark Event as Completed" className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer border-0">
              <CheckCircle size={15} />
            </button>
          )}
          <button onClick={() => handleOpenEdit(row.id)} title="Edit Event" className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer border-0">
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(row.id)} title="Delete Event" className="btn-danger !p-2 rounded-xl transition-colors border-0">
            <Trash2 size={15} />
          </button>
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
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
                className="!w-56 !pl-9" />
            </div>
            <button onClick={handleOpenCreate} className="btn-primary text-xs cursor-pointer border-0">
              <Plus size={16} strokeWidth={2.5} /> New Event
            </button>
          </>
        )}
      />
      {statusMsg && (
        <div className={`mb-6 rounded-2xl px-4 py-3 text-xs font-semibold border ${statusMsg.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
          {statusMsg}
        </div>
      )}
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No events found. Create your first event to get started." />
      
      {/* Event Form Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editId ? 'Edit Event' : 'Create New Event'} maxWidth="max-w-2xl">
        <EventForm editId={editId} onSuccess={handleFormSuccess} onCancel={handleCloseModal} />
      </Modal>

      {dialog}
    </div>
  )
}

