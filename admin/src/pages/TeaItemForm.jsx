import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { getTeaItem, createTeaItem, updateTeaItem, getTeaCategories } from '../utils/api'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'

const STORAGE_URL = 'http://localhost:8000/storage/'

export default function TeaItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getTeaCategories().then(r => setCategories(r.data || [])).catch(() => {})
    if (isEdit) {
      getTeaItem(id).then(r => {
        const d = r.data || r
        setForm({ name: d.name, description: d.description || '', price: d.price, category_id: d.category_id || '' })
        if (d.image) setPreview(`${STORAGE_URL}${d.image}`)
      }).catch(() => navigate('/admin/tea-items'))
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleFile = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
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
      navigate('/admin/tea-items')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving tea item')
    }
  }

  return (
    <div className="animate-fadeIn max-w-2xl">
      <PageHeader title={isEdit ? 'Edit Tea Item' : 'New Tea Item'} description={isEdit ? 'Update tea item details' : 'Add a new item to your tea menu'}
        actions={<button onClick={() => navigate('/admin/tea-items')} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      {error && <div className="mb-6 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={set('name')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Description</label>
              <textarea rows="3" value={form.description} onChange={set('description')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Image</label>
              <input type="file" accept="image/*" onChange={handleFile} className="file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[var(--color-brand-lilac)] file:text-white" />
              {preview && <img src={preview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-lg" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Price ($)</label>
              <input type="number" required value={form.price} onChange={set('price')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Category</label>
              <select value={form.category_id} onChange={set('category_id')}>
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="btn-primary">{isEdit ? 'Update Item' : 'Create Item'}</button>
              <button type="button" onClick={() => navigate('/admin/tea-items')} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
