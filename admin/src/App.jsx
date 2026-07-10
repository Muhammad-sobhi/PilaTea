import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { logout } from './utils/api'
import {
  LayoutDashboard, Calendar, ClipboardList, Coffee, Tags, Award,
  UserPlus, Image, MessageSquare, Mail, Megaphone, Users, Percent,
  Settings, ExternalLink, LogOut, Banknote, Receipt, Send
} from 'lucide-react'

const iconMap = {
  Dashboard: LayoutDashboard, Events: Calendar, Bookings: ClipboardList,
  'Tea Items': Coffee, 'Tea Categories': Tags, Memberships: Award,
  Users: UserPlus, Gallery: Image, Testimonials: MessageSquare, Contacts: Mail,
  Instructors: Users, 'Discount Codes': Percent, Settings: Settings,
  Finance: Banknote, Expenses: Receipt, Newsletter: Send, 'Email Templates': Mail,
  'Dashboard Users': Users
}

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/tea-items', label: 'Tea Items' },
  { to: '/admin/tea-categories', label: 'Tea Categories' },
  { to: '/admin/memberships', label: 'Memberships' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/dashboard-users', label: 'Dashboard Users', adminOnly: true },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/contacts', label: 'Contacts' },
  { to: '/admin/newsletter', label: 'Newsletter' },
  { to: '/admin/email-templates', label: 'Email Templates' },
  { to: '/admin/instructors', label: 'Instructors' },
  { to: '/admin/discount-codes', label: 'Discount Codes' },
  { to: '/admin/finance', label: 'Finance' },
  { to: '/admin/expenses', label: 'Expenses' },
  { to: '/admin/settings', label: 'Settings' },
]

function SidebarNav() {
  const adminUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('admin_user') || '{}') : {}
  const isAdmin = adminUser.role === 'admin'

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-0.5">
      {links.map(l => {
        if (l.adminOnly && !isAdmin) return null
        const Icon = iconMap[l.label]
        return (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm font-medium no-underline rounded-lg transition-colors duration-150 ${
                isActive
                  ? 'bg-slate-700/60 text-white shadow-sm border-l-2 border-[var(--color-brand-lilac)] rounded-l-none'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-l-2 border-transparent rounded-l-none'
              }`
            }>
            <Icon size={18} strokeWidth={1.5} className="shrink-0" />
            {l.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

export default function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')

  useEffect(() => {
    document.body.classList.remove('dark')
  }, [])

  if (!token) return <Navigate to="/admin/login" replace />

  const handleLogout = async () => {
    try { await logout() } catch {}
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] transition-colors duration-200">
      <aside className="w-64 shrink-0 sticky top-0 h-screen flex flex-col bg-slate-900">
        <div className="px-6 pt-7 pb-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PILATEA" className="w-9 h-7 object-contain brightness-0 invert" />
            <span className="text-lg font-light tracking-wider text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>PILATEA</span>
          </div>
        </div>
        <SidebarNav />
        <div className="px-3 pb-4 pt-2 border-t border-slate-700/50 shrink-0 flex flex-col gap-0.5">
          <a href={import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000"} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium no-underline rounded-lg transition-colors duration-150 text-sky-300 hover:bg-slate-800/60 border-l-2 border-transparent rounded-l-none">
            <ExternalLink size={18} strokeWidth={1.5} className="shrink-0" />
            Visit Site
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium no-underline rounded-lg transition-colors duration-150 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-l-2 border-transparent rounded-l-none w-full text-left cursor-pointer bg-transparent">
            <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-[var(--color-bg)] transition-colors duration-200">
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          <div className="page-enter"><Outlet /></div>
        </div>
      </main>
    </div>
  )
}
