import { useState, useEffect } from 'react'
import { getBanners, createBanner, updateBanner, deleteBanner } from '../utils/api'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useConfirm } from '../components/ConfirmDialog'

export default function Banners() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', subtitle: '', link_text: '', link_url: '', active: false })
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getBanners().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const resetForm = () => setForm({ title: '', subtitle: '', link_text: '', link_url: '', active: false })

  const startEdit = (item) => { setEditingId(item.id); setForm({ title: item.title, subtitle: item.subtitle || '', link_text: item.link_text || '', link_url: item.link_url || '', active: item.active || false }) }
  const cancelEdit = () => { setEditingId(null); resetForm() }

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setCheck = (k) => (e) => setForm({ ...form, [k]: e.target.checked })

  const handleSave = async () => {
    if (!form.title.trim()) return
    if (editingId) await updateBanner(editingId, form)
    else await createBanner(form)
    cancelEdit()
    load()
  }

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this banner?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteBanner(id)
    load()
  }

  const formCard = editingId !== null && (
    <div className="card p-5 mb-6 border-l-4 border-l-[var(--color-brand-lilac)]">
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">{editingId ? 'Edit Banner' : 'New Banner'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Title</label>
          <input type="text" value={form.title} onChange={setField('title')} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Subtitle</label>
          <input type="text" value={form.subtitle} onChange={setField('subtitle')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Link Text</label>
          <input type="text" value={form.link_text} onChange={setField('link_text')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Link URL</label>
          <input type="text" value={form.link_url} onChange={setField('link_url')} />
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={setCheck('active')} className="rounded accent-[var(--color-brand-lilac)]" />
            <span className="text-sm font-medium text-[var(--color-text)]">Active</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-4 pt-3 border-t border-[var(--color-border)]">
        <button onClick={handleSave} className="btn-primary text-xs"><Check size={14} /> Save</button>
        <button onClick={cancelEdit} className="btn-secondary text-xs"><X size={14} /> Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Banners" description="Manage homepage hero banners"
        actions={<button onClick={() => { cancelEdit(); setEditingId(0) }} className="btn-primary text-sm"><Plus size={16} /> New Banner</button>} />
      {formCard}
      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="skeleton rounded-xl h-24" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-sm text-[var(--color-text-muted)]">No banners yet. Create your first banner.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map(banner => (
            <div key={banner.id} className="card p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">{banner.title}</h3>
                  {banner.active
                    ? <span className="badge bg-green-50 text-green-700 border border-green-200">Active</span>
                    : <span className="badge bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)]">Inactive</span>}
                </div>
                {banner.subtitle && <p className="text-xs text-[var(--color-text-muted)]">{banner.subtitle}</p>}
                {banner.link_text && <p className="text-xs text-[var(--color-brand-lilac)] mt-1">{banner.link_text} →</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(banner)} className="btn-secondary text-xs !px-3 !py-1.5"><Pencil size={14} /> Edit</button>
                <button onClick={() => handleDelete(banner.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {dialog}
    </div>
  )
}
