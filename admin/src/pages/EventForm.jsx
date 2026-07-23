import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEvent, createEvent, updateEvent, getInstructors } from '../utils/api'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import STORAGE_URL from '../utils/storage'

export default function EventForm({ editId, onSuccess, onCancel }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const id = editId !== undefined ? editId : paramId
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ title: '', description: '', event_type: 'outdoor', event_date: '', start_time: '', location_name: '', address: '', end_time: '', price: '', capacity: '', instructor_id: '', featured: false, status: 'published', image: null, byo_enabled: false, byo_capacity: '', byo_price: '', byo_description: '' })
  const [instructors, setInstructors] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getInstructors().then(r => setInstructors(r.data || [])).catch(() => {})
    if (isEdit) {
      getEvent(id).then(r => {
        const d = r.data || r
        setForm({ title: d.title, description: d.description, event_type: d.event_type || 'outdoor', event_date: d.event_date, start_time: d.start_time, location_name: d.location_name, address: d.address || '', end_time: d.end_time || '', price: d.price, capacity: d.capacity, instructor_id: d.instructor_id || '', featured: !!d.featured, status: d.status || 'published', image: d.image || null, byo_enabled: !!d.byo_enabled, byo_capacity: d.byo_capacity || '', byo_price: d.byo_price || '', byo_description: d.byo_description || '' })
      }).catch(() => {
        if (onCancel) onCancel()
        else navigate('/admin/events')
      })
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setCheck = (k) => (e) => setForm({ ...form, [k]: e.target.checked })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const fd = new FormData()
      for (const [key, value] of Object.entries(form)) {
        if (value !== null && value !== undefined) {
          if (key === 'featured' || key === 'byo_enabled') {
            fd.append(key, value ? '1' : '0')
          } else {
            fd.append(key, value)
          }
        }
      }
      if (isEdit) await updateEvent(id, fd)
      else await createEvent(fd)
      if (onSuccess) onSuccess()
      else navigate('/admin/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving event')
    }
  }

  const handleClose = () => {
    if (onCancel) onCancel()
    else navigate('/admin/events')
  }

  return (
    <div className="animate-fadeIn w-full">
      {!onSuccess && (
        <PageHeader title={isEdit ? 'Edit Event' : 'New Event'} description={isEdit ? 'Update event details' : 'Create a new studio event'}
          actions={<button onClick={handleClose} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      )}
      {error && <div className="mb-6 rounded-2xl px-4 py-3 text-sm font-semibold bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className={onSuccess ? '' : 'card p-6 sm:p-8'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Title</label>
              <input type="text" required value={form.title} onChange={set('title')} placeholder="Event title..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
              <textarea rows="3" value={form.description} onChange={set('description')} placeholder="Event description..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Event Type</label>
              <select required value={form.event_type} onChange={set('event_type')}>
                <option value="outdoor">Outdoor</option>
                <option value="indoor">Indoor</option>
                <option value="studio">Studio</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Date</label>
              <input type="date" required value={form.event_date} onChange={set('event_date')} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Start Time</label>
              <input type="time" required value={form.start_time} onChange={set('start_time')} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">End Time</label>
              <input type="time" value={form.end_time} onChange={set('end_time')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Location Name</label>
              <input type="text" required value={form.location_name} onChange={set('location_name')} placeholder="e.g. Central Park Studio" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Address</label>
              <input type="text" value={form.address} onChange={set('address')} placeholder="Full address (optional)" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Price ($)</label>
              <input type="number" required value={form.price} onChange={set('price')} placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Capacity</label>
              <input type="number" required value={form.capacity} onChange={set('capacity')} placeholder="20" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Instructor</label>
              <select value={form.instructor_id} onChange={set('instructor_id')}>
                <option value="">No instructor</option>
                {instructors.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Event Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setForm({ ...form, image: e.target.files[0] });
                  }
                }} 
                className="file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700"
              />
              {form.image && typeof form.image === 'string' && (
                <div className="mt-3">
                  <p className="text-xs text-slate-400 mb-1 font-medium">Current Image Preview:</p>
                  <img 
                    src={`${STORAGE_URL}${form.image}`} 
                    alt="Event Image" 
                    className="max-h-36 rounded-2xl object-cover border border-slate-100"
                  />
                </div>
              )}
              {form.image && typeof form.image !== 'string' && (
                <div className="mt-3">
                  <p className="text-xs text-slate-400 mb-1 font-medium">New Image Selected:</p>
                  <img 
                    src={URL.createObjectURL(form.image)} 
                    alt="New Event Image Preview" 
                    className="max-h-36 rounded-2xl object-cover border border-slate-100"
                  />
                </div>
              )}
            </div>
            {isEdit && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
                <select value={form.status} onChange={set('status')}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.byo_enabled} onChange={setCheck('byo_enabled')} className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-400" />
                <span className="text-xs font-semibold text-slate-700">Enable BYO (Bring Your Own Mat) Booking option</span>
              </label>
            </div>
            {form.byo_enabled && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">BYO Capacity</label>
                  <input type="number" required={form.byo_enabled} value={form.byo_capacity} onChange={set('byo_capacity')} placeholder="e.g. 10" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">BYO Price ($)</label>
                  <input type="number" required={form.byo_enabled} value={form.byo_price} onChange={set('byo_price')} placeholder="e.g. 20" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">BYO Description</label>
                  <input type="text" value={form.byo_description} onChange={set('byo_description')} placeholder="e.g. Bring your own mat" />
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={setCheck('featured')} className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-400" />
                <span className="text-xs font-semibold text-slate-700">Featured event</span>
              </label>
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button type="button" onClick={handleClose} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" className="btn-primary text-xs">{isEdit ? 'Update Event' : 'Create Event'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
