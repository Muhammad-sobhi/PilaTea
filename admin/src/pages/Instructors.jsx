import { useState, useEffect } from 'react'
import { getInstructors, deleteInstructor } from '../utils/api'
import STORAGE_URL from '../utils/storage'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import InstructorForm from './InstructorForm'
import { useConfirm } from '../components/ConfirmDialog'

export default function Instructors() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getInstructors().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
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
    const ok = await confirm('Delete this instructor?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteInstructor(id)
    load()
  }

  const filtered = items.filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'name', label: 'Name', render: (row) => (
      <div className="flex items-center gap-3">
        {row.photo && <img src={`${STORAGE_URL}${row.photo}`} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />}
        <span className="font-semibold text-slate-800">{row.name}</span>
      </div>
    )},
    { key: 'specialties', label: 'Specialty', render: (row) => <span className="text-slate-500">{row.specialties || '—'}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenEdit(row.id)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer border-0">
            <Pencil size={14} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn-danger !p-2 rounded-xl transition-colors border-0">
            <Trash2 size={14} />
          </button>
        </div>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Instructors" description="Manage your studio instructors"
        actions={(
          <>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search instructors..." value={search} onChange={e => setSearch(e.target.value)} className="!w-56 !pl-9" />
            </div>
            <button onClick={handleOpenCreate} className="btn-primary text-xs cursor-pointer border-0">
              <Plus size={16} strokeWidth={2.5} /> New Instructor
            </button>
          </>
        )} />
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No instructors yet." />
      
      {/* Modal Popup */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editId ? 'Edit Instructor' : 'Create New Instructor'} maxWidth="max-w-xl">
        <InstructorForm editId={editId} onSuccess={handleFormSuccess} onCancel={handleCloseModal} />
      </Modal>

      {dialog}
    </div>
  )
}
