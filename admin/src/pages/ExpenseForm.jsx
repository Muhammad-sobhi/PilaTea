import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getExpense, createExpense, updateExpense } from '../utils/api'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function ExpenseForm({ editId, onSuccess, onCancel }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const id = editId !== undefined ? editId : paramId
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ title: '', amount: '', category: 'material', description: '', expense_date: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getExpense(id).then(r => {
        const d = r.data || r
        setForm({ title: d.title, amount: d.amount, category: d.category, description: d.description || '', expense_date: d.expense_date })
      }).catch(() => {
        if (onCancel) onCancel()
        else navigate('/admin/expenses')
      })
    }
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleClose = () => {
    if (onCancel) onCancel()
    else navigate('/admin/expenses')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) await updateExpense(id, form)
      else await createExpense(form)
      if (onSuccess) onSuccess()
      else navigate('/admin/expenses')
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving expense')
    }
  }

  return (
    <div className="animate-fadeIn w-full">
      {!onSuccess && (
        <PageHeader title={isEdit ? 'Edit Expense' : 'New Expense'} description={isEdit ? 'Update expense details' : 'Record a new expense'}
          actions={<button onClick={handleClose} className="btn-secondary text-sm"><ArrowLeft size={16} /> Back</button>} />
      )}
      {error && <div className="mb-6 rounded-2xl px-4 py-3 text-sm font-semibold bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className={onSuccess ? '' : 'card p-6 sm:p-8'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Title</label>
              <input type="text" required value={form.title} onChange={set('title')} placeholder="e.g. Electricity bill" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Amount ($)</label>
              <input type="number" step="0.01" required value={form.amount} onChange={set('amount')} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
              <select required value={form.category} onChange={set('category')}>
                <option value="material">Material</option>
                <option value="services">Services</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Date</label>
              <input type="date" required value={form.expense_date} onChange={set('expense_date')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description (optional)</label>
              <textarea rows="3" value={form.description} onChange={set('description')} placeholder="Additional details..." />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button type="button" onClick={handleClose} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" className="btn-primary text-xs">{isEdit ? 'Update Expense' : 'Create Expense'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

