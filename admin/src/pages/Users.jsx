import { useState, useEffect } from 'react'
import api from '../utils/api'
import { Search, Eye, Calendar } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'

export default function Users() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/admin/users').then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

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
    {
      key: 'created_at', label: 'Joined',
      render: (row) => (
        <span className="text-[var(--color-text-secondary)] text-sm">
          {new Date(row.created_at).toLocaleDateString('en-GB')}
        </span>
      )
    },
    {
      key: 'bookings_count', label: 'Bookings',
      render: (row) => (
        <span className="badge bg-[var(--color-bg-alt)] text-[var(--color-text)]">
          <Calendar size={12} className="inline mr-1" />
          {row.bookings_count || 0}
        </span>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Users" description="Registered customer accounts"
        actions={(
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="!w-56 !pl-9" />
          </div>
        )} />
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No registered users yet." />
    </div>
  )
}
