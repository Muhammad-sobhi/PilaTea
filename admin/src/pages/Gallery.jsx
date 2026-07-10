import { useState, useEffect } from 'react'
import api, { getGallery, deleteGalleryItem, updateGalleryItem } from '../utils/api'
import STORAGE_URL from '../utils/storage'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useConfirm } from '../components/ConfirmDialog'



export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', alt_text: '', caption: '', category: 'general', image: null })
  const [submitting, setSubmitting] = useState(false)
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getGallery().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ title: '', alt_text: '', caption: '', category: 'general', image: null })
    setEditing(null)
  }

  const handleFile = (e) => setForm({ ...form, image: e.target.files[0] })

  const openEdit = (item) => {
    setEditing(item)
    setForm({ title: item.title || '', alt_text: item.alt_text || '', caption: item.caption || '', category: item.category || 'general', image: null })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editing && !form.image) return
    setSubmitting(true)
    try {
      const fd = new FormData()
      if (form.image) fd.append('image', form.image)
      fd.append('title', form.title)
      fd.append('alt_text', form.alt_text)
      fd.append('caption', form.caption)
      fd.append('category', form.category)
      if (editing) {
        fd.append('_method', 'PUT')
        await api.post(`/admin/gallery/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/admin/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      resetForm()
      setShowForm(false)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this gallery image?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteGalleryItem(id)
    load()
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Gallery" description="Manage gallery images and media"
        actions={<button onClick={() => { resetForm(); setShowForm(!showForm) }} className="btn-primary text-sm"><Plus size={16} /> Upload Images</button>} />

      {showForm && (
        <div className="card p-5 mb-6 border-l-4 border-l-[var(--color-brand-lilac)]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Image File {!editing && '*'}</label>
                <input type="file" accept="image/*" onChange={handleFile} className="file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[var(--color-brand-lilac)] file:text-white" />
                {editing && <p className="text-xs text-[var(--color-text-muted)] mt-1">Leave empty to keep current image</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="general">General</option>
                  <option value="Events">Events</option>
                  <option value="Tea">Tea</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Alt Text (for accessibility)</label>
                <input type="text" value={form.alt_text} onChange={e => setForm({ ...form, alt_text: e.target.value })} placeholder="Describe what the image shows" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Text Overlay (displayed on image)</label>
                <input type="text" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Text shown on top of the image" />
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-3 border-t border-[var(--color-border)]">
              <button type="submit" disabled={submitting} className="btn-primary text-xs">{submitting ? 'Saving...' : editing ? 'Update' : 'Upload'}</button>
              <button type="button" onClick={() => { resetForm(); setShowForm(false) }} className="btn-secondary text-xs"><X size={14} /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton rounded-xl" style={{ aspectRatio: '4/3' }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">No images yet. Upload your first gallery image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="card overflow-hidden group relative">
              <div className="relative w-full h-48">
                <img src={item.image ? `${STORAGE_URL}${item.image}` : ''} alt={item.alt_text || item.title} className="w-full h-full object-cover" />
                {item.caption && (
                  <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                    <p className="text-white text-sm font-medium">{item.caption}</p>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button onClick={() => openEdit(item)} className="!bg-white/20 !text-white !border-white/30 hover:!bg-white/30 text-xs !px-3 !py-1.5 rounded-lg font-medium"><Pencil size={14} /> Edit</button>
                <button onClick={() => handleDelete(item.id)} className="btn-danger !border-white/30"><Trash2 size={16} /> Delete</button>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{item.title}</p>
                {item.category && <p className="text-xs text-[var(--color-text-muted)]">{item.category}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      {dialog}
    </div>
  )
}
