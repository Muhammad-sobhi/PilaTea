import { useState, useEffect } from 'react'
import { getExpenses, deleteExpense } from '../utils/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ExpenseForm from './ExpenseForm'
import { useConfirm } from '../components/ConfirmDialog'

const categoryColors = {
  material: 'bg-amber-50 text-amber-700 border-amber-200',
  services: 'bg-blue-50 text-blue-700 border-blue-200',
}

export default function Expenses() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getExpenses().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
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
    const ok = await confirm('Delete this expense?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteExpense(id)
    load()
  }

  const columns = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-semibold text-slate-800">{row.title}</span> },
    { key: 'amount', label: 'Amount', render: (row) => <span className="font-semibold text-red-600">${Number(row.amount).toFixed(2)}</span> },
    {
      key: 'category', label: 'Category',
      render: (row) => <span className={`badge ${categoryColors[row.category] || 'bg-slate-100 text-slate-600'}`}>{row.category}</span>
    },
    { key: 'expense_date', label: 'Date', render: (row) => <span className="text-slate-500">{row.expense_date}</span> },
    { key: 'description', label: 'Description', render: (row) => <span className="text-slate-500 text-xs max-w-[200px] truncate block">{row.description || '—'}</span> },
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
      <PageHeader title="Expenses" description="Track your studio expenses"
        actions={
          <button onClick={handleOpenCreate} className="btn-primary text-xs cursor-pointer border-0">
            <Plus size={16} strokeWidth={2.5} /> New Expense
          </button>
        }
      />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No expenses recorded yet." />
      
      {/* Modal Popup */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editId ? 'Edit Expense' : 'Record New Expense'} maxWidth="max-w-xl">
        <ExpenseForm editId={editId} onSuccess={handleFormSuccess} onCancel={handleCloseModal} />
      </Modal>

      {dialog}
    </div>
  )
}

