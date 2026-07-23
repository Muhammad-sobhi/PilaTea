import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { getTeaItem, createTeaItem, updateTeaItem, getTeaCategories } from '../utils/api'
import STORAGE_URL from '../utils/storage'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function TeaItemForm({ editId, onSuccess, onCancel }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const id = editId !== undefined ? editId : paramId
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '', ingredients: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getTeaCategories().then(r => setCategories(r.data || [])).catch(() => {})
    if (isEdit) {
      getTeaItem(id).then(r => {
        const d = r.data || r
        setForm({ name: d.name, description: d.description || '', price: d.price, category_id: d.category_id || '', ingredients: d.ingredients || '' })
        if (d.image) setPreview(`${STORAGE_URL}${d.image}`)
      }).catch(() => {
        if (onCancel) onCancel()
        else navigate('/admin/tea-items')
      })
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleFile = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleClose = () => {
    if (onCancel) onCancel()
    else navigate('/admin/tea-items')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = image ? new FormData() : form
      if (image) {
        Object.entries(form).forEach(([k, v]) => payload.append(k, v))
        payload.append('image', image)
      }
      if (image) {
        if (isEdit) {
          await api.post(`/admin/tea-items/${id}?_method=PUT`, payload, { headers: { 'Content-Type': 'multipart/form-data' } })
        } else {
          await api.post('/admin/tea-items', payload, { headers: { 'Content-Type': 'multipart/form-data' } })
        }
      } else {
        if (isEdit) await updateTeaItem(id, form)
        else await createTeaItem(form)
      }
      if (onSuccess) onSuccess()
      else navigate('/admin/tea-items')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving tea item')
    }
  }

  return (
    <div className="animate-fadeIn w-full">
      {!onSuccess && (
        <PageHeader title={isEdit ? 'Edit Tea Item' : 'New Tea Item'} description={isEdit ? 'Update tea item details' : 'Add a new item to your tea menu'}
          actions={<button onClick={handleClose} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      )}
      {error && <div className="mb-6 rounded-2xl px-4 py-3 text-sm font-semibold bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className={onSuccess ? '' : 'card p-6 sm:p-8'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="Tea name..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
              <textarea rows="3" value={form.description} onChange={set('description')} placeholder="Tea description..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tags / Ingredients (comma-separated)</label>
              <input type="text" value={form.ingredients} onChange={set('ingredients')} placeholder="Relax, Calm, Sleep" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Image</label>
              <input type="file" accept="image/*" onChange={handleFile} className="file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700" />
              {preview && <img src={preview} alt="Preview" className="mt-3 h-32 w-32 object-cover rounded-2xl border border-slate-100" />}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Price ($)</label>
              <input type="number" required value={form.price} onChange={set('price')} placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
              <select value={form.category_id} onChange={set('category_id')}>
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button type="button" onClick={handleClose} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" className="btn-primary text-xs">{isEdit ? 'Update Item' : 'Create Item'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

