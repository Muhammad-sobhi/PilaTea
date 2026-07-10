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
import EventDrinkOrders from './pages/EventDrinkOrders'
import Newsletter from './pages/Newsletter'
import Finance from './pages/Finance'
import Expenses from './pages/Expenses'
import ExpenseForm from './pages/ExpenseForm'
import { Calendar, ClipboardList, Coffee, Award, UserPlus, Plus, ArrowRight } from 'lucide-react'
import PageHeader from './components/PageHeader'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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
          <Route path="memberships" element={<Memberships />} />
          <Route path="memberships/new" element={<MembershipForm />} />
          <Route path="memberships/:id/edit" element={<MembershipForm />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructors/new" element={<InstructorForm />} />
          <Route path="instructors/:id/edit" element={<InstructorForm />} />
          <Route path="discount-codes" element={<DiscountCodes />} />
          <Route path="events/:id/drinks" element={<EventDrinkOrders />} />
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

const iconComponents = [Calendar, ClipboardList, Coffee, Award, UserPlus]

function Dashboard() {
  const adminUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('admin_user') || '{}') : {}
  const [stats, setStats] = useState([
    { label: 'Events', count: '—', gradient: 'from-[#fce7f3] to-[#fce4ec]', iconColor: 'text-[#e883d4]' },
    { label: 'Bookings', count: '—', gradient: 'from-[#f3e8ff] to-[#ede9fe]', iconColor: 'text-[#cfa5e8]' },
    { label: 'Tea Items', count: '—', gradient: 'from-[#ecfdf5] to-[#d1fae5]', iconColor: 'text-[#5b8c5a]' },
    { label: 'Memberships', count: '—', gradient: 'from-[#fff7ed] to-[#ffedd5]', iconColor: 'text-[#d97706]' },
    { label: 'Users', count: '—', gradient: 'from-[#fdf2f8] to-[#fce7f3]', iconColor: 'text-[#db2777]' },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get('/admin/events').then(r => r.data?.length || 0).catch(() => 0),
      api.get('/admin/bookings').then(r => r.data?.length || 0).catch(() => 0),
      api.get('/admin/tea-items').then(r => r.data?.length || 0).catch(() => 0),
      api.get('/admin/memberships').then(r => r.data?.length || 0).catch(() => 0),
      api.get('/admin/users').then(r => r.data?.length || 0).catch(() => 0),
    ]).then(([events, bookings, tea, memberships, users]) => {
      setStats(prev => prev.map((s, i) => ({ ...s, count: [events, bookings, tea, memberships, users][i] })))
      setLoading(false)
    })
  }, [])

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Dashboard" description="Overview of your PILATEA studio" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {stats.map((s, i) => {
          const Icon = iconComponents[i]
          return (
            <div key={s.label} className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className={`rounded-xl p-3 bg-gradient-to-br ${s.gradient}`}>
                  <Icon size={22} strokeWidth={1.5} className={s.iconColor} />
                </div>
              </div>
              {loading ? (
                <div className="skeleton h-8 w-16 mt-4" />
              ) : (
                <p className="text-3xl font-bold text-[var(--color-text)] mt-4 tabular-nums">{s.count}</p>
              )}
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-6">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)] mb-1">Quick Actions</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-5">Common tasks to get started</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/events/new" className="btn-primary text-sm no-underline">
              <Plus size={16} /> New Event
            </Link>
            <Link to="/admin/tea-items/new" className="btn-secondary text-sm no-underline">
              <Plus size={16} /> New Tea Item
            </Link>
            <Link to="/admin/bookings" className="btn-secondary text-sm no-underline">
              <ArrowRight size={16} /> View Bookings
            </Link>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)] mb-1">Hello, {adminUser.name || 'Admin'} 👋</h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Manage your studio — events, bookings, tea menu, memberships, gallery, and more. Everything you need to run PILATEA is right here.
          </p>
        </div>
      </div>
    </div>
  )
}
