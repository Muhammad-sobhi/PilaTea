import { useState, useEffect } from 'react'
import { getInstructors, deleteInstructor } from '../utils/api'
import STORAGE_URL from '../utils/storage'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

export default function Instructors() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getInstructors().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

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
        {row.photo && <img src={`${STORAGE_URL}${row.photo}`} alt={row.name} className="w-8 h-8 rounded-full object-cover" />}
        <span className="font-semibold text-[var(--color-text)]">{row.name}</span>
      </div>
    )},
    { key: 'specialties', label: 'Specialty', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.specialties || '—'}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/instructors/${row.id}/edit`} className="btn-secondary text-xs !px-3 !py-1.5 no-underline"><Pencil size={14} /> Edit</Link>
          <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
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
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input type="text" placeholder="Search instructors..." value={search} onChange={e => setSearch(e.target.value)} className="!w-56 !pl-9" />
            </div>
            <Link to="/admin/instructors/new" className="btn-primary no-underline text-sm"><Plus size={16} /> New Instructor</Link>
          </>
        )} />
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No instructors yet. Add your first instructor." />
      {dialog}
    </div>
  )
}
