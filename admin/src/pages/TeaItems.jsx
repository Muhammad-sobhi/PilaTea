import { useState, useEffect } from 'react'
import { getTeaItems, deleteTeaItem } from '../utils/api'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import TeaItemForm from './TeaItemForm'
import { useConfirm } from '../components/ConfirmDialog'

export default function TeaItems() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getTeaItems().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
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
    const ok = await confirm('Delete this tea item?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteTeaItem(id)
    load()
  }

  const filtered = items.filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.category?.name?.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-semibold text-slate-800">{row.name}</span> },
    { key: 'price', label: 'Price', render: (row) => <span className="font-semibold text-slate-800">${row.price}</span> },
    { key: 'category', label: 'Category', render: (row) => <span className="text-slate-500">{row.category?.name || '—'}</span> },
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
      <PageHeader title="Tea Items" description="Manage your tea menu"
        actions={(
          <>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search tea items..." value={search} onChange={e => setSearch(e.target.value)} className="!w-56 !pl-9" />
            </div>
            <button onClick={handleOpenCreate} className="btn-primary text-xs cursor-pointer border-0">
              <Plus size={16} strokeWidth={2.5} /> New Item
            </button>
          </>
        )} />
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No tea items yet." />
      
      {/* Modal Popup */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editId ? 'Edit Tea Item' : 'Create New Tea Item'} maxWidth="max-w-xl">
        <TeaItemForm editId={editId} onSuccess={handleFormSuccess} onCancel={handleCloseModal} />
      </Modal>

      {dialog}
    </div>
  )
}

