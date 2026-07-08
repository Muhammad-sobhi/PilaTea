import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTeaItems, deleteTeaItem } from '../utils/api'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

export default function TeaItems() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getTeaItems().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this tea item?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteTeaItem(id)
    load()
  }

  const filtered = items.filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.category?.name?.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-semibold text-[var(--color-text)]">{row.name}</span> },
    { key: 'price', label: 'Price', render: (row) => <span className="font-medium text-[var(--color-text)]">${row.price}</span> },
    { key: 'category', label: 'Category', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.category?.name || '—'}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/tea-items/${row.id}/edit`} className="btn-secondary text-xs !px-3 !py-1.5 no-underline"><Pencil size={14} /> Edit</Link>
          <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
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
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input type="text" placeholder="Search tea items..." value={search} onChange={e => setSearch(e.target.value)} className="!w-56 !pl-9" />
            </div>
            <Link to="/admin/tea-items/new" className="btn-primary no-underline text-sm"><Plus size={16} /> New Item</Link>
          </>
        )} />
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No tea items yet." />
      {dialog}
    </div>
  )
}
