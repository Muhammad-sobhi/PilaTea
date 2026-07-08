import { useState, useEffect } from 'react'
import { getTeaCategories, createTeaCategory, updateTeaCategory, deleteTeaCategory } from '../utils/api'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useConfirm } from '../components/ConfirmDialog'

export default function TeaCategories() {
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '' })
  const { confirm, dialog } = useConfirm()

  const load = () => { getTeaCategories().then(r => setItems(r.data || [])).catch(() => {}) }
  useEffect(() => { load() }, [])

  const startEdit = (item) => { setEditingId(item.id); setForm({ name: item.name }) }
  const cancelEdit = () => { setEditingId(null); setForm({ name: '' }) }

  const handleCreate = async () => {
    if (!form.name.trim()) return
    await createTeaCategory({ name: form.name })
    setForm({ name: '' })
    load()
  }

  const handleUpdate = async (id) => {
    if (!form.name.trim()) return
    await updateTeaCategory(id, { name: form.name })
    setEditingId(null)
    setForm({ name: '' })
    load()
  }

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this category?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteTeaCategory(id)
    load()
  }

  return (
    <div className="animate-fadeIn max-w-2xl">
      <PageHeader title="Tea Categories" description="Manage tea item categories and types" />
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-3">
          <input type="text" placeholder="New category name..." value={form.name} onChange={e => setForm({ name: e.target.value })}
            className="flex-1" />
          {editingId ? (
            <>
              <button onClick={() => handleUpdate(editingId)} className="btn-primary text-xs"><Check size={14} /> Save</button>
              <button onClick={cancelEdit} className="btn-secondary text-xs"><X size={14} /> Cancel</button>
            </>
          ) : (
            <button onClick={handleCreate} className="btn-primary text-xs"><Plus size={14} /> Add</button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {items.map(cat => (
          <div key={cat.id} className="card p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text)]">{cat.name}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(cat)} className="btn-secondary text-xs !px-3 !py-1.5"><Pencil size={14} /> Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No categories yet.</p>}
      </div>
      {dialog}
    </div>
  )
}
