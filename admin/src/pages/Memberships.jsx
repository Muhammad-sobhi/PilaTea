import { useState, useEffect } from 'react'
import { getMemberships, deleteMembership } from '../utils/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import MembershipForm from './MembershipForm'
import { useConfirm } from '../components/ConfirmDialog'

export default function Memberships() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getMemberships().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
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
    const ok = await confirm('Delete this membership plan? This cannot be undone.', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteMembership(id)
    load()
  }

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-semibold text-slate-800">{row.name}</span> },
    { key: 'price', label: 'Price', render: (row) => <span className="font-semibold text-slate-800">${row.price}</span> },
    { key: 'duration_days', label: 'Duration', render: (row) => <span className="text-slate-500">{row.duration_days} days</span> },
    { key: 'description', label: 'Description', render: (row) => <span className="text-slate-500 text-xs truncate max-w-[200px] inline-block">{row.description || '—'}</span> },
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
      <PageHeader title="Memberships" description="Manage subscription plans"
        actions={
          <button onClick={handleOpenCreate} className="btn-primary text-xs cursor-pointer border-0">
            <Plus size={16} strokeWidth={2.5} /> New Plan
          </button>
        } 
      />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No membership plans yet." />
      
      {/* Modal Popup */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editId ? 'Edit Membership Plan' : 'Create New Membership Plan'} maxWidth="max-w-xl">
        <MembershipForm editId={editId} onSuccess={handleFormSuccess} onCancel={handleCloseModal} />
      </Modal>

      {dialog}
    </div>
  )
}

