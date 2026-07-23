import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import './index.css'
import api from './utils/api'
import App from './App'
import Login from './pages/Login'
import Events from './pages/Events'
import EventForm from './pages/EventForm'
import Bookings from './pages/Bookings'
import BookingDetail from './pages/BookingDetail'
import TeaItems from './pages/TeaItems'
import TeaItemForm from './pages/TeaItemForm'
import TeaCategories from './pages/TeaCategories'
import Memberships from './pages/Memberships'
import MembershipForm from './pages/MembershipForm'
import Gallery from './pages/Gallery'
import Testimonials from './pages/Testimonials'
import Contacts from './pages/Contacts'
import Instructors from './pages/Instructors'
import InstructorForm from './pages/InstructorForm'
import DiscountCodes from './pages/DiscountCodes'
import Settings from './pages/Settings'
import Users from './pages/Users'
import DashboardUsers from './pages/DashboardUsers'
import EmailTemplates from './pages/EmailTemplates'
import EventDrinkOrders from './pages/EventDrinkOrders'
import Newsletter from './pages/Newsletter'
import Finance from './pages/Finance'
import Expenses from './pages/Expenses'
import ExpenseForm from './pages/ExpenseForm'
import { Calendar, ClipboardList, Coffee, Award, UserPlus, Plus, ArrowRight, MoreHorizontal, Package, User, ChevronRight, Box, Sparkles, PieChart } from 'lucide-react'
import PageHeader from './components/PageHeader'
import Modal from './components/Modal'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={window.location.pathname.startsWith('/pilatea-admin') ? '/pilatea-admin' : '/'}>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="events/new" element={<EventForm />} />
          <Route path="events/:id/edit" element={<EventForm />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="tea-items" element={<TeaItems />} />
          <Route path="tea-items/new" element={<TeaItemForm />} />
          <Route path="tea-items/:id/edit" element={<TeaItemForm />} />
          <Route path="tea-categories" element={<TeaCategories />} />
          <Route path="users" element={<Users />} />
          <Route path="dashboard-users" element={<DashboardUsers />} />
          <Route path="memberships" element={<Memberships />} />
          <Route path="memberships/new" element={<MembershipForm />} />
          <Route path="memberships/:id/edit" element={<MembershipForm />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructors/new" element={<InstructorForm />} />
          <Route path="instructors/:id/edit" element={<InstructorForm />} />
          <Route path="discount-codes" element={<DiscountCodes />} />
          <Route path="bookings/:id/drinks" element={<EventDrinkOrders />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="finance" element={<Finance />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="expenses/new" element={<ExpenseForm />} />
          <Route path="expenses/:id/edit" element={<ExpenseForm />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

function Dashboard() {
  const adminUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('admin_user') || '{}') : {}
  const [stats, setStats] = useState([
    { label: 'Events', count: '—', subtitle: 'Active studio events', bg: 'bg-gradient-to-r from-[#7963F0] to-[#6246EA]', icon: Calendar },
    { label: 'Bookings', count: '—', subtitle: 'Customer reservations', bg: 'bg-gradient-to-r from-[#FF6B8B] to-[#FF8E53]', icon: ClipboardList },
    { label: 'Tea Items', count: '—', subtitle: 'Menu items', bg: 'bg-gradient-to-r from-[#4A52DE] to-[#32389E]', icon: Coffee },
    { label: 'Memberships', count: '—', subtitle: 'Subscription plans', bg: 'bg-gradient-to-r from-[#F9B661] to-[#FFAA5A]', icon: Award },
  ])
  const [recentBookings, setRecentBookings] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [confirmedPercent, setConfirmedPercent] = useState(85)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      api.get('/admin/events').then(r => r.data || []).catch(() => []),
      api.get('/admin/bookings').then(r => r.data || []).catch(() => []),
      api.get('/admin/tea-items').then(r => r.data || []).catch(() => []),
      api.get('/admin/memberships').then(r => r.data || []).catch(() => []),
    ]).then(([events, bookings, tea, memberships]) => {
      setStats([
        { label: 'EVENTS', count: events.length || '0', subtitle: 'Active studio events', bg: 'bg-gradient-to-r from-[#7963F0] to-[#6246EA]', icon: Calendar },
        { label: 'BOOKINGS', count: bookings.length || '0', subtitle: 'Customer reservations', bg: 'bg-gradient-to-r from-[#FF6B8B] to-[#FF8E53]', icon: ClipboardList },
        { label: 'TEA MENU', count: tea.length || '0', subtitle: 'Tea & drink items', bg: 'bg-gradient-to-r from-[#4A52DE] to-[#32389E]', icon: Coffee },
        { label: 'PLANS', count: memberships.length || '0', subtitle: 'Membership plans', bg: 'bg-gradient-to-r from-[#F9B661] to-[#FFAA5A]', icon: Award },
      ])
      setRecentBookings(bookings.slice(0, 5))
      setRecentEvents(events.slice(0, 4))
      
      // Calculate confirmed booking ratio
      if (bookings.length > 0) {
        const confirmed = bookings.filter(b => b.payment_status === 'confirmed' || b.payment_status === 'completed').length
        const pct = Math.round((confirmed / bookings.length) * 100)
        setConfirmedPercent(pct > 0 ? pct : 85)
      }

      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenBooking = (id) => {
    setSelectedBookingId(id)
    setIsBookingModalOpen(true)
  }

  const handleOpenEvent = (id) => {
    setSelectedEventId(id)
    setIsEventModalOpen(true)
  }

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[28px] p-6 sm:p-7 shadow-lg">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Welcome back, {adminUser.name || 'Admin'} 👋</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl font-medium">
            Manage your PILATEA studio classes, customer bookings, tea menu, and memberships seamlessly.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button onClick={() => { setSelectedEventId(null); setIsEventModalOpen(true); }} className="btn-primary text-xs cursor-pointer border-0">
            <Plus size={16} strokeWidth={2.5} /> New Event
          </button>
        </div>
      </div>

      {/* Top Row - 4 Vivid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon || Package
          return (
            <div key={i} className={`${s.bg} text-white rounded-[24px] p-5 shadow-lg shadow-purple-500/10 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200`}>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tabular-nums">{loading ? '...' : s.count}</span>
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-90">{s.label}</span>
                </div>
                <p className="text-[10px] font-medium opacity-75 mt-0.5 truncate">{s.subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Middle Row Grid: Recent Bookings Table + Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Bookings Card (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-100/80 rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">Recent Bookings</h2>
                <p className="text-xs text-slate-400 font-medium">Click any row to view full details</p>
              </div>
              <Link to="/admin/bookings" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 no-underline">
                View All →
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pb-2">REFERENCE</th>
                    <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pb-2">CUSTOMER</th>
                    <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pb-2">EVENT</th>
                    <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pb-2">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [1, 2, 3, 4].map(i => (
                      <tr key={i} className="bg-slate-50/60 rounded-2xl">
                        <td className="px-4 py-3.5 first:rounded-l-2xl"><div className="skeleton h-4 w-20 bg-slate-200/60" /></td>
                        <td className="px-4 py-3.5"><div className="skeleton h-4 w-36 bg-slate-200/60" /></td>
                        <td className="px-4 py-3.5"><div className="skeleton h-4 w-28 bg-slate-200/60" /></td>
                        <td className="px-4 py-3.5 last:rounded-r-2xl"><div className="skeleton h-4 w-16 bg-slate-200/60" /></td>
                      </tr>
                    ))
                  ) : recentBookings.length > 0 ? (
                    recentBookings.map((b) => (
                      <tr key={b.id} onClick={() => handleOpenBooking(b.id)} className="bg-slate-50/70 hover:bg-cyan-50/50 transition-all rounded-2xl group cursor-pointer">
                        <td className="px-4 py-3 text-xs font-bold text-slate-700 first:rounded-l-2xl">
                          <code className="bg-slate-200/60 px-2 py-0.5 rounded-md text-[11px] text-slate-800">{b.reference || `#${b.id}`}</code>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-800 truncate max-w-[180px]">{b.name || 'Guest User'}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-500 truncate max-w-[180px]">{b.event?.title || 'Studio Class'}</td>
                        <td className="px-4 py-3 text-xs last:rounded-r-2xl">
                          <span className={`badge text-[10px] ${b.payment_status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' : b.payment_status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                            {b.payment_status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-xs text-slate-400 font-medium">
                        No recent bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts Card (4 Columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-100/80 rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight mb-4">Quick Shortcuts</h2>

            <div className="space-y-3">
              <button onClick={() => { setSelectedEventId(null); setIsEventModalOpen(true); }} className="w-full text-left p-3.5 bg-purple-50/60 hover:bg-purple-100/60 border border-purple-100 rounded-2xl transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">New Studio Event</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Create a class or workshop</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <Link to="/admin/tea-items" className="no-underline w-full text-left p-3.5 bg-cyan-50/60 hover:bg-cyan-100/60 border border-cyan-100 rounded-2xl transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm">
                    <Coffee size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Tea Menu Items</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Manage tea & drinks menu</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link to="/admin/memberships" className="no-underline w-full text-left p-3.5 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-100 rounded-2xl transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Membership Plans</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Configure packages & plans</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="pt-4 text-center border-t border-slate-50 mt-4">
            <Link to="/admin/settings" className="text-xs font-extrabold text-slate-500 hover:text-slate-700 no-underline">
              Studio Settings →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row Grid: Upcoming Events List + Analytics Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Events Card (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-100/80 rounded-[28px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">Upcoming Studio Events</h2>
              <p className="text-xs text-slate-400 font-medium">Click to edit or update event details</p>
            </div>
            <Link to="/admin/events" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 no-underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pb-2">TITLE</th>
                  <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pb-2">LOCATION</th>
                  <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pb-2">CAPACITY</th>
                  <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pb-2">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="bg-slate-50/60 rounded-2xl">
                      <td className="px-4 py-3.5 first:rounded-l-2xl"><div className="skeleton h-4 w-32 bg-slate-200/60" /></td>
                      <td className="px-4 py-3.5"><div className="skeleton h-4 w-24 bg-slate-200/60" /></td>
                      <td className="px-4 py-3.5"><div className="skeleton h-4 w-16 bg-slate-200/60" /></td>
                      <td className="px-4 py-3.5 last:rounded-r-2xl"><div className="skeleton h-4 w-16 bg-slate-200/60" /></td>
                    </tr>
                  ))
                ) : recentEvents.length > 0 ? (
                  recentEvents.map((ev) => (
                    <tr key={ev.id} onClick={() => handleOpenEvent(ev.id)} className="bg-slate-50/70 hover:bg-indigo-50/50 transition-all rounded-2xl group cursor-pointer">
                      <td className="px-4 py-3 text-xs font-bold text-slate-800 first:rounded-l-2xl flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                          <Calendar size={14} />
                        </div>
                        <span>{ev.title}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-500 truncate max-w-[150px]">{ev.location_name || 'Studio'}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{ev.capacity || 20} spots</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-900 last:rounded-r-2xl">${ev.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-xs text-slate-400 font-medium">
                      No events scheduled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doughnut Chart Analytics Right Card (4 Columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-100/80 rounded-[28px] p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Booking Status Breakdown</h2>
          
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#7963F0]"
                strokeDasharray={`${confirmedPercent}, 100`}
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00D2FF]"
                strokeDasharray={`${100 - confirmedPercent}, 100`}
                strokeDashoffset={`-${confirmedPercent}`}
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-800">{confirmedPercent}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Confirmed</span>
            </div>
          </div>

          <div className="flex items-center gap-5 mt-3 text-[11px] font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7963F0]" />
              <span>Confirmed ({confirmedPercent}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D2FF]" />
              <span>Other ({100 - confirmedPercent}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <Modal isOpen={isBookingModalOpen} onClose={() => { setIsBookingModalOpen(false); loadData(); }} title="Booking Details" maxWidth="max-w-2xl">
        <BookingDetail bookingId={selectedBookingId} onClose={() => { setIsBookingModalOpen(false); loadData(); }} />
      </Modal>

      {/* Event Form Modal */}
      <Modal isOpen={isEventModalOpen} onClose={() => { setIsEventModalOpen(false); loadData(); }} title={selectedEventId ? 'Edit Event' : 'Create New Event'} maxWidth="max-w-2xl">
        <EventForm editId={selectedEventId} onSuccess={() => { setIsEventModalOpen(false); loadData(); }} onCancel={() => setIsEventModalOpen(false)} />
      </Modal>
    </div>
  )
}


