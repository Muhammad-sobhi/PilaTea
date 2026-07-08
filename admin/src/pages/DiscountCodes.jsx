import { useState, useEffect } from 'react'
import { getDiscountCodes, createDiscountCode, deleteDiscountCode } from '../utils/api'
import { Plus, Trash2, Check, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

export default function DiscountCodes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', value: '', discount_type: 'percentage', max_uses: '', expires_at: '' })
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getDiscountCodes().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const resetForm = () => setForm({ code: '', value: '', discount_type: 'percentage', max_uses: '', expires_at: '' })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.discount) return
    await createDiscountCode(form)
    resetForm()
    setShowForm(false)
    load()
  }

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this discount code?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteDiscountCode(id)
    load()
  }

  const columns = [
    { key: 'code', label: 'Code', render: (row) => <code className="text-sm font-semibold text-[var(--color-text)] bg-[var(--color-bg-alt)] px-2 py-0.5 rounded border border-[var(--color-border)]">{row.code}</code> },
    { key: 'value', label: 'Discount', render: (row) => <span className="font-medium text-[var(--color-text)]">{row.discount_type === 'percentage' ? `${row.value}%` : `$${row.value}`}</span> },
    { key: 'used_count', label: 'Uses', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.used_count || 0}{row.max_uses ? ` / ${row.max_uses}` : ''}</span> },
    { key: 'expires_at', label: 'Expires', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.expires_at ? new Date(row.expires_at).toLocaleDateString() : '—'}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Discount Codes" description="Manage promotional discount codes"
        actions={<button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus size={16} /> New Code</button>} />
      {showForm && (
        <div className="card p-5 mb-6 border-l-4 border-l-[var(--color-brand-lilac)]">
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Code</label>
                <input type="text" required placeholder="SUMMER20" value={form.code} onChange={set('code')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Value</label>
                <input type="number" required placeholder="20" value={form.value} onChange={set('value')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Type</label>
                <select value={form.discount_type} onChange={set('discount_type')}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Max Uses</label>
                <input type="number" placeholder="Unlimited" value={form.max_uses} onChange={set('max_uses')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Expires</label>
                <input type="date" value={form.expires_at} onChange={set('expires_at')} />
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-3 border-t border-[var(--color-border)]">
              <button type="submit" className="btn-primary text-xs"><Check size={14} /> Create</button>
              <button type="button" onClick={() => { setShowForm(false); resetForm() }} className="btn-secondary text-xs"><X size={14} /> Cancel</button>
            </div>
          </form>
        </div>
      )}
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No discount codes yet." />
      {dialog}
    </div>
  )
}
