import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMembership, createMembership, updateMembership } from '../utils/api'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function MembershipForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', description: '', price: '', duration_days: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getMembership(id).then(r => {
        const d = r.data || r
        setForm({ name: d.name, description: d.description || '', price: d.price, duration_days: d.duration_days })
      }).catch(() => navigate('/admin/memberships'))
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) await updateMembership(id, form)
      else await createMembership(form)
      navigate('/admin/memberships')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving membership')
    }
  }

  return (
    <div className="animate-fadeIn max-w-2xl">
      <PageHeader title={isEdit ? 'Edit Membership' : 'New Membership'} description={isEdit ? 'Update membership plan' : 'Create a new membership plan'}
        actions={<button onClick={() => navigate('/admin/memberships')} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      {error && <div className="mb-6 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="e.g. Silver, Gold, Unlimited" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Description</label>
              <textarea rows="3" value={form.description} onChange={set('description')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Price ($)</label>
              <input type="number" required value={form.price} onChange={set('price')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Duration (days)</label>
              <input type="number" required value={form.duration_days} onChange={set('duration_days')} />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="btn-primary">{isEdit ? 'Update Plan' : 'Create Plan'}</button>
              <button type="button" onClick={() => navigate('/admin/memberships')} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
