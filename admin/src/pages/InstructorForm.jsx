import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInstructor, createInstructor, updateInstructor } from '../utils/api'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function InstructorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', specialties: '', bio: '', photo: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getInstructor(id).then(r => {
        const d = r.data || r
        setForm({ name: d.name, specialties: d.specialties || '', bio: d.bio || '', photo: d.photo || '' })
      }).catch(() => navigate('/admin/instructors'))
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) await updateInstructor(id, form)
      else await createInstructor(form)
      navigate('/admin/instructors')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving instructor')
    }
  }

  return (
    <div className="animate-fadeIn max-w-2xl">
      <PageHeader title={isEdit ? 'Edit Instructor' : 'New Instructor'} description={isEdit ? 'Update instructor details' : 'Add a new instructor'}
        actions={<button onClick={() => navigate('/admin/instructors')} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      {error && <div className="mb-6 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Specialties</label>
              <input type="text" value={form.specialties} onChange={set('specialties')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Bio</label>
              <textarea rows="3" value={form.bio} onChange={set('bio')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Photo (storage path)</label>
              <input type="text" value={form.photo} onChange={set('photo')} placeholder="e.g. instructors/photo.jpg" />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="btn-primary">{isEdit ? 'Update Instructor' : 'Create Instructor'}</button>
              <button type="button" onClick={() => navigate('/admin/instructors')} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
