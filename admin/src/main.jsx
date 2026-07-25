/**
 * @file main.jsx
 * @description Entry point for the Pilatea Admin Dashboard application.
 * Configures client-side React Router navigation routes and renders the primary interactive Dashboard view.
 */

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

/**
 * Dashboard Component
 * Primary landing page view for authenticated studio staff and administrators.
 * Displays key analytical metric cards, recent booking requests, upcoming events, and quick action shortcuts.
 */
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
    <div className="animate-fadeIn space-y-4">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Welcome back, {adminUser.name || 'Admin'} 👋</h2>
          <p className="text-[11px] text-slate-300 mt-0.5 max-w-xl font-medium">
            Manage your PILATEA studio classes, customer bookings, tea menu, and memberships seamlessly.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => { setSelectedEventId(null); setIsEventModalOpen(true); }} className="btn-primary text-xs py-2 px-3 cursor-pointer border-0">
            <Plus size={14} strokeWidth={2.5} /> New Event
          </button>
        </div>
      </div>

      {/* Top Row - 4 Vivid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon || Package
          return (
            <div key={i} className={`${s.bg} text-white rounded-2xl p-3.5 shadow-sm flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-200`}>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tabular-nums">{loading ? '...' : s.count}</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">{s.label}</span>
                </div>
                <p className="text-[9px] font-medium opacity-75 truncate">{s.subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Middle Row Grid: Recent Bookings Table + Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Bookings Card (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-100/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">Recent Bookings</h2>
                <p className="text-[11px] text-slate-400 font-medium">Click any row to view details</p>
              </div>
              <Link to="/admin/bookings" className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 no-underline">
                View All →
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-1.5">
                <thead>
                  <tr>
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">REF</th>
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">CUSTOMER</th>
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">EVENT</th>
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="bg-slate-50/60 rounded-xl">
                        <td className="px-3 py-2 first:rounded-l-xl"><div className="skeleton h-3.5 w-16 bg-slate-200/60" /></td>
                        <td className="px-3 py-2"><div className="skeleton h-3.5 w-28 bg-slate-200/60" /></td>
                        <td className="px-3 py-2"><div className="skeleton h-3.5 w-24 bg-slate-200/60" /></td>
                        <td className="px-3 py-2 last:rounded-r-xl"><div className="skeleton h-3.5 w-14 bg-slate-200/60" /></td>
                      </tr>
                    ))
                  ) : recentBookings.length > 0 ? (
                    recentBookings.slice(0, 4).map((b) => (
                      <tr key={b.id} onClick={() => handleOpenBooking(b.id)} className="bg-slate-50/70 hover:bg-cyan-50/50 transition-all rounded-xl group cursor-pointer">
                        <td className="px-3 py-2 text-[11px] font-bold text-slate-700 first:rounded-l-xl">
                          <code className="bg-slate-200/60 px-1.5 py-0.5 rounded text-[10px] text-slate-800">{b.reference || `#${b.id}`}</code>
                        </td>
                        <td className="px-3 py-2 text-[11px] font-semibold text-slate-800 truncate max-w-[150px]">{b.name || 'Guest User'}</td>
                        <td className="px-3 py-2 text-[11px] font-medium text-slate-500 truncate max-w-[150px]">{b.event?.title || 'Studio Class'}</td>
                        <td className="px-3 py-2 text-[11px] last:rounded-r-xl">
                          <span className={`badge text-[9px] py-0.5 px-2 ${b.payment_status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' : b.payment_status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                            {b.payment_status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-xs text-slate-400 font-medium">
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
        <div className="lg:col-span-4 bg-white border border-slate-100/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight mb-3">Quick Shortcuts</h2>

            <div className="space-y-2">
              <button onClick={() => { setSelectedEventId(null); setIsEventModalOpen(true); }} className="w-full text-left p-2.5 bg-purple-50/60 hover:bg-purple-100/60 border border-purple-100 rounded-xl transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">New Studio Event</h3>
                    <p className="text-[9px] text-slate-500 font-medium">Create class or workshop</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <Link to="/admin/tea-items" className="no-underline w-full text-left p-2.5 bg-cyan-50/60 hover:bg-cyan-100/60 border border-cyan-100 rounded-xl transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-sm">
                    <Coffee size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Tea Menu Items</h3>
                    <p className="text-[9px] text-slate-500 font-medium">Manage tea & drinks menu</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link to="/admin/memberships" className="no-underline w-full text-left p-2.5 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-100 rounded-xl transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-sm">
                    <Award size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Membership Plans</h3>
                    <p className="text-[9px] text-slate-500 font-medium">Configure packages & plans</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-50 mt-3">
            <Link to="/admin/settings" className="text-[11px] font-extrabold text-slate-500 hover:text-slate-700 no-underline">
              Studio Settings →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row Grid: Upcoming Events List + Analytics Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Upcoming Events Card (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-100/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">Upcoming Studio Events</h2>
              <p className="text-[11px] text-slate-400 font-medium">Click to view details</p>
            </div>
            <Link to="/admin/events" className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 no-underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-1.5">
              <thead>
                <tr>
                  <th className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">TITLE</th>
                  <th className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">LOCATION</th>
                  <th className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">CAPACITY</th>
                  <th className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="bg-slate-50/60 rounded-xl">
                      <td className="px-3 py-2 first:rounded-l-xl"><div className="skeleton h-3.5 w-28 bg-slate-200/60" /></td>
                      <td className="px-3 py-2"><div className="skeleton h-3.5 w-20 bg-slate-200/60" /></td>
                      <td className="px-3 py-2"><div className="skeleton h-3.5 w-14 bg-slate-200/60" /></td>
                      <td className="px-3 py-2 last:rounded-r-xl"><div className="skeleton h-3.5 w-12 bg-slate-200/60" /></td>
                    </tr>
                  ))
                ) : recentEvents.length > 0 ? (
                  recentEvents.slice(0, 3).map((ev) => (
                    <tr key={ev.id} onClick={() => handleOpenEvent(ev.id)} className="bg-slate-50/70 hover:bg-indigo-50/50 transition-all rounded-xl group cursor-pointer">
                      <td className="px-3 py-2 text-[11px] font-bold text-slate-800 first:rounded-l-xl flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Calendar size={12} />
                        </div>
                        <span className="truncate max-w-[160px]">{ev.title}</span>
                      </td>
                      <td className="px-3 py-2 text-[11px] font-medium text-slate-500 truncate max-w-[130px]">{ev.location_name || 'Studio'}</td>
                      <td className="px-3 py-2 text-[11px] font-semibold text-slate-700">{ev.capacity || 20} spots</td>
                      <td className="px-3 py-2 text-[11px] font-bold text-slate-900 last:rounded-r-xl">${ev.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-xs text-slate-400 font-medium">
                      No events scheduled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doughnut Chart Analytics Right Card (4 Columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-100/80 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Booking Status Breakdown</h2>
          
          <div className="relative w-28 h-28 flex items-center justify-center my-1">
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
              <span className="text-lg font-black text-slate-800">{confirmedPercent}%</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Confirmed</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#7963F0]" />
              <span>Confirmed ({confirmedPercent}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
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


