import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMembership, createMembership, updateMembership } from '../utils/api'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function MembershipForm({ editId, onSuccess, onCancel }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const id = editId !== undefined ? editId : paramId
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', description: '', price: '', duration_days: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getMembership(id).then(r => {
        const d = r.data || r
        setForm({ name: d.name, description: d.description || '', price: d.price, duration_days: d.duration_days })
      }).catch(() => {
        if (onCancel) onCancel()
        else navigate('/admin/memberships')
      })
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleClose = () => {
    if (onCancel) onCancel()
    else navigate('/admin/memberships')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) await updateMembership(id, form)
      else await createMembership(form)
      if (onSuccess) onSuccess()
      else navigate('/admin/memberships')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving membership')
    }
  }

  return (
    <div className="animate-fadeIn w-full">
      {!onSuccess && (
        <PageHeader title={isEdit ? 'Edit Membership' : 'New Membership'} description={isEdit ? 'Update membership plan' : 'Create a new membership plan'}
          actions={<button onClick={handleClose} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      )}
      {error && <div className="mb-6 rounded-2xl px-4 py-3 text-sm font-semibold bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className={onSuccess ? '' : 'card p-6 sm:p-8'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="e.g. Silver, Gold, Unlimited" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
              <textarea rows="3" value={form.description} onChange={set('description')} placeholder="Plan description..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Price ($)</label>
              <input type="number" required value={form.price} onChange={set('price')} placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Duration (days)</label>
              <input type="number" required value={form.duration_days} onChange={set('duration_days')} placeholder="30" />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button type="button" onClick={handleClose} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" className="btn-primary text-xs">{isEdit ? 'Update Plan' : 'Create Plan'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

