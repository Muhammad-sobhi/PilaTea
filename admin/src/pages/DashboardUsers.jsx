import { useState, useEffect } from 'react'
import { getDashboardUsers, createDashboardUser, updateDashboardUser, deleteDashboardUser } from '../utils/api'
import { Search, UserPlus, Pencil, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

export default function DashboardUsers() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', phone: '' })
  const [msg, setMsg] = useState('')
  const { confirm, dialog } = useConfirm()
  
  const currentUser = JSON.parse(localStorage.getItem('admin_user') || '{}')

  const load = () => {
    setLoading(true)
    getDashboardUsers()
      .then(r => {
        setItems(r.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'employee', phone: '' })
    setMsg('')
    setEditId(null)
    setIsEdit(false)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setMsg('')
    setEditId(user.id)
    setIsEdit(true)
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '', // Leave password empty by default on edit
      role: user.role || 'employee',
      phone: user.phone || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      if (isEdit) {
        // Build payload
        const payload = { ...form }
        if (!payload.password) delete payload.password // don't update password if empty
        await updateDashboardUser(editId, payload)
        setMsg('User updated successfully!')
      } else {
        if (!form.password) {
          setMsg('Error: Password is required for new users')
          return
        }
        await createDashboardUser(form)
        setMsg('User created successfully!')
      }
      load()
      setTimeout(() => setShowModal(false), 1500)
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      alert('You cannot delete your own account!')
      return
    }
    const ok = await confirm('Are you sure you want to delete this dashboard user?', { confirmLabel: 'Delete' })
    if (!ok) return
    try {
      await deleteDashboardUser(id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const filtered = items.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    {
      key: 'name', label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-brand-pink)] to-[var(--color-brand-lilac)] flex items-center justify-center text-white text-xs font-bold">
            {row.name?.charAt(0)?.toUpperCase()}
          </div>
          <span className="font-semibold text-[var(--color-text)]">{row.name}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email', render: (row) => <a href={`mailto:${row.email}`} className="text-[var(--color-text-secondary)] no-underline hover:underline">{row.email}</a> },
    { key: 'phone', label: 'Phone', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.phone || '—'}</span> },
    {
      key: 'role', label: 'Role',
      render: (row) => (
        <span className={`badge ${row.role === 'admin' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          {row.role}
        </span>
      )
    },
    {
      key: 'created_at', label: 'Created',
      render: (row) => (
        <span className="text-[var(--color-text-secondary)] text-sm">
          {new Date(row.created_at).toLocaleDateString('en-GB')}
        </span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="btn-secondary text-xs !px-3 !py-1.5"><Pencil size={14} /> Edit</button>
          {row.id !== currentUser.id && (
            <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
          )}
        </div>
      )
    },
  ]

  // Verify currently logged in user is admin
  if (currentUser.role !== 'admin') {
    return (
      <div className="animate-fadeIn p-8 text-center card max-w-lg mx-auto mt-12">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">Access Denied</h3>
        <p className="text-sm text-[var(--color-text-secondary)]">Only administrators are authorized to access the Dashboard Users panel.</p>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Dashboard Users" description="Manage dashboard administrators and employees"
        actions={(
          <>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="!w-56 !pl-9" />
            </div>
            <button onClick={openCreateModal} className="btn-primary text-sm"><UserPlus size={16} /> New User</button>
          </>
        )} />
      
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No dashboard users found." />
      {dialog}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Dashboard User' : 'New Dashboard User'}</h3>
            {msg && (
              <div className={`mb-4 rounded-lg px-4 py-3 text-sm flex items-center gap-2 ${msg.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {msg.includes('Error') ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                {msg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isEdit ? 'Password (leave blank to keep current)' : 'Password'}</label>
                <input type="password" required={!isEdit} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="employee">Employee</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">{isEdit ? 'Save Changes' : 'Create User'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
