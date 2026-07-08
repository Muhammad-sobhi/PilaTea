import { useState, useEffect } from 'react'
import { getExpenses, deleteExpense } from '../utils/api'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

const categoryColors = {
  material: 'bg-amber-50 text-amber-700 border-amber-200',
  services: 'bg-blue-50 text-blue-700 border-blue-200',
}

export default function Expenses() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getExpenses().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this expense?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteExpense(id)
    load()
  }

  const columns = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-semibold text-[var(--color-text)]">{row.title}</span> },
    { key: 'amount', label: 'Amount', render: (row) => <span className="font-semibold text-red-600">${Number(row.amount).toFixed(2)}</span> },
    {
      key: 'category', label: 'Category',
      render: (row) => <span className={`badge ${categoryColors[row.category] || categoryColors.other}`}>{row.category}</span>
    },
    { key: 'expense_date', label: 'Date', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.expense_date}</span> },
    { key: 'description', label: 'Description', render: (row) => <span className="text-[var(--color-text-muted)] text-sm max-w-[200px] truncate block">{row.description || '—'}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/expenses/${row.id}/edit`} className="btn-secondary text-xs !px-3 !py-1.5 no-underline"><Pencil size={14} /> Edit</Link>
          <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
        </div>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Expenses" description="Track your studio expenses"
        actions={
          <Link to="/admin/expenses/new" className="btn-primary no-underline text-sm"><Plus size={16} /> New Expense</Link>
        }
      />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No expenses recorded yet." />
      {dialog}
    </div>
  )
}
