import { Outlet, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { logout } from './utils/api'
import {
  LayoutDashboard, Calendar, ClipboardList, Coffee, Tags, Award,
  UserPlus, Image, MessageSquare, Mail, Megaphone, Users, Percent,
  Settings, ExternalLink, LogOut, Banknote, Receipt, Send, Bell, Plus, Package, Sparkles, Layers, FileText, PieChart
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
    <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1.5 scrollbar-thin">
      {links.map(l => {
        if (l.adminOnly && !isAdmin) return null
        const Icon = iconMap[l.label] || LayoutDashboard
        return (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-xs font-semibold no-underline rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#00d2ff] to-[#00a2ff] text-white shadow-[0_6px_20px_rgba(0,180,255,0.35)] scale-[1.02]'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
              }`
            }>
            <Icon size={18} strokeWidth={2} className="shrink-0" />
            <span>{l.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('admin_token')
  const adminUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('admin_user') || '{}') : {}

  useEffect(() => {
    document.body.classList.remove('dark')
  }, [])

  if (!token) return <Navigate to="/admin/login" replace />

  const handleLogout = async () => {
    try { await logout() } catch {}
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  // Determine page title for breadcrumb
  const currentLink = links.find(l => l.end ? location.pathname === l.to : location.pathname.startsWith(l.to) && l.to !== '/admin')
  const pageName = currentLink ? currentLink.label : 'Overview'

  return (
    <div className="min-h-screen bg-[#f4f5fa] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* Outer Shell Card Matching Reference Image Container */}
      <div className="w-full max-w-[1550px] min-h-[90vh] bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-100 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 sm:w-72 shrink-0 border-r border-slate-100 flex flex-col bg-white py-6">
          {/* Logo Header */}
          <div className="px-6 pb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00d2ff] to-[#7963f0] flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 tracking-wider leading-none">PILATEA</h1>
              <p className="text-[10px] font-semibold text-slate-400 tracking-tight mt-1">Studio Management System</p>
            </div>
          </div>

          {/* Navigation Items */}
          <SidebarNav />

          {/* Sidebar Bottom Footer Links */}
          <div className="px-6 pt-4 mt-auto border-t border-slate-100/80">
            <div className="flex items-center justify-between px-1">
              <a href={import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000"} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1.5 no-underline">
                <ExternalLink size={14} /> Visit Site
              </a>
              <button onClick={handleLogout}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 flex items-center gap-1.5 cursor-pointer bg-transparent border-0">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content View Container */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#fafbfe]">
          {/* Header Bar */}
          <header className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-30">
            {/* Breadcrumb Navigation */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                <span>DASHBOARD</span>
                <span>/</span>
                <span className="text-slate-700">{pageName}</span>
              </div>
            </div>

            {/* Top Right Header Controls */}
            <div className="flex items-center gap-4">
              {/* Notification Icon */}
              <button className="relative w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
                <Bell size={18} strokeWidth={2} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-3 pl-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/20 overflow-hidden border-2 border-white">
                  {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
            </div>
          </header>


          {/* Body Content */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="page-enter">
              <Outlet />
            </div>
          </main>
        </div>

      </div>
    </div>
  )
}

