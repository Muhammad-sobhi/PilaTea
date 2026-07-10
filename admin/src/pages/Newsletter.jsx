import { useState, useEffect } from 'react'
import { sendMarketingEmail, getCampaigns, getEvents } from '../utils/api'
import { Send, Clock } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Newsletter() {
  const [form, setForm] = useState({ subject: '', body: '', recipient_type: 'all_subscribers', event_id: '' })
  const [campaigns, setCampaigns] = useState([])
  const [events, setEvents] = useState([])
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => {
    getCampaigns().then(r => setCampaigns(r.data || [])).catch(() => {})
    getEvents().then(r => setEvents(r.data || [])).catch(() => {})
  }

  useEffect(() => { load() }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    setSending(true)
    setMsg('')
    try {
      const payload = {
        subject: form.subject,
        body: form.body,
        recipient_type: form.recipient_type,
      }
      if (form.recipient_type === 'event_attendees') payload.event_id = form.event_id
      const res = await sendMarketingEmail(payload)
      setMsg(res.data?.message || 'Email sent successfully!')
      setForm({ subject: '', body: '', recipient_type: 'all_subscribers', event_id: '' })
      load()
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.message || err.message))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="animate-fadeIn max-w-3xl">
      <PageHeader title="Newsletter" description="Compose and send marketing emails to subscribers and attendees" />

      <div className="card p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-semibold tracking-tight mb-5">Compose Email</h2>
        {msg && <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${msg.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>{msg}</div>}
        <form onSubmit={handleSend}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Send to</label>
              <select value={form.recipient_type} onChange={e => setForm({ ...form, recipient_type: e.target.value })}>
                <option value="all_subscribers">All Subscribers</option>
                <option value="event_attendees">Event Attendees</option>
              </select>
            </div>
            {form.recipient_type === 'event_attendees' && (
              <div>
                <label className="block text-sm font-medium mb-1">Select Event</label>
                <select required value={form.event_id} onChange={e => setForm({ ...form, event_id: e.target.value })}>
                  <option value="">Choose event...</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title} — {ev.event_date}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Your email subject" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows="8" required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
                placeholder={'Hello!\n\nYour newsletter content here...\n\nWarmly,\nThe PILATEA Team'} />
            </div>
            {form.body && (
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Message Live Preview</label>
                <div className="border border-[var(--color-border)] rounded-xl p-4 bg-white min-h-[150px]" dangerouslySetInnerHTML={{ __html: form.body.replace(/\n/g, '<br />') }} />
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={sending} className="btn-primary">
              <Send size={16} /> {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Sent Campaigns</h2>
        </div>
        {campaigns.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--color-text-muted)]">No campaigns sent yet.</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {campaigns.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{c.subject}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    <Clock size={12} className="inline mr-1" />
                    {new Date(c.created_at).toLocaleString()} · {c.recipient_type.replace('_', ' ')} · {c.sent_count} sent
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
