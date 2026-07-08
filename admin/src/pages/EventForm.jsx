import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEvent, createEvent, updateEvent, getInstructors } from '../utils/api'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function EventForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ title: '', description: '', event_type: 'outdoor', event_date: '', start_time: '', location_name: '', address: '', end_time: '', price: '', capacity: '', instructor_id: '', featured: false, status: 'published' })
  const [instructors, setInstructors] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getInstructors().then(r => setInstructors(r.data || [])).catch(() => {})
    if (isEdit) {
      getEvent(id).then(r => {
        const d = r.data || r
        setForm({ title: d.title, description: d.description, event_type: d.event_type || 'outdoor', event_date: d.event_date, start_time: d.start_time, location_name: d.location_name, address: d.address || '', end_time: d.end_time || '', price: d.price, capacity: d.capacity, instructor_id: d.instructor_id || '', featured: !!d.featured, status: d.status || 'published' })
      }).catch(() => navigate('/admin/events'))
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setCheck = (k) => (e) => setForm({ ...form, [k]: e.target.checked })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) await updateEvent(id, form)
      else await createEvent(form)
      navigate('/admin/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving event')
    }
  }

  return (
    <div className="animate-fadeIn max-w-2xl">
      <PageHeader title={isEdit ? 'Edit Event' : 'New Event'} description={isEdit ? 'Update event details' : 'Create a new studio event'}
        actions={<button onClick={() => navigate('/admin/events')} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      {error && <div className="mb-6 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Title</label>
              <input type="text" required value={form.title} onChange={set('title')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Description</label>
              <textarea rows="3" value={form.description} onChange={set('description')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Event Type</label>
              <select required value={form.event_type} onChange={set('event_type')}>
                <option value="outdoor">Outdoor</option>
                <option value="indoor">Indoor</option>
                <option value="studio">Studio</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Date</label>
              <input type="date" required value={form.event_date} onChange={set('event_date')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Start Time</label>
              <input type="time" required value={form.start_time} onChange={set('start_time')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">End Time</label>
              <input type="time" value={form.end_time} onChange={set('end_time')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Location Name</label>
              <input type="text" required value={form.location_name} onChange={set('location_name')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Address</label>
              <input type="text" value={form.address} onChange={set('address')} placeholder="Full address (optional)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Price ($)</label>
              <input type="number" required value={form.price} onChange={set('price')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Capacity</label>
              <input type="number" required value={form.capacity} onChange={set('capacity')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Instructor</label>
              <select value={form.instructor_id} onChange={set('instructor_id')}>
                <option value="">No instructor</option>
                {instructors.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
              </select>
            </div>
            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Status</label>
                <select value={form.status} onChange={set('status')}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={setCheck('featured')} className="rounded accent-[var(--color-brand-lilac)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">Featured event</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="btn-primary">{isEdit ? 'Update Event' : 'Create Event'}</button>
              <button type="button" onClick={() => navigate('/admin/events')} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
