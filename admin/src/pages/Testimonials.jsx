import { useState, useEffect } from 'react'
import { getTestimonials, updateTestimonialStatus, deleteTestimonial } from '../utils/api'
import { Trash2, Check, X, Eye } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

export default function Testimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewItem, setViewItem] = useState(null)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getTestimonials().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this testimonial?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteTestimonial(id)
    load()
  }

  const toggleStatus = (id, current) => {
    updateTestimonialStatus(id, current ? 0 : 1).then(() => load()).catch(() => {})
  }

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-semibold text-[var(--color-text)]">{row.name}</span> },
    { key: 'content', label: 'Content', render: (row) => <span className="text-[var(--color-text-secondary)] text-sm truncate max-w-[300px] inline-block">{row.content}</span> },
    {
      key: 'is_active', label: 'Active',
      render: (row) => row.is_active
        ? <span className="badge bg-green-50 text-green-700 border border-green-200">Active</span>
        : <span className="badge bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)]">Hidden</span>
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setViewItem(row)} className="btn-secondary text-xs !px-3 !py-1.5" title="View full testimonial"><Eye size={14} /> View</button>
          <button onClick={() => toggleStatus(row.id, row.is_active)} className={`btn-secondary text-xs !px-3 !py-1.5 ${row.is_active ? 'text-amber-600' : 'text-green-600'}`}>
            {row.is_active ? <X size={14} /> : <Check size={14} />} {row.is_active ? 'Hide' : 'Show'}
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
        </div>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Testimonials" description="Manage customer reviews and testimonials" />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No testimonials yet." />
      {dialog}

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewItem(null)}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewItem(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-lg">&times;</button>
            <h3 className="text-lg font-semibold mb-1">{viewItem.name}</h3>
            {viewItem.role && <p className="text-sm text-[var(--color-text-muted)] mb-4">{viewItem.role}</p>}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{viewItem.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
