import { useState, useEffect } from 'react'
import { getContacts, updateContactRead, deleteContact, updateSubscription, sendMarketingEmail } from '../utils/api'
import { Trash2, Check, X, Mail, Send } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { useConfirm } from '../components/ConfirmDialog'

export default function Contacts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSubscribersOnly, setShowSubscribersOnly] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailForm, setEmailForm] = useState({ subject: '', body: '', contactId: null, contactEmail: '' })
  const [sending, setSending] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')
  const { confirm, dialog } = useConfirm()

  const load = () => {
    setLoading(true)
    getContacts().then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this contact?', { confirmLabel: 'Delete' })
    if (!ok) return
    await deleteContact(id)
    load()
  }

  const toggleRead = (id, current) => {
    updateContactRead(id, !current).then(() => load()).catch(() => {})
  }

  const toggleSub = (id, current) => {
    updateSubscription(id, !current).then(() => load()).catch(() => {})
  }

  const openEmailModal = (contact) => {
    setEmailForm({ subject: '', body: '', contactId: contact.id, contactEmail: contact.email })
    setEmailMsg('')
    setShowEmailModal(true)
  }

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setSending(true)
    setEmailMsg('')
    try {
      await sendMarketingEmail({
        subject: emailForm.subject,
        body: emailForm.body,
        recipient_type: 'single',
        contact_id: emailForm.contactId,
      })
      setEmailMsg('Email sent successfully!')
      load()
      setTimeout(() => setShowEmailModal(false), 1500)
    } catch (err) {
      setEmailMsg('Error: ' + (err.response?.data?.message || err.message))
    } finally {
      setSending(false)
    }
  }

  const filtered = showSubscribersOnly ? items.filter(c => c.is_subscribed) : items

  const columns = [
    { key: 'name', label: 'Name', render: (row) => (
      <span className={`font-semibold text-[var(--color-text)] ${!row.is_read ? 'text-[var(--color-brand-pink)]' : ''}`}>{row.name}</span>
    )},
    { key: 'email', label: 'Email', render: (row) => <a href={`mailto:${row.email}`} className="text-[var(--color-text-secondary)] no-underline hover:underline text-sm">{row.email}</a> },
    { key: 'subject', label: 'Subject', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.subject}</span> },
    {
      key: 'is_subscribed', label: 'Subscriber',
      render: (row) => row.is_subscribed
        ? <span className="badge bg-green-50 text-green-700 border border-green-200">Yes</span>
        : <span className="badge bg-gray-50 text-gray-600 border border-gray-200">No</span>
    },
    {
      key: 'email_sent_at', label: 'Email Sent',
      render: (row) => row.email_sent_at
        ? <span className="badge bg-blue-50 text-blue-700 border border-blue-200">{new Date(row.email_sent_at).toLocaleDateString()}</span>
        : <span className="badge bg-amber-50 text-amber-700 border border-amber-200">Not sent</span>
    },
    {
      key: 'is_read', label: 'Status',
      render: (row) => row.is_read
        ? <span className="badge bg-green-50 text-green-700 border border-green-200">Read</span>
        : <span className="badge bg-amber-50 text-amber-700 border border-amber-200">New</span>
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEmailModal(row)} className="btn-secondary text-xs !px-3 !py-1.5 text-blue-600">
            <Send size={14} /> Email
          </button>
          <button onClick={() => toggleRead(row.id, row.is_read)} className={`btn-secondary text-xs !px-3 !py-1.5 ${row.is_read ? 'text-amber-600' : 'text-green-600'}`}>
            {row.is_read ? <X size={14} /> : <Check size={14} />} {row.is_read ? 'Unread' : 'Read'}
          </button>
          <button onClick={() => toggleSub(row.id, row.is_subscribed)} className="btn-secondary text-xs !px-3 !py-1.5">
            {row.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn-danger"><Trash2 size={14} /> Delete</button>
        </div>
      )
    },
  ]

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Contacts" description="Messages from the contact form and subscriber management"
        actions={
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={showSubscribersOnly} onChange={e => setShowSubscribersOnly(e.target.checked)}
              className="rounded accent-[var(--color-brand-lilac)]" />
            <span className="text-[var(--color-text-secondary)]">Subscribers only</span>
          </label>
        }
      />
      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No messages yet." />
      {dialog}

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowEmailModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Send Email to {emailForm.contactEmail}</h3>
            {emailMsg && <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${emailMsg.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>{emailMsg}</div>}
            <form onSubmit={handleSendEmail}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input type="text" required value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message (HTML)</label>
                  <textarea rows="6" required value={emailForm.body} onChange={e => setEmailForm({ ...emailForm, body: e.target.value })} placeholder="<p>Dear attendee,</p><p>Your message here...</p>" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" disabled={sending} className="btn-primary flex-1">{sending ? 'Sending...' : 'Send Email'}</button>
                <button type="button" onClick={() => setShowEmailModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
