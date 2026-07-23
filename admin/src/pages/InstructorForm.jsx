import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInstructor, createInstructor, updateInstructor } from '../utils/api'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function InstructorForm({ editId, onSuccess, onCancel }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const id = editId !== undefined ? editId : paramId
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', specialties: '', bio: '', photo: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getInstructor(id).then(r => {
        const d = r.data || r
        setForm({ name: d.name, specialties: d.specialties || '', bio: d.bio || '', photo: d.photo || '' })
      }).catch(() => {
        if (onCancel) onCancel()
        else navigate('/admin/instructors')
      })
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleClose = () => {
    if (onCancel) onCancel()
    else navigate('/admin/instructors')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) await updateInstructor(id, form)
      else await createInstructor(form)
      if (onSuccess) onSuccess()
      else navigate('/admin/instructors')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving instructor')
    }
  }

  return (
    <div className="animate-fadeIn w-full">
      {!onSuccess && (
        <PageHeader title={isEdit ? 'Edit Instructor' : 'New Instructor'} description={isEdit ? 'Update instructor details' : 'Add a new instructor'}
          actions={<button onClick={handleClose} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      )}
      {error && <div className="mb-6 rounded-2xl px-4 py-3 text-sm font-semibold bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className={onSuccess ? '' : 'card p-6 sm:p-8'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="Instructor name..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Specialties</label>
              <input type="text" value={form.specialties} onChange={set('specialties')} placeholder="e.g. Pilates, Yoga" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Bio</label>
              <textarea rows="3" value={form.bio} onChange={set('bio')} placeholder="Instructor bio..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Photo (storage path)</label>
              <input type="text" value={form.photo} onChange={set('photo')} placeholder="e.g. instructors/photo.jpg" />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button type="button" onClick={handleClose} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" className="btn-primary text-xs">{isEdit ? 'Update Instructor' : 'Create Instructor'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

