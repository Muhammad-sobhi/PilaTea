import { useState, useEffect } from 'react'
import { getMemberships, createMembership, updateMembership, deleteMembership } from '../utils/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

export default function Memberships() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getMemberships().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this membership plan? This cannot be undone.', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteMembership(id)
    load()
  }

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-semibold text-[var(--color-text)]">{row.name}</span> },
    { key: 'price', label: 'Price', render: (row) => <span className="font-medium text-[var(--color-text)]">${row.price}</span> },
    { key: 'duration_days', label: 'Duration', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.duration_days} days</span> },
    { key: 'description', label: 'Description', render: (row) => <span className="text-[var(--color-text-secondary)] text-sm truncate max-w-[200px] inline-block">{row.description || '—'}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/memberships/${row.id}/edit`} className="btn-secondary text-xs !px-3 !py-1.5 no-underline"><Pencil size={14} /> Edit</Link>
          <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
        </div>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Memberships" description="Manage subscription plans"
        actions={<Link to="/admin/memberships/new" className="btn-primary text-sm no-underline"><Plus size={16} /> New Plan</Link>} />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No membership plans yet." />
      {dialog}
    </div>
  )
}
